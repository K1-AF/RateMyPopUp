import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import favicon from './assets/flavicon.jpg'
import { AuthProvider } from './auth/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

// Tab icon — Vite resolves a stable URL (hashed filename in production).
const iconLink =
  document.querySelector("link[rel='icon']") ?? document.createElement('link')
iconLink.rel = 'icon'
iconLink.type = 'image/jpeg'
iconLink.href = favicon
if (!iconLink.parentNode) document.head.appendChild(iconLink)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
