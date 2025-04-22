// src/App.tsx
import React, { useMemo } from 'react';
import { useWeb3 } from './hooks/useWeb3';
import { useUniswapPair } from './hooks/useUniswapPair';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function App() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const { reserves, triggerSwap } = useUniswapPair();

  const curveData = useMemo(() => {
    if (!reserves) return [];
    const reserve0 = Number(reserves[0]);
    const reserve1 = Number(reserves[1]);
    const k = reserve0 * reserve1;

    return Array.from({ length: 100 }, (_, i) => {
      const x = reserve0 * (0.5 + i / 100);
      return { x, y: k / x };
    });
  }, [reserves]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Uniswap V2 UI</h1>

      {!isConnected ? (
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Connected:</strong> {address}</p>
          <button onClick={() => disconnectWallet()}>Disconnect</button>
        </>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h2>Reserves</h2>
        {reserves ? (
          <>
            <p><strong>Reserve0:</strong> {reserves[0]?.toString()}</p>
            <p><strong>Reserve1:</strong> {reserves[1]?.toString()}</p>
            <p><strong>Last Updated:</strong> {reserves[2]}</p>
          </>
        ) : (
          <p>Loading reserves...</p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>📈 Reserve Curve (x * y = k)</h2>
        {curveData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={curveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <button
        onClick={() => triggerSwap?.()}
        style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}
      >
        Trigger Swap
      </button>
    </div>
  );
}
