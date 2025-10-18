import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import '@styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>
);