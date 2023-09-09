import Form from "./components/Form";
import Products from "./components/Products";


export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <h1 className="font-bold mt-12 mb-12 text-4xl text-center dark:text-white">
        Atualizador de Produtos 
      </h1>
      <Form />
      <Products />
    </main>
  )
}
