import connection from "../services/database"
import { Request, Response } from "express"
import { Connection } from "mysql2/typings/mysql/lib/Connection"

// Definição do tipo dos parâmetros
type Params = {
    id: number,
    new_price: number
}

// Definição do tipo de erro

type ValidError = {
    id: number,
    error: string[]
}

// Definição da tipo de produtos
type Product ={
    id: number,
    name: string,
    cost_price: number,
    sale_price: number
}

// Definição da tipo de packs de itens
type Pack = {
    packId: number,
    name: string,
    products: (Product & {qty:number})[],
    sale_price: number
}

// Definição de interface da controladora
interface IProductController{
    list(): Promise<Array<Product>>,
    listPack(): Promise<Array<Pack>>,
    // create(product: Product | Pack): Promise<boolean>,
    // read(id:number): Promise<Product | Pack | boolean>,
    validate(params:Params[]): Promise<boolean|ValidError[]>
    update(params:Params[]): Promise<boolean|ValidError[]>,
    // delete(id:number): Promise<boolean>
}

// Controladora dos produtos
class ControllerProduct implements IProductController {
    // Conexão com o banco de dados
    database: Connection

    constructor(){
        this.database = connection
    }

    private async get_info(sql:string):Promise<any>{
        const result = await this.database.promise().query(sql)
        return result[0]
    }

    // Query com dados dinâmicos
    private async use_query_data(sql:string,data:Array<any>):Promise<any>{
        const result = await this.database.promise().query(sql,data);
        return result[0]
    }

    public async validate(params:Params[]) : Promise<boolean|ValidError[]>{        
        const errorList :ValidError[] = [] 

        // Encontra o erro na Lista
        const errorFind = (id:number,erro:string) => {
            var find = errorList.find((erro) => erro.id === id)
                !find ?
                    errorList.push({id, error:[erro]})
                    : find.error.push(erro)
        }

        const products = await this.list()
        const packs = await this.listPack()
        for(let i = 0; i < params.length; i++){
            const {id,new_price} = params[i] // Parâmetro 
            const product = products.find((item) => id === item.id) // Produto(caso ache)
            const pack = packs.find((item) => id === item.packId) // Pack(caso ache)
            
            // Verifica se o produto existe
            if (!product) { 
                errorFind(id,"Produto não existe.")
                continue
            }
            
            // Verifica se os itens estão nos parâmetros e se somam no preço do pack
            if (pack){

                // Parâmetros filtrados com os itens componentes
                const filteredParams = params.filter((param) => pack.products.find((item) => param.id === item.id))
                
                // Soma dos preços dos items componentes
                var priceSum = 0
                
                // Tag para saber se o item está no arquivo
                var itemFlag = true

                // Iterando nos produtos componentes 
                for(let x = 0; x < pack.products.length; x++){
                    var item = filteredParams.find((param) => pack.products[x].id === param.id)
                    
                    // Se o item for encontrado a soma será feita com o novo preço
                    if (!item) {
                        priceSum += (pack.products[x].sale_price * pack.products[x].qty)*100;
                        itemFlag = false
                    } else {
                        priceSum += (item.new_price * pack.products[x].qty) * 100;
                    }
                }
                // Se o preço da soma não for igual ao do pacote
                if (new_price !== priceSum/100) {
                    errorFind(id, "Preço dos componentes não somam no do pacote.")
                    
                    // Se o preço dos componentes não somarem o mesmo e não estão no arquivo
                    if (!itemFlag) errorFind(id, "Produtos dentro do pacote não estão com o preço novo.")    
                }
            }

            // Verifica o preço de venda abaixo do de custo
            if (new_price < product.cost_price) {
                 errorFind(id, "Preço de venda abaixo do preço de custo.")
            }

            // Verifica a taxa de reajuste de 10%
            if ((product.sale_price + (product.sale_price * 0.10) <= new_price) ||
                (product.sale_price - (product.sale_price * 0.10) >= new_price)) {
                    errorFind(id,"Preço fora da taxa de reajuste.")
                }
        }
        return errorList.length == 0 ? true : errorList;
    }

    // Listar os Produtos
    public async list() : Promise<Array<Product>> {
        var final = new Array<Product>
        const sql = "SELECT * FROM `products`"

        await this.get_info(sql)
            .then ((result) => {
                result.map((data:any) => {
                    const product:Product = {
                        id: data.code,
                        name: data.name,
                        cost_price: data.cost_price,
                        sale_price: data.sales_price,
                    }
                    final.push(product);
                })
            })
        
        return final;
    } 

    // Listar os packs
    public async listPack(): Promise<Array<Pack>>{
        var final = new Array<Pack>
        const sql = "SELECT * FROM `packs`"
        const products = await this.list()
        await this.get_info(sql)
            .then ((result) => {
                result.map((data:any) => {
                    const product: Product & {qty: number} = Object.assign({},products.filter((product) => data.product_id === product.id)[0] , {qty: data.qty})
                    const dupe = final.find((pack) => pack.packId === data.pack_id)
                    if (!dupe){
                        const packProduct = products.find((product) => data.pack_id === product.id)
                        const pack: Pack = {
                            name: packProduct ? packProduct.name: '',
                            packId: data.pack_id,
                            products: [product],
                            sale_price: packProduct ? packProduct.sale_price : 0
                        }
                        final.push(pack)
                    } 
                    else {
                        dupe.products.push(product)
                    }

                })
            })

        return final
    }

    // Atualizar com os preços novos
    public async update(params:Params[]): Promise<boolean|ValidError[]>{
        var final = false; 
        const sql = "UPDATE `products` SET `sales_price` = ? WHERE `code` = ?" 
        
        // Validação dos parâmetros
        const isValid = await this.validate(params)
        // if (isValid !== true) return isValid
        //     for(let i = 0; i< params.length; i++){
        //         var values = [params[i].new_price, params[i].id]

        //         await this.use_query_data(sql,values)
        //         .then((result:Array<any>) => {
        //             final = true;
        //         })
        //     }
        return final;
    }
    
}

// Classe singleton para o uso de funções de Roteamento da API
class ProductRoutes {
    private static instance: ProductRoutes
    private static controller: IProductController

    private constructor(){
        ProductRoutes.controller = new ControllerProduct();
    }

    static getInstance():ProductRoutes{
        if (this.instance == null){
            this.instance = new ProductRoutes();
        }
        return this.instance;
    }

    public async index(req: Request, res: Response){
        return res.json(await ProductRoutes.controller.list())
    }

    public async listPack(req :Request, res:Response){
        return res.json(await ProductRoutes.controller.listPack())
    }

    public async update(req :Request, res:Response){
        console.log(req.body)
        const request : Params[] = [] 
        req.body.forEach((element:any) => {
            const param : Params = {
                id: parseInt(element.product_code),
                new_price: parseFloat(element.new_price)
            } 
            request.push(param)
        });
        console.log(request)
        return res.json(await ProductRoutes.controller.update(request))
    }

    public async validate(req :Request, res:Response){
        console.log(req.body)
        const request : Params[] = [] 
        req.body.forEach((element:any) => {
            const param : Params = {
                id: parseInt(element.product_code),
                new_price: parseFloat(element.new_price)
            } 
            request.push(param)
        });
        console.log(request)
        return res.json(await ProductRoutes.controller.validate(request))
    }
}

export default ProductRoutes;