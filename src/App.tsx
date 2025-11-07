import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@pages/Home';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
<<<<<<< HEAD
import Pedidos from '@components/Pedidos';
=======
import AdminDashboard from '@components/admin/AdminDashboard';
>>>>>>> origin/main


function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/pedidos" element={<Pedidos/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
            <Route path='/admin/dashboard/:moduleId' element={<AdminDashboard/>}/>
          </Routes>
        </main>
        <Footer/>
      </div> 
    </CartProvider>
  );
}

export default App;
