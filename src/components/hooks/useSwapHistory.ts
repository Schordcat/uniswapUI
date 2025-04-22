import { useEffect, useState } from 'react';
import { Interface, Log, JsonRpcProvider, id } from 'ethers';
import UniswapV2PairABI from '../../abi/UniswapV2Pair.json';

export function useSwapHistory(provider: JsonRpcProvider, pairAddress: string) {
  const [swaps, setSwaps] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSwaps() {
      const iface = new Interface(UniswapV2PairABI.abi); // ✅ Use `.abi` here
      const swapTopic = id("Swap(address,uint256,uint256,uint256,uint256,address)");

      try {
        const logs: Log[] = await provider.getLogs({
          address: pairAddress,
          fromBlock: 0,
          toBlock: 'latest',
          topics: [swapTopic],
        });

        const decoded = logs.map(log => iface.parseLog(log));
        setSwaps(decoded);
      } catch (err) {
        console.error('Error fetching swap logs:', err);
      }
    }

    if (provider && pairAddress) {
      fetchSwaps();
    }
  }, [provider, pairAddress]);

  return swaps;
}