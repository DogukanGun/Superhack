import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

const metadata = {
  name: 'Nexarb',
  description: 'Nexarb Wallet',
  url: 'https://web3ai.nexarb.com', // origin must match your domain & subdomain
  icons: []
}
// Create wagmiConfig
export const config = defaultWagmiConfig({
    chains: [baseSepolia, base], // required
    projectId, // required
    metadata, // required
    ssr: true,
    storage: createStorage({
      storage: cookieStorage
    }),
    enableWalletConnect: true, // Optional - true by default
    enableInjected: true, // Optional - true by default
    enableEIP6963: true, // Optional - true by default
    enableCoinbase: true, // Optional - true by default
  })