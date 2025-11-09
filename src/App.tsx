import { CartProvider } from './context/CartContext';
import { AuthProvider } from '@context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@pages/Home';
import ClientePerfil from '@pages/ClientePerfil';
import ProductosPorCategoria from '@components/ProductosPorCategoria';
import ResultadosBusqueda from '@pages/ResultadosBusqueda';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AdminDashboard from '@components/admin/AdminDashboard';
import CartPage from '@pages/Carrito';
import ScrollToTop from '@components/ScrollToTop';
import LoginPage from '@pages/Login';
import RegisterPage from '@pages/Register';
import AdminRoute from '@components/ProtectedRoute/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cliente/perfil" element={<ClientePerfil/>} />
              <Route path="/categoria/:categoriaId" element={<ProductosPorCategoria />} />
              <Route path="/buscar" element={<ResultadosBusqueda />} />
              
              <Route 
                path='/admin/dashboard' 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path='/admin/dashboard/:moduleId' 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              <Route path='/carrito' element={<CartPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;