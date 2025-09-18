import MyTasks from './MyTasks';
import UserManagement from './UserManagement';
import { AppUser } from '@/context/AuthContext';

type ControlPanelProps = {
  user: AppUser;
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