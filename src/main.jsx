import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "react-multi-carousel/lib/styles.css";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
