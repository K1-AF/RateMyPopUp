import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import favicon from './assets/flavicon.JPG'
import './index.css'
import App from './App.jsx'

// Tab icon: Vite emits a hashed URL in production builds.
const iconLink =
  document.querySelector("link[rel='icon']") ?? document.createElement('link')
iconLink.rel = 'icon'
iconLink.type = 'image/jpeg'
iconLink.href = favicon
if (!iconLink.parentNode) document.head.appendChild(iconLink)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
