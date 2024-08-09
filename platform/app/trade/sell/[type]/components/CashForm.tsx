"use client"

import { useState } from "react"
import { useWriteContract, useSwitchChain } from "wagmi"
import marketAbi from "../../../../../public/market.abi.json"
import { baseSepolia } from "wagmi/chains"
import { useRouter } from "next/navigation"

type CoinFormData = {
    lockedErc20: string
    iban: string
    amount: string
}

const CashForm = () => {
    const [formData, setFormData] = useState<CoinFormData>({
        lockedErc20: '',
        iban: '',
        amount: ''
    })

    const { writeContract, isError } = useWriteContract()
    const { switchChain } = useSwitchChain()
    const router = useRouter()

    const sendTransaction = () => {
        switchChain({ chainId: baseSepolia.id })
        writeContract({
            address: '0x6dA6ac6E51a4cA0d9D79a689DDb8ef64A921C3C1',
            abi: marketAbi,
            functionName: 'createEscrow',
            args: [formData.lockedErc20,
            Number(formData.amount),
            formData.iban
            ],
        })
        router.push("/trade")

    }
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Sell Your Tokens for Cash</h2>

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
                            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">How much you want to get for tokens ?</label>
                            <input
                                value={formData?.amount}
                                onChange={(event) => setFormData((prev) => ({
                                    ...prev,
                                    amount: event.target.value!
                                }))} name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>
                        <div>
                            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Your IBAN</label>
                            <input
                                value={formData?.iban}
                                onChange={(event) => setFormData((prev) => ({
                                    ...prev,
                                    iban: event.target.value!
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

export default CashForm