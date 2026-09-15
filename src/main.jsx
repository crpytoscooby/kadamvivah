import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n' // Initialize i18n

// One-time cleanup of legacy development mock data in client browser storage
try {
  localStorage.removeItem('mockProfiles');
  localStorage.removeItem('mockUsers');
} catch (e) {
  // Ignore environments with restricted storage access
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
