import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@pages/Home';
import ProductosPorCategoria from '@pages/ProductosPorCategoria';
import ResultadosBusqueda from '@pages/ResultadosBusqueda';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AdminDashboard from '@components/admin/AdminDashboard';
import CartPage from '@pages/Carrito';
import PedidosPage from '@components/Pedidos';
import RepartidoresDemo from "@pages/RepartidoresDemo";

function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/categoria/:categoriaId" element={<ProductosPorCategoria/>} />
            <Route path="/buscar" element={<ResultadosBusqueda/>} />
            <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
            <Route path='/admin/dashboard/:moduleId' element={<AdminDashboard/>}/>
            <Route path='/carrito' element={<CartPage/>}/>
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </CartProvider>
  );
}

export default App;
