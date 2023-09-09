import getAllProducts from "@/lib/Products";
import ListItem from "./ListItem";

export default async function Products() {
    const productsData = getAllProducts()
    const products = await productsData
    return (
        <section className=" bg-slate-200 rounded-md p-3 flex flex-col align-middle mt-6 mx-auto max-w-3xl">
            <h2 className=" text-2xl font-bold text-center">Lista de produtos</h2>
            <ul>
                {products.map((product:Product) => (
                    <ListItem key={product.id} product={product} />
                ))}
            </ul>
        </section>
    )
}