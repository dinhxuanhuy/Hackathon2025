import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GoogleMap from './map.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <GoogleMap />
  </StrictMode>,
)
