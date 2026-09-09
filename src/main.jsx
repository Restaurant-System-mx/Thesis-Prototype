import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1A1A1A',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#1D9BF0',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>
)