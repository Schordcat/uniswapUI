import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
  } from 'wagmi';
  import UniswapV2PairABI from '../abi/UniswapV2Pair.json';
  import { Address } from 'viem';
  
  const UNISWAP_PAIR_ADDRESS: Address = '0xYourPairAddressHere'; // replace this
  
  export function useUniswapPair() {
    const { address } = useAccount(); // dynamically get connected address
  
    const { data: reserves, refetch: refetchReserves } = useContractRead({
      address: UNISWAP_PAIR_ADDRESS,
      abi: UniswapV2PairABI,
      functionName: 'getReserves',
      watch: true,
    });
  
    const { config } = usePrepareContractWrite({
      address: UNISWAP_PAIR_ADDRESS,
      abi: UniswapV2PairABI,
      functionName: 'swap',
      args: [
        0n,                        // amount0Out
        1000000000000000000n,     // amount1Out (1 token assuming 18 decimals)
        address!,                 // send to connected wallet
        '0x'                      // no data
      ],
      enabled: Boolean(address), // only prepare if connected
    });
  
    const { write: triggerSwap } = useContractWrite(config);
  
    return {
      reserves,
      refetchReserves,
      triggerSwap,
    };
  }
  
