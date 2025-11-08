import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { session, isLoading, signIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputTwClass + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="text-right text-sm mt-1">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="cursor-pointer w-full p-2.5 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
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