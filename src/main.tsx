import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('[MAIN] Starting app initialization...');

try {
  const rootElement = document.getElementById("root");
  console.log('[MAIN] Root element found:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('[MAIN] Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('[MAIN] Rendering App component...');
  root.render(<App />);
  
  console.log('[MAIN] App rendered successfully!');
} catch (error) {
  console.error('[MAIN] Fatal error during app initialization:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: monospace;">
      <h1 style="color: red;">App Initialization Error</h1>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error instanceof Error ? error.message : String(error)}\n\n${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}
