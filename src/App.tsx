import { CartProvider } from './context/CartContext';
import { AuthProvider } from '@context/AuthContext';

import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; 
import Home from '@pages/Home';
import LoginPage from '@pages/Login';
import RegisterPage from '@pages/Register';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AdminDashboard from '@components/admin/AdminDashboard';
import ProtectedRouter from '@components/ProtectedRouter'; 
import { useAuth } from '@context/AuthContext';
import { supabase } from '@services/supabase';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRouter />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home/>} />
              <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
              <Route path='/admin/dashboard/:moduleId' element={<AdminDashboard/>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>

        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

const MainLayout = () => {
  
  const { session } = useAuth();

  return (
    <div>
      <Navbar />
      <div style={{ padding: '10px', background: '#eee', textAlign: 'center' }}>
        <span>Logueado como: **{session?.user?.email}**</span>
        <button
          style={{ marginLeft: '15px' }}
          onClick={() => supabase.auth.signOut()}
        >
          Cerrar Sesión
        </button>
      </div>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default App;