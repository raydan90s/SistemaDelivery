import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer/>
      </div> 
    </CartProvider>
  );
}

export default App;
