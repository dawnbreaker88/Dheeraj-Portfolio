import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// GSAP setup must run before React renders so all plugins are registered
import './utils/gsapSetup'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
