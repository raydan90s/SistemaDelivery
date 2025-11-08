import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@pages/Home';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AdminDashboard from '@components/admin/AdminDashboard';
import Login from '@pages/Login'; // 👈 Importa tu página de login
import ProtectedRoute from './ProtectedRoute'; // 👈 Importa la ruta protegida

function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> {/* 👈 Nueva ruta */}
            
            {/* 👇 Protegemos las rutas del admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/:moduleId"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
