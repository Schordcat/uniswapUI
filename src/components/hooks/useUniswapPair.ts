import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import UniswapV2Pair from '../../abi/UniswapV2Pair.json';

const UNISWAP_PAIR_ADDRESS = '0xYourPairAddressHere' as const;

export function useUniswapPair() {
  const { address } = useAccount();

  const { data: reserves, refetch: refetchReserves } = useReadContract({
    address: UNISWAP_PAIR_ADDRESS,
    abi: UniswapV2Pair.abi, // ✅ No `as const` here
    functionName: 'getReserves',
  });

  const { writeContract } = useWriteContract();

  const triggerSwap = () => {
    if (!address) return;

    writeContract({
      address: UNISWAP_PAIR_ADDRESS,
      abi: UniswapV2Pair.abi, // ✅ No `as const`
      functionName: 'swap',
      args: [
        0n,
        1_000_000_000_000_000_000n, // 1 token
        address,
        '0x',
      ],
    });
  };

  return {
    reserves,
    refetchReserves,
    triggerSwap,
  };
}