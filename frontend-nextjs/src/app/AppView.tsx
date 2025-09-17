import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import ControlPanel from '@/components/ControlPanel';

const simulatedUser = {
  uid: '123',
  displayName: 'Usuario de Prueba',
  email: 'test@example.com',
  role: 'administrador',
  papers: ['coordinador'], // This user is a coordinator
};

export default function AppView() {
  return (
    <div>
      <Header user={simulatedUser} /> {/* Pass user to Header as well */}
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 flex space-x-6">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
          <ControlPanel user={simulatedUser} />
        </div>
        <div className="w-2/3">
          <Tabs user={simulatedUser} /> {/* Pass user to Tabs */}
        </div>
      </main>
    </div>
  );
}