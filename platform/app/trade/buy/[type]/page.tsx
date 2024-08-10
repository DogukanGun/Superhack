"use client"

import { useParams } from "next/navigation";
import marketAbi from "../../../../public/market.abi.json"
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import tradeAbi from "../../../../public/trade.abi.json"
import erc20Abi from "../../../../public/erc20.abi.json"

type CashBuy = {
    lockedErc20Address: String;
    lockedErc20Symbol: String;
    lockedAmount: Number;
    iban: String;
    demandedAmount: Number;
    smartContract: String
    address: String;
}

type CoinBuy = {
    lockedErc20Address: `0x${string}`;
    lockedErc20Symbol: String;
    lockedAmount: Number;
    demandedErc20Address: `0x${string}`;
    demandedErc20Symbol: String;
    demandedAmount: Number;
    smartContract: `0x${string}`
    seller:string;
    address: String;
}

const Buy = () => {
    const type = useParams()?.type
    const [activePayload,setActivePayload] = useState<CoinBuy>()
    const functionName = useMemo(() => {
        return type == 'cash' ? 'getEscrows' : 'getTrades'
    }, [type])

    const { writeContract, isSuccess } = useWriteContract()
    const { address } = useAccount()
    const { data } = useReadContract({
        abi: marketAbi,
        address: '0x6fCf751f3B761f46e70F1BA9A7b50608C6Ddd466',
        functionName: functionName,
    })

    const approve = (payload: CoinBuy) => {
        writeContract({
            abi:erc20Abi,
            address:payload.demandedErc20Address,
            functionName:"approve",
            args:[
                payload.smartContract,
                payload.demandedAmount
            ]
        })
        setActivePayload(payload)
    }

    const pay = (payload: CoinBuy) => {
        writeContract({
            abi: tradeAbi,
            address: payload.smartContract,
            functionName:"unlock"
        })
    }
    
    const lock = (payload: CoinBuy) => {
        writeContract({
            abi: tradeAbi,
            address: payload.smartContract,
            functionName:"lockManual"
        })
    }

    return <>
        <div className="relative h-screen overflow-x-auto text-white">
            <table className="w-full text-white text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Token
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {type == 'cash' ? 'IBAN' : 'Demanden Token'}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Demanded Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {type == 'cash' ? 'Upload Receipt' : 'Smart Contract Address'}
                        </th>
                        {type == 'coin' && <th scope="col" className="px-6 py-3">
                            Pay
                        </th>}
                    </tr>
                </thead>
                <tbody className="text-white">
                    {type == 'cash' ?
                        (data as CashBuy[])?.map((offer) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {offer.lockedErc20Symbol}
                                    </th>
                                    <td className="px-6 py-4">
                                        {offer.iban}
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.demandedAmount.toString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href="/invoince"
                                            className="block rounded-lg bg-gray-800 px-8 py-3 text-center
                                         text-sm font-semibold text-white outline-none ring-gray-300 
                                         transition duration-100 hover:bg-gray-700 focus-visible:ring 
                                         active:bg-gray-600 md:text-base">Pay Invoince</Link>

                                    </td>
                                </tr>
                            )
                        })
                        :
                        (data as CoinBuy[])?.map((offer) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {offer.lockedErc20Symbol}
                                    </th>
                                    <td className="px-6 py-4">
                                        {offer.demandedErc20Symbol}
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.demandedAmount.toString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.smartContract}
                                    </td>
                                    {offer.seller != address &&<td className="px-6 py-4">
                                        <button onClick={() => 
                                            activePayload === undefined ?
                                                approve(offer) : pay(offer)
                                        
                                        }
                                            className="block rounded-lg bg-gray-800 px-8 py-3 
                                        text-center text-sm font-semibold text-white 
                                        outline-none ring-gray-300 transition duration-100 
                                        hover:bg-gray-700 focus-visible:ring 
                                        active:bg-gray-600 md:text-base">
                                            {activePayload === undefined ? "Approve" : "Pay"}
                                        </button>

                                    </td>}
                                    {offer.seller == address && <td className="px-6 py-4">
                                        <button onClick={() => lock(offer)}
                                            className="block rounded-lg bg-gray-800 px-8 py-3 
                                        text-center text-sm font-semibold text-white 
                                        outline-none ring-gray-300 transition duration-100 
                                        hover:bg-gray-700 focus-visible:ring 
                                        active:bg-gray-600 md:text-base">
                                            Lock
                                        </button>
                                    </td>}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    </>
}

export default Buy;