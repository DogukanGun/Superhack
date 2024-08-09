"use client"

import { useParams } from "next/navigation";
import marketAbi from "../../../../public/market.abi.json"
import { useReadContract } from "wagmi";
import { useMemo } from "react";
import Link from "next/link";


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
    lockedErc20Address: String;
    lockedErc20Symbol: String;
    lockedAmount: Number;
    demandedErc20Address: String;
    demandedErc20Symbol: String;
    demandedAmount: Number;
    smartContract: String
    address: String;
}

const Buy = () => {
    const type = useParams()?.type

    const functionName = useMemo(() => {
        return type == 'cash' ? 'getEscrows' : 'getTrades'
    }, [type])

    const { data } = useReadContract({
        abi: marketAbi,
        address: '0x6dA6ac6E51a4cA0d9D79a689DDb8ef64A921C3C1',
        functionName: functionName,
    })

    const pay = (payload: CoinBuy) => {

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
                                    <td className="px-6 py-4">
                                        <button onClick={() => pay(offer)}
                                            className="block rounded-lg bg-gray-800 px-8 py-3 
                                        text-center text-sm font-semibold text-white 
                                        outline-none ring-gray-300 transition duration-100 
                                        hover:bg-gray-700 focus-visible:ring 
                                        active:bg-gray-600 md:text-base">Pay
                                        </button>

                                    </td>
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