"use client"

import { useState } from "react"
import { useSwitchChain, useWriteContract } from "wagmi"
import marketAbi from "../../../../../public/market.abi.json"
import { baseSepolia } from "wagmi/chains"
import { useRouter } from "next/navigation"
type CoinFormData = {
    lockedErc20: string
    demendedErc20: string
    amount: string
}

const CoinForm = () => {

    const [formData, setFormData] = useState<CoinFormData>({
        lockedErc20: '',
        demendedErc20: '',
        amount: ''
    })

    const { writeContract, isError } = useWriteContract()
    const { switchChain } = useSwitchChain()
    const router = useRouter()

    const sendTransaction = () => {
        switchChain({ chainId: baseSepolia.id })
        writeContract({
            address: '0x19645f6aBA4D66B48067ddAA1785bb67CAD50016',
            abi: marketAbi,
            functionName: 'createTrade',
            args: [formData.lockedErc20,
                formData.demendedErc20,
                formData.amount
            ],
        })
        router.push("/trade")
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Sell Your Tokens for Another Token</h2>

                <div className="mx-auto max-w-lg rounded-lg border">
                    <div className="flex flex-col gap-4 p-4 md:p-8">
                        <div>
                            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Listed Token Address</label>
                            <input
                                value={formData?.lockedErc20}
                                onChange={(event) => setFormData((prev) => ({
                                    ...prev,
                                    lockedErc20: event.target.value!
                                }))}
                                name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>
                        <div>
                            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Requested Token Address</label>
                            <input
                                value={formData?.demendedErc20}
                                onChange={(event) => setFormData((prev) => ({
                                    ...prev,
                                    demendedErc20: event.target.value!
                                }))} name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>
                        <div>
                            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">How many tokens you want to get for your tokens ?</label>
                            <input
                                value={formData?.amount}
                                onChange={(event) => setFormData((prev) => ({
                                    ...prev,
                                    amount: event.target.value!
                                }))}
                                name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>
                        <button onClick={sendTransaction} className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">List Tokens</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoinForm