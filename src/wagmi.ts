// src/wagmi.ts
import { createConfig, configureChains } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== sepolia.id) return null
        return {
          http: 'https://sepolia.infura.io/v3/0a512cbe35644d38bee10e0e77c60ed5',
        }
      },
    }),
    // 👇 remove this unless you're adding a chain with a real `public.rpcUrls`
    // publicProvider()
  ]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})
