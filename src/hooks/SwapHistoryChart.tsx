import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import React from 'react';

export default function SwapHistoryChart({ swaps }: { swaps: any[] }) {
  const data = swaps.map((s, i) => ({
    id: i,
    price: Number(s.amount0In) / Number(s.amount1Out || 1)
  }));

  return (
    <div>
      <h3>Swap Price Distribution</h3>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} />
      </LineChart>
    </div>
  );
}
