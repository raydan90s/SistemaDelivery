import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@services/supabase';
import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; 
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ width: '350px', margin: '50px auto' }}>
      <h2>FoodExpress Login</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        localization={{
          variables: {
            sign_in: { email_label: 'Correo', password_label: 'Contraseña', button_label: 'Iniciar sesión' },
            sign_up: { email_label: 'Correo', password_label: 'Crear contraseña', button_label: 'Registrarse' },
            forgotten_password: { link_text: '¿Olvidaste tu contraseña?' }
          },
        }}
      />
    </div>
  );
}