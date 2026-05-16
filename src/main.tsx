import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Hide loading screen when React is ready
function LoadingScreenRemover() {
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
          loadingScreen.remove();
        }, 300);
      }, 100);
    }
  }, []);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingScreenRemover />
    <App />
  </StrictMode>,
);