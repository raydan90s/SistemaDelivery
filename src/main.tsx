import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import '@styles/index.css'
import App from './App'

console.log('✅ main.tsx cargado correctamente')

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <Router>
      <App />
    </Router>
  )
} else {
  console.error('❌ No se encontró el elemento #root')
}
