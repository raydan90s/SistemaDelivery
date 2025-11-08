import { useState, useEffect, createContext, useContext} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@services/supabase';
import type { Session, User } from '@supabase/supabase-js';


interface RegisterClientArgs {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  celular: string;
  tipoDocumentoId: string;
  numeroDocumento: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  registerClient: (args: RegisterClientArgs) => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    setIsLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false); 
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []); 

  // Función para registrar un nuevo cliente
  const registerClient = async (args: RegisterClientArgs): Promise<void> => {
    
    //  Crear el Login en Supabase (auth.users)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
    });

    if (authError) {
      // Si hay un error, lo "lanzamos" para que el formulario lo atrape
      throw new Error(authError.message);
    }

    // Insertar el Perfil en 'clientes'
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('clientes')
        .insert({
          auth_user_id: authData.user.id,
          nombre: args.nombre,
          apellido: args.apellido,
          celular: args.celular,
          correo: args.email,
          estado_id: 1, 
          tipo_cliente_id: 1, 
          tipo_documento_id: parseInt(args.tipoDocumentoId),
          numero_documento: args.numeroDocumento,
        });
      
      if (profileError) {
        throw new Error(profileError.message);
      }
    } else {
      throw new Error("No se pudo crear el usuario en el sistema de autenticación.");
    }
  };


  const value: AuthContextType = {
    session,
    user: session?.user || null,
    isLoading,
    registerClient, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}