import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWallet } from "./hooks/useWallet";
import "./ui.css";
import routerAbi from "./abi/UniswapV2Router02.json";
import erc20Abi from "./abi/ERC20.json";
import { ethers, parseUnits } from "ethers";

const reserve0 = 1000;
const reserve1 = 2000;
const k = reserve0 * reserve1;

const tokenMap: Record<string, string> = {
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

const data = Array.from({ length: 1000 }, (_, x) => ({
  x,
  y: x === 0 ? 0 : k / x,
}));

const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

export default function App() {
  const [nlInput, setNlInput] = useState("");
  const [structured, setStructured] = useState<any>(null);
  const { connect, signer, address } = useWallet();

  const callOpenAI = async () => {
    if (!signer || !address) {
      alert("\u26a0\ufe0f Connect your wallet first before sending a request.");
      return;
    }

    const response = await fetch("/api/openai/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: nlInput }),
    });

    try {
      const data = await response.json();
      setStructured(data);

      if (data?.tool === "swap_tokens") {
        const args = {
          amountIn: data.args.amountIn,
          tokenIn: ethers.getAddress(tokenMap[data.args.tokenIn]),
          tokenOut: ethers.getAddress(tokenMap[data.args.tokenOut]),
          path: [
            ethers.getAddress(tokenMap[data.args.tokenIn]),
            ethers.getAddress(tokenMap[data.args.tokenOut]),
          ],
        };

        await executeSwap(args);
      }
    } catch (err) {
      console.error("\u274c Failed to parse JSON or execute swap:", err);
    }
  };

  const executeSwap = async (args: any) => {
    if (!signer || !address) return alert("\u26a0\ufe0f Connect wallet first!");

    const router = new ethers.Contract(routerAddress, routerAbi, signer);
    const tokenIn = new ethers.Contract(
      ethers.getAddress(args.tokenIn),
      erc20Abi,
      signer
    );

    const amountIn = parseUnits(args.amountIn, 6);
    const amountOutMin = 0;

    const approval = await tokenIn.approve(routerAddress, amountIn);
    await approval.wait();

    const tx = await router.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      args.path.map(ethers.getAddress),
      address,
      Math.floor(Date.now() / 1000) + 60 * 10
    );

    await tx.wait();
    console.log("\u2705 Executing swap with args:", args);
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-semibold mb-4">Uniswap Demo UI</h1>

      <button
        onClick={connect}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Connect Wallet
      </button>
      {address && <div className="mb-4 text-sm">Connected: {address}</div>}

      <div className="mb-6">
        <input
          className="border p-2 mr-2 w-1/2"
          placeholder="e.g. swap 10 USDC for ETH"
          value={nlInput}
          onChange={(e) => setNlInput(e.target.value)}
        />
        <button
          onClick={callOpenAI}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      <div className="space-x-4 mb-6">
        <button
          onClick={() => {
            if (structured?.tool === "swap_tokens") {
              const args = {
                amountIn: structured.args.amountIn,
                tokenIn: ethers.getAddress(tokenMap[structured.args.tokenIn]),
                tokenOut: ethers.getAddress(tokenMap[structured.args.tokenOut]),
                path: [
                  ethers.getAddress(tokenMap[structured.args.tokenIn]),
                  ethers.getAddress(tokenMap[structured.args.tokenOut]),
                ],
              };
              executeSwap(args);
            } else {
              alert("\ud83e\uddd0 Please enter a valid swap command and press Send first!");
            }
          }}
          className="px-4 py-2 bg-gray-100 border rounded"
        >
          Swap
        </button>
        <button className="px-4 py-2 bg-gray-100 border rounded">Deposit</button>
        <button className="px-4 py-2 bg-gray-100 border rounded">Redeem</button>
      </div>

      <div className="font-semibold mb-2">Reserve Curve: x * y = k</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="x" type="number" domain={[0, 1000]} />
          <YAxis domain={[0, 2000]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {structured && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(structured, null, 2)}
        </pre>
      )}
    </div>
  );
}