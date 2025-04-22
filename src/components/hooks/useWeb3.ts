import { useConnect } from 'wagmi'

export function useWeb3() {
  const { connectAsync, connectors } = useConnect()

  const injectedConnector = connectors.find(c => c.id === 'injected')

  const connectWallet = async () => {
    if (!injectedConnector) return
    await connectAsync({ connector: injectedConnector })
  }

  return {
    connectWallet,
  }
}
