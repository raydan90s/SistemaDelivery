// src/pages/Login.tsx
import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'

const Login = () => {
  const [session, setSession] = useState<any>(null)
  console.log("📍 Login.tsx montado — sesión inicial:", session)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  console.log("🧠 Login.tsx renderizando, sesión:", session)

  if (!session)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-black">
        <div className="p-6 bg-white border border-gray-300 shadow-xl rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">🔥 Login cargando...</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['github', 'google']}
          />
        </div>
      </div>
    )

  return (
    <div className="p-8 text-center">
      <h1>Bienvenido, {session.user.email}</h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default Login
