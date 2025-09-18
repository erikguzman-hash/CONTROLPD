import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import ControlPanel from '@/components/ControlPanel';
import { AppUser } from '@/context/AuthContext'; // Import the user type

type AppViewProps = {
  user: AppUser;
};

export default function AppView({ user }: AppViewProps) {
  return (
    <div>
      <Header user={user} />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 flex space-x-6">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
          <ControlPanel user={user} />
        </div>
        <div className="w-2/3">
          <Tabs user={user} />
        </div>
      </main>
    </div>
  );
}
