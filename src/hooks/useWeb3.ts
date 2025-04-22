// src/hooks/useWeb3.ts
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    connectWallet: connect,
    disconnectWallet: disconnect,
  }
}