import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import "./ui.css";

export default function App() {
  const [reserves, setReserves] = useState({ reserve0: 1000, reserve1: 2000 });
  const [chartData, setChartData] = useState<{ reserve0: number; reserve1: number }[]>([
    { reserve0: 1000, reserve1: 2000 },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fakeTransaction = (action: string) => {
    setLoading(true);
    setMessage(`Processing ${action}...`);

    setTimeout(() => {
      let newReserves = { ...reserves };

      if (action === "Swap") {
        newReserves = {
          reserve0: Math.max(reserves.reserve0 - 100, 1),
          reserve1: reserves.reserve1 + 80,
        };
      } else if (action === "Deposit") {
        newReserves = {
          reserve0: reserves.reserve0 + 150,
          reserve1: reserves.reserve1 + 150,
        };
      } else if (action === "Redeem") {
        newReserves = {
          reserve0: Math.max(reserves.reserve0 - 200, 1),
          reserve1: Math.max(reserves.reserve1 - 200, 1),
        };
      }

      // Update reserves
      setReserves(newReserves);

      // Add to chart data, keep only last 20
      const updatedData = [...chartData, newReserves].slice(-20);
      setChartData(updatedData);

      setLoading(false);
      setMessage(`${action} successful! 🎉`);
    }, 1000);
  };

  return (
    <div className="container">
      <h1>Uniswap Demo UI</h1>
      <p>Reserve0 (X): {reserves.reserve0}</p>
      <p>Reserve1 (Y): {reserves.reserve1}</p>
      <div className="buttons">
        <button onClick={() => fakeTransaction("Swap")} disabled={loading}>
          Swap
        </button>
        <button onClick={() => fakeTransaction("Deposit")} disabled={loading}>
          Deposit
        </button>
        <button onClick={() => fakeTransaction("Redeem")} disabled={loading}>
          Redeem
        </button>
      </div>
      <p>{message}</p>

      <h2>Reserve Curve: x * y = k</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="reserve0" type="number" name="X" />
          <YAxis dataKey="reserve1" type="number" name="Y" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Reserves" data={chartData} fill="#8884d8" line />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
