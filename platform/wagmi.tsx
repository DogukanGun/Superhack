'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi.connector';
import { ConnectKitProvider } from 'connectkit';

type ProvidersProps = Readonly<{
    children: React.ReactNode;
}>;

const queryClient = new QueryClient()

export const WagmiCustomProvider = ({ children }: ProvidersProps) => {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (<WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <ConnectKitProvider theme="retro">
                {children}
            </ConnectKitProvider>
        </QueryClientProvider>
    </WagmiProvider>)
}