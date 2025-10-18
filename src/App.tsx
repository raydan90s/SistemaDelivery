import '@styles/index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@components/navbar/Navbar';
import { Footer } from '@components/Footer/Footer';
import HomePage from '@pages/Home.page';
import { CartProvider } from '@context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div> 
    </CartProvider>

  );
}
