import Link from "next/link"

type Props = {
    product: Product
}

export default function ListItem({product}: Props){
    const { id, name, cost_price, sale_price } = product

    return (
        <li className="">
                <div className=" bg-gray-400 hover:bg-gray-500 border border-gray-500 hover:border-gray-700 rounded-md hover:text-gray-300">
                    <p className="underline">{name}</p>
                    <br />
                    <div className="flex flex-row">
                        <p className="text-sm mt-1">R${cost_price}</p>
                        <p className="text-sm mt-1">R${sale_price}</p>
                    </div>
                </div>
        </li>
    )
}