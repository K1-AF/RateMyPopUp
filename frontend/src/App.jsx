import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState(null)

  // Verify the Django backend is reachable on mount
  useEffect(() => {
    fetch('/api/health/')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  return (
    <>
      <section id="center">
        <div className="logos">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>RateMyPopUp</h1>
        <p className="subtitle">Vite + React + Django + PostgreSQL</p>
        <div className="api-status">
          API status:{' '}
          <span className={apiStatus === 'ok' ? 'ok' : 'error'}>
            {apiStatus ?? 'checking...'}
          </span>
        </div>
      </section>
    </>
  )
}

export default App
