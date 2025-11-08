import { CartProvider } from "./context/CartContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@pages/Home";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import AdminDashboard from "@components/admin/AdminDashboard";
import RepartidoresDemo from "@pages/RepartidoresDemo";

function App() {
  return (
    <CartProvider>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repartidores-demo" element={<RepartidoresDemo />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/dashboard/:moduleId"
              element={<AdminDashboard />}
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
