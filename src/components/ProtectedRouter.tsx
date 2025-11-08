import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function ProtectedRouter() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; 
  }


  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}