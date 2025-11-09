import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@services/supabase';
import type { Session, User, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { fetchUsuarioByAuthId, createUsuario, type UsuarioConRelaciones } from '@services/usuario';
import { fetchClienteByUsuarioId, createCliente, type ClienteConRelaciones } from '@services/cliente';
import { createEmpleado, fetchEmpleadoByUsuarioId, type EmpleadoConRelaciones } from '@services/empleados';

interface RegisterClientArgs {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  celular: string;
  tipoDocumentoId: string;
  numeroDocumento: string;
}

interface RegisterEmpleadoArgs {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  celular: string;
  tipoEmpleadoId: number;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  usuarioData: UsuarioConRelaciones | null;
  clienteData: ClienteConRelaciones | null;
  empleadoData: EmpleadoConRelaciones | null;
  isLoading: boolean;
  isCliente: boolean;
  isEmpleado: boolean;
  registerClient: (args: RegisterClientArgs) => Promise<void>;
  registerEmpleado: (args: RegisterEmpleadoArgs) => Promise<void>;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [usuarioData, setUsuarioData] = useState<UsuarioConRelaciones | null>(null);
  const [clienteData, setClienteData] = useState<ClienteConRelaciones | null>(null);
  const [empleadoData, setEmpleadoData] = useState<EmpleadoConRelaciones | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (authUserId: string) => {
      try {
        const usuario = await fetchUsuarioByAuthId(authUserId);
        setUsuarioData(usuario);

        if (usuario.rol_id === 1) {
          try {
            const empleado = await fetchEmpleadoByUsuarioId(usuario.id);
            setEmpleadoData(empleado);
            setClienteData(null);
          } catch (error) {
            console.error('Error al obtener datos del empleado:', error);
            setEmpleadoData(null);
          }
        } else {
          try {
            const cliente = await fetchClienteByUsuarioId(usuario.id);
            setClienteData(cliente);
            setEmpleadoData(null);
          } catch (error) {
            console.error('Error al obtener datos del cliente:', error);
            setClienteData(null);
          }
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        setUsuarioData(null);
        setClienteData(null);
        setEmpleadoData(null);
      }
    };

    if (session?.user) {
      fetchUserData(session.user.id);
    } else {
      setUsuarioData(null);
      setClienteData(null);
      setEmpleadoData(null);
    }
  }, [session]);

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

  const registerClient = async (args: RegisterClientArgs): Promise<void> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        emailRedirectTo: undefined,
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario en el sistema de autenticación.');
    }

    const hadSession = authData.session !== null;

    try {
      if (hadSession) {
        await supabase.auth.signOut();
      }

      const usuario = await createUsuario({
        nombre: args.nombre,
        apellido: args.apellido,
        celular: args.celular,
        auth_user_id: authData.user.id,
        rol_id: 5, 
        estado_id: 1, 
      });

      await createCliente({
        usuario_id: usuario.id,
        tipo_cliente_id: 1, 
        tipo_documento_id: parseInt(args.tipoDocumentoId),
        numero_documento: args.numeroDocumento,
        estado_id: 1, 
      });
      
    } catch (error) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  };

  const registerEmpleado = async (args: RegisterEmpleadoArgs): Promise<void> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: args.email,
      password: args.password,
      options: {
        emailRedirectTo: undefined,
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario en el sistema de autenticación.');
    }

    const hadSession = authData.session !== null;

    try {
      if (hadSession) {
        await supabase.auth.signOut();
      }

      const usuario = await createUsuario({
        nombre: args.nombre,
        apellido: args.apellido,
        celular: args.celular,
        auth_user_id: authData.user.id,
        rol_id: 1,
        estado_id: 1,
      });

      await createEmpleado({
        usuario_id: usuario.id,
        tipo_empleado_id: args.tipoEmpleadoId,
        estado_id: 1, 
      });
      
    } catch (error) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  };

  const signIn = async (credentials: SignInWithPasswordCredentials): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUsuarioData(null);
    setClienteData(null);
    setEmpleadoData(null);
  };

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    usuarioData,
    clienteData,
    empleadoData,
    isLoading,
    isCliente: usuarioData?.rol_id === 2,
    isEmpleado: usuarioData?.rol_id === 1,
    registerClient,
    registerEmpleado,
    signIn,
    signOut,
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