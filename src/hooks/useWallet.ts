import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await ethProvider.getSigner();
    const address = await signer.getAddress();

    setProvider(ethProvider);
    setSigner(signer);
    setAddress(address);
  };

  return {
    connect,
    provider,
    signer,
    address,
  };
}

