import { projectId, config } from "@/wagmi.connector";
import { createWeb3Modal } from "@web3modal/wagmi";
import { HTMLProps } from "react";
import { WagmiProvider } from 'wagmi';
import { WagmiCustomProvider } from "@/wagmi";
import CustomNavbar from "./navbar";

// Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
});


export const Layout = ({ children }: Readonly<HTMLProps<HTMLDivElement>>) => {
    return (
        <WagmiCustomProvider>
            <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <CustomNavbar />
                    {children}
                </div>
            </div>
        </WagmiCustomProvider>
    )
}