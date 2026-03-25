import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AsgardeoProvider from './components/AsgardeoProvider';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AsgardeoProvider>
        <App />
      </AsgardeoProvider>
    </StrictMode>,
  );
} else {
  console.error('Root element not found!');
}
