import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { session, isLoading, signIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- Lógica de Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      
    } catch (err: any) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>; 
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  const inputTwClass = "w-full p-2 my-1.5 rounded-md border border-gray-300";

  return (
    <div className="w-full max-w-md p-4 mx-auto my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputTwClass}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputTwClass}
        />
        
        <div className="text-right text-sm mt-1">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full p-2.5 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </form>
      
      <p className="text-center mt-4">
        ¿No tienes una cuenta? 
        <Link to="/register" className="text-blue-600 hover:underline ml-1">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}