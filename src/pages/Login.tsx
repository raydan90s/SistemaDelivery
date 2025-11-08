import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@services/supabase';
import { useAuth } from '@context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; 
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full max-w-md p-4 mx-auto my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>
      
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        view="sign_in"
        localization={{
          variables: {
            sign_in: { 
              email_label: 'Correo', 
              password_label: 'Contraseña', 
              button_label: 'Iniciar sesión',
              social_provider_text: 'Entrar con {{provider}}'
            },
            forgotten_password: { link_text: '¿Olvidaste tu contraseña?' }
          },
        }}
      />
      <p className="text-center mt-4">
        ¿No tienes una cuenta? 
        <Link to="/register" className="text-blue-600 hover:underline ml-1">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}