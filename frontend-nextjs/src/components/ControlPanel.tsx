import MyTasks from './MyTasks';
import UserManagement from './UserManagement';

// Define a type for the user object for clarity
type User = {
  role: string;
  // other user properties...
};

type ControlPanelProps = {
  user: User;
};

export default function ControlPanel({ user }: ControlPanelProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-hgio-blue mb-4">Panel de Control</h2>
      {user.role === 'administrador' && <UserManagement />}
      <MyTasks />
    </div>
  );
}
