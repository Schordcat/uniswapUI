import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui.css'; // just import CSS normally (no need to assign to a variable)

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmi';
import App from './App'; // your main UI component

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);
