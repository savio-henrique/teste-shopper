'use client'

import { updateProduct, validateParams } from '@/lib/Products';
import Papa from 'papaparse';
import { useState } from "react"

export default function Form() {
    const [invalid, setInvalid] = useState(true)
    const [errors,setErrors] = useState(null)
    
    const handleSubmit = async (e:any) => {
        // @ts-ignore
        const file = document.getElementById('file').files[0]

        Papa.parse(file, {
            skipEmptyLines: true,
            header: true,
            complete: async function(results) {
                let params : Params[] = []
                results.data.forEach((value,index,array) => {
                    const param :Params = {
                        // @ts-ignore
                        product_code: value.product_code,
                        // @ts-ignore
                        new_price: value.new_price
                        
                    }
                    params.push(param)
                })
                await updateProduct(params)
                .then((response) => {
                    console.log(response)
                })
            }
        })

        
    }

    const handleValidate = async (event:any) => {
        // @ts-ignore
        const file = document.getElementById('file').files[0]

        Papa.parse(file, {
            skipEmptyLines: true,
            header: true,
            complete: async function(results) {
                let params : Params[] = []
                results.data.forEach((value,index,array) => {
                    const param :Params = {
                        // @ts-ignore
                        product_code: value.product_code,
                        // @ts-ignore
                        new_price: value.new_price
                        
                    }
                    params.push(param)
                })
                await validateParams(params)
                .then((response) => {
                    console.log(response)
                    if(response === true){
                        setInvalid(false)
                    } else{
                        setErrors(response)
                    }})
            }
        })

        
    }

    return(
        <section className=" bg-slate-500 rounded-md p-6 flex justify-center">
            <form onSubmit={handleSubmit}>
                <input
                type="file"
                accept=".csv, text/csv"
                id='file'
                onChange={handleSubmit}
                className="bg-white p-2 w-80 text-xl rounded-l-xl py-5" />
                <span onClick={handleValidate}
                className="rounded-r-xl text-xl font-bold text-white px-10 py-6 bg-red-600 hover:bg-red-700 hover:cursor-pointer">VALIDAR</span>
                <button className="px-10 py-5 mx-4 rounded-xl text-xl font-bold text-white bg-green-500 disabled:bg-green-900 hover:bg-green-400" type="submit" disabled={invalid}>ATUALIZAR</button>
            </form>
        </section>
    )
    
}