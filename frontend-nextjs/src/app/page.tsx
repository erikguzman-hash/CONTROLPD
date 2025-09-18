'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/lib/auth';
import AppView from './AppView';

// Loading component
function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="loader h-32 w-32 border-t-4 border-hgio-green rounded-full animate-spin"></div>
    </div>
  );
}

// Login view component
function LoginView() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="https://hgio.co/wp-content/uploads/Logo_Transparente-41.webp"
            alt="Logo HGIO"
            width={200}
            height={100}
            className="h-24 w-auto mx-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-hgio-blue mt-4">CONTROLPD</h1>
          <p className="text-hgio-gray mt-1">Inicia sesión para continuar</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917z"></path>
              <path fill="#34A853" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#FBBC05" d="M27.463,25.309l-6.571,4.819C20.534,34.91,19.287,36,17.64,36c-3.356,0-6.21-2.344-7.175-5.443l-6.571,4.819C6.963,42.422,12.682,46,20,46c6.627,0,12-5.373,12-12c0-2.42-0.734-4.645-2.039-6.539z"></path>
              <path fill="#EA4335" d="M20.184,43.725l6.571-4.819C29.463,34.91,30.713,36,32.36,36c3.356,0-6.21-2.344-7.175-5.443l6.571,4.819C41.037,42.422,35.318,46,28,46C25.463,46,22.926,45.28,20.184,43.725z"></path>
            </svg>
            Iniciar Sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingView />;
  }

  if (!user) {
    return <LoginView />;
  }

  // Now we pass the real user object to AppView
  return <AppView user={user} />;
}