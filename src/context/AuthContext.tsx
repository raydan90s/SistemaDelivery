import { useState, useEffect, createContext, useContext} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@services/supabase';
import type { Session, User } from '@supabase/supabase-js';


export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    
    setIsLoading(true);

    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false); // Terminamos de cargar
    });

    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []); 

  
  const value: AuthContextType = {
    session,
    user: session?.user || null,
    isLoading,
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