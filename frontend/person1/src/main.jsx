import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
root.style.height = '100%'
root.style.display = 'flex'
root.style.flexDirection = 'column'

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)