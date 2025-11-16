import { http, createConfig } from 'wagmi'
import { intuition } from './chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// WalletConnect project ID - Get your own at https://cloud.walletconnect.com/
// Replace with your real project ID!
const projectId = 'c11efb958ed18b31bffb22db236f7c48' // REPLACE THIS

export const config = getDefaultConfig({
  appName: 'Intuition PnL Card',
  projectId: projectId,
  chains: [intuition],
  ssr: false, // Not using server-side rendering
})