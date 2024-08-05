"use client"

import { IDKitWidget, ISuccessResult, VerificationLevel, useIDKit } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import worldcoinAbi from "../../public/worldcoin-verifier.abi.json"
import { useAccount, useSimulateContract, useSwitchChain, useWriteContract } from "wagmi";
import { baseSepolia } from "viem/chains";
import { ConnectKitButton } from "connectkit";
declare global {
    interface Window {
        ethereum?: any;
    }
}

const CustomNavbar = () => {
    const [wordCoinAddress, setWordCoinAddress] = useState<ISuccessResult>()
    const [userWalletAddress, setUsetWalletAddress] = useState("")
    const { address } = useAccount()

    const { switchChain } = useSwitchChain()

    const { writeContract, isError } = useWriteContract()

    const sendTransaction = async () => {
        try {
            switchChain({ chainId: baseSepolia.id })
            writeContract({
                address: '0x234F92917d1FdFDE44B2B0E6f3411D2562cC7dFB',
                abi: worldcoinAbi,
                functionName: 'verifyAndExecute',
                args: [userWalletAddress,
                    wordCoinAddress?.merkle_root,
                    wordCoinAddress?.nullifier_hash,
                    wordCoinAddress?.proof
                ],
            })
        } catch (error) {
            console.error('Transaction error:', error);
        }
    };


    useEffect(() => {
        if (address) {
            setUsetWalletAddress(address)
        }
        if (wordCoinAddress !== undefined) {
            sendTransaction()
        }
    }, [address, wordCoinAddress])

    const onSuccess = (data: ISuccessResult) => {
        console.log(data);
        setWordCoinAddress(data)
    }
    return (
        <header className=" flex items-center justify-between border-b py-4  md:py-8 ">
            <a href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl" aria-label="logo">
                Nexarb
            </a>

            <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_WORLD_COIN_ID!}
                action="login"
                verification_level={VerificationLevel.Device}
                onSuccess={onSuccess}>
                {({ open }) => (
                    <div className="flex flex-col gap-4">
                        <button onClick={open} className="block rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Verify with World ID</button>
                        <div className="z-50"><ConnectKitButton showBalance /></div>
                    </div>
                )}
            </IDKitWidget>

            <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>

                Menu
            </button>
        </header>
    )
}


export default CustomNavbar;