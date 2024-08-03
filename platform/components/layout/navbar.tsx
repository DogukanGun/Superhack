"use client"

import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";

const CustomNavbar = () => {
    const [wordCoinAddress, setWordCoinAddress] = useState<ISuccessResult>()
    const [userWalletAddress, setUsetWalletAddress] = useState("")

    const onSuccess = (data: ISuccessResult) => {
        console.log(data);
        setWordCoinAddress(data)
        //TODO verify worldcoin onchain
    }
    return (
        <header className="mb-8 flex items-center justify-between border-b py-4 md:mb-12 md:py-8 xl:mb-16">
            <a href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl" aria-label="logo">
                Nexarb
            </a>

            <nav className="hidden gap-12 lg:flex">
                <a href="#" className="text-lg font-semibold text-indigo-500">Home</a>
            </nav>

            <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_WORLD_COIN_ID!}// obtained from the Developer Portal
                action="login_eth" // this is your action name from the Developer Portal
                onSuccess={onSuccess} // callback when the modal is closed
                signal={userWalletAddress} // prevents tampering with a message
                credential_types={[CredentialType.Orb, CredentialType.Phone]} // optional, defaults to ['orb']
            >
                {({ open }) =>
                    <div className="flex flex-col gap-4">
                        <button onClick={open} className="block rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Verify with World ID</button>
                    </div>
                }
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