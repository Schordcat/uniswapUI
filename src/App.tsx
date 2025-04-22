import React, { useState } from "react";
import { ethers } from "ethers";
import { getFunctionCall } from "./api/openai";
import { getFunctionCallFromOpenSource } from "./api/openSource";
import { useWallet } from "./hooks/useWallet";
import { approveToken } from "./utils/approveToken";
import routerAbi from "./abi/UniswapV2Router02.json";

const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630b4cf539739df2c5dacabf31d1c8ae0";

export default function App() {
  const { provider, signer, address, connect } = useWallet();
  const [nlInput, setNlInput] = useState("");
  const [structured, setStructured] = useState<any>(null);
  const [openSourceOutput, setOpenSourceOutput] = useState<any>(null);
  const [openSourceUrl, setOpenSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const args = await getFunctionCall(nlInput);
      setStructured(args);

      if (openSourceUrl) {
        const openSourceResult = await getFunctionCallFromOpenSource(nlInput, openSourceUrl);
        setOpenSourceOutput(openSourceResult);
      } else {
        setOpenSourceOutput(null);
      }
    } catch (error) {
      console.error("❌ Failed to interpret:", error);
      alert("Failed to interpret natural language instruction.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!signer || !structured) return;

    const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerAbi, signer);

    try {
      setLoading(true);

      await approveToken(
        structured.path[0],
        UNISWAP_ROUTER_ADDRESS,
        structured.amountIn,
        signer
      );

      const tx = await router.swapExactTokensForTokens(
        structured.amountIn,
        structured.amountOutMin,
        structured.path,
        structured.to,
        structured.deadline
      );

      await tx.wait();
      alert("✅ Swap executed!");
    } catch (error) {
      console.error("❌ Swap failed:", error);
      alert("Swap failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🦄 Uniswap NL Interface</h1>

      {/* Connect Wallet */}
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        onClick={connect}
      >
        {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
      </button>

      {/* Open Source Endpoint Input */}
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Open Source LLM Endpoint</label>
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="http://localhost:11434/api/chat"
          value={openSourceUrl}
          onChange={(e) => setOpenSourceUrl(e.target.value)}
        />
      </div>

      {/* NL Instruction Input */}
      <textarea
        className="w-full p-2 border mb-4 rounded"
        rows={3}
        placeholder='Try something like "swap 10 USDC for ETH"'
        value={nlInput}
        onChange={(e) => setNlInput(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          Interpret Instruction
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSwap}
          disabled={!structured || !signer || loading}
        >
          Swap with MetaMask
        </button>
      </div>

      {/* Outputs */}
      {structured && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold text-lg mb-1">🔮 OpenAI Output</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
              {JSON.stringify(structured, null, 2)}
            </pre>
          </div>

          {openSourceOutput && (
            <div>
              <h2 className="font-semibold text-lg mb-1">🤖 Open Source Output</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
                {JSON.stringify(openSourceOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
