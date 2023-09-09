export default async function getAllProducts(){
    const response = await fetch('http://172.18.0.2:3333/products')

    if (!response) {
        throw new Error("Failed to fetch")
    }
    return response.json()
}

export async function validateParams(params: Params[]) {
    const paramsJSON = JSON.stringify(params)
    const response =  await fetch('http://172.18.0.2:3333/validate',{
        method: 'PUT', mode: "cors", headers: {"content-type": "application/json"}, body: paramsJSON})
    
    return response.json()
}

export async function updateProduct(params: Params[]){
    const paramsJSON = JSON.stringify(params)
    const response =  await fetch('http://172.18.0.2:3333/products',{
        method: 'PUT', mode: "cors", headers: {"content-type": "application/json"}, body: paramsJSON})
    
    return response.json()
}