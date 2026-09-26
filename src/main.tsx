import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthAndQuizProvider } from './context/AuthAndQuizContext.tsx';

// Globally catch and suppress any MetaMask, Ethereum, or wallet connection errors injected by browser extensions
if (typeof window !== 'undefined') {
  const suppressWalletErrors = (errStr: string): boolean => {
    const s = errStr.toLowerCase();
    return (
      s.includes('metamask') ||
      s.includes('ethereum') ||
      s.includes('wallet') ||
      s.includes('web3') ||
      s.includes('provider')
    );
  };

  window.addEventListener('error', (event) => {
    if (event.message && suppressWalletErrors(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    if (msg && suppressWalletErrors(msg)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthAndQuizProvider>
      <App />
    </AuthAndQuizProvider>
  </StrictMode>,
);


