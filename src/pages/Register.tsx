import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export default function RegisterPage() {
  const { registerClient } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [tipoDocumentoId, setTipoDocumentoId] = useState('1');
  const [numeroDocumento, setNumeroDocumento] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await registerClient({
        email,
        password,
        nombre,
        apellido,
        celular,
        tipoDocumentoId,
        numeroDocumento,
      });

      setMessage('¡Registro exitoso! Revisa tu correo para confirmar la cuenta.');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setCelular(value);
    }
  };
  const handleNumeroDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (tipoDocumentoId === '1' || tipoDocumentoId === '2') {
      if (/^[0-9]*$/.test(value)) {
        setNumeroDocumento(value);
      }
    } else { 
      if (/^[a-zA-Z0-9]*$/.test(value)) {
        setNumeroDocumento(value.toUpperCase());
      }
    }
  };

  const inputTwClass = "w-full p-2 my-1.5 rounded-md border border-gray-300";

  return (
    <div className="w-full max-w-md p-4 mx-auto my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Registrarse</h2>
      
      <form onSubmit={handleRegister}>
        <input
          type="text" placeholder="Nombre" value={nombre}
          onChange={(e) => setNombre(e.target.value)} required 
          className={inputTwClass} 
        />
        <input
          type="text" placeholder="Apellido" value={apellido}
          onChange={(e) => setApellido(e.target.value)} 
          required
          className={inputTwClass}
        />
        <input
          type="tel" 
          inputMode="numeric" 
          placeholder="Celular" value={celular}
          required
          onChange={handleCelularChange}
          className={inputTwClass}
        />
        
        <div className="flex gap-2.5">
          <select
            value={tipoDocumentoId}
            onChange={(e) => setTipoDocumentoId(e.target.value)}
            required
            className={`${inputTwClass} flex-1`}
          >
            <option value="1">Cédula</option>
            <option value="2">RUC</option>
            <option value="3">Pasaporte</option>
            <option value="4">Carta Andina</option>
          </select>
          <input
            type="text" 
            inputMode={tipoDocumentoId === '1' || tipoDocumentoId === '2' ? 'numeric' : 'text'} 
            placeholder="Nro. de Documento" value={numeroDocumento}
            onChange={handleNumeroDocumentoChange}
            className={`${inputTwClass} flex-2`}
            required
          />
        </div>

        <hr className="my-2.5" /> 
        
        <input
          type="email" placeholder="Correo electrónico" value={email}
          onChange={(e) => setEmail(e.target.value)} required 
          className={inputTwClass}
        />
        <input
          type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password}
          onChange={(e) => setPassword(e.target.value)} required 
          className={inputTwClass}
        />
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full p-2.5 mt-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mt-2">{message}</p>}
      </form>

      <p className="text-center mt-4">
        ¿Ya tienes una cuenta? 
        <Link to="/login" className="text-blue-600 hover:underline ml-1">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}