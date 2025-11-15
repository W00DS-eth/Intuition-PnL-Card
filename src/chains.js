import { defineChain } from 'viem'

export const intuition = defineChain({
  id: 1155,
  name: 'Intuition',
  nativeCurrency: {
    decimals: 18,
    name: 'TRUST',
    symbol: 'TRUST',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.intuition.systems'],
    },
    public: {
      http: ['https://rpc.intuition.systems'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Explorer',
      url: 'https://explorer.intuition.systems',
    },
  },
})