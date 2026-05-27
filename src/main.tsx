import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthAndQuizProvider } from './context/AuthAndQuizContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthAndQuizProvider>
      <App />
    </AuthAndQuizProvider>
  </StrictMode>,
);

