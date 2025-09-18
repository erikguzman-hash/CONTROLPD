import Image from 'next/image';
import { AppUser } from '@/context/AuthContext';
import { signOutFromApp } from '@/lib/auth'; // Import sign out function

type HeaderProps = {
  user: AppUser;
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image
            src="https://hgio.co/wp-content/uploads/Logo_Transparente-41.webp"
            alt="Logo HGIO"
            width={100}
            height={50}
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-xl font-bold text-hgio-blue">CONTROLPD</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="font-semibold text-hgio-blue block">{user.displayName || 'Usuario'}</span>
            <span className="text-xs text-hgio-gray block">{user.role || 'Miembro'}</span>
          </div>
          <button
            onClick={signOutFromApp}
            className="text-sm bg-hgio-blue text-white py-2 px-4 rounded-md font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
