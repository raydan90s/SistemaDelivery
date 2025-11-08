import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@pages/Home';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import AdminDashboard from '@components/admin/AdminDashboard';
import Factura from "@components/admin/Factura";
import DetalleFactura from "@components/admin/DetalleFactura";



function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
            <Route path='/admin/dashboard/:moduleId' element={<AdminDashboard/>}/>
            
            
            <Route path="/factura" element={<Factura />} /> 
            {/* <Route path="/factura/:id" element={<DetalleFactura />} /> */}  
            
            <Route path="/admin/dashboard/facturacion/:id" element={<DetalleFactura />} /> 

          </Routes>
        </main>
        <Footer/>
      </div> 
    </CartProvider>
  );
}

export default App;
