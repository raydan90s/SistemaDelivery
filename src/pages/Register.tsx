import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { fetchTipoDocumentos } from '@services/tipoDocumento';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { registerClient } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [tipoDocumentoId, setTipoDocumentoId] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');

  const [tiposDocumento, setTiposDocumento] = useState<Array<{ id: number; descripcion: string }>>([]);
  const [loadingTipos, setLoadingTipos] = useState(true);

  useEffect(() => {
    const loadTiposDocumento = async () => {
      try {
        const tipos = await fetchTipoDocumentos();
        setTiposDocumento(tipos);
        if (tipos.length > 0) {
          setTipoDocumentoId(tipos[0].id.toString());
        }
      } catch (err) {
        console.error('Error al cargar tipos de documento:', err);
        setError('Error al cargar tipos de documento');
      } finally {
        setLoadingTipos(false);
      }
    };

    loadTiposDocumento();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

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

      setSuccess(true);

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err: any) {
      setError(err.message);
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

    const tipoDocumentoActual = tiposDocumento.find(t => t.id.toString() === tipoDocumentoId);
    const esNumerico = tipoDocumentoActual?.descripcion.toLowerCase().includes('cédula') || 
                       tipoDocumentoActual?.descripcion.toLowerCase().includes('ruc');

    if (esNumerico) {
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

  const tipoDocumentoActual = tiposDocumento.find(t => t.id.toString() === tipoDocumentoId);
  const inputMode = tipoDocumentoActual?.descripcion.toLowerCase().includes('cédula') || 
                    tipoDocumentoActual?.descripcion.toLowerCase().includes('ruc')
                    ? 'numeric' : 'text';

  if (loadingTipos) {
    return (
      <div className="w-full max-w-md p-4 mx-auto my-12 text-center">
        <p className="text-gray-600">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4 mx-auto my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Registrarse</h2>

      {success ? (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">¡Registro exitoso!</h3>
          <p className="text-green-700">Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
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
              onChange={(e) => {
                setTipoDocumentoId(e.target.value);
                setNumeroDocumento(''); 
              }}
              required
              className={`${inputTwClass} flex-1`}
              disabled={tiposDocumento.length === 0}
            >
              {tiposDocumento.length === 0 ? (
                <option value="">Sin opciones</option>
              ) : (
                tiposDocumento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))
              )}
            </select>
            <input
              type="text"
              inputMode={inputMode}
              placeholder="Nro. de Documento" 
              value={numeroDocumento}
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputTwClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputTwClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {confirmPassword && (
            <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
              {password === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !!(confirmPassword && password !== confirmPassword)}
            className="cursor-pointer w-full p-2.5 mt-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      )}

      {!success && (
        <p className="text-center mt-4">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="text-blue-600 hover:underline ml-1">
            Inicia sesión
          </Link>
        </p>
      )}
    </div>
  );
}