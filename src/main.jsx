import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import Puzzles from './Puzzles'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Puzzles />
  </StrictMode>,
)
