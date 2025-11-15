import { http, createConfig } from 'wagmi'
import { intuition } from './chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect project ID - you'll need to get one from https://cloud.walletconnect.com/
const projectId = 'c11efb958ed18b31bffb22db236f7c48' // Replace this!

export const config = createConfig({
  chains: [intuition],
  connectors: [
    injected(), // MetaMask, Rabby, etc.
    walletConnect({ projectId }), // WalletConnect for mobile wallets
    coinbaseWallet({ appName: 'Intuition PnL Card' }), // Coinbase Wallet
  ],
  transports: {
    [intuition.id]: http('https://rpc.intuition.systems'),
  },
})
