'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, updateUserPapers } from '@/lib/firestore';
import { AppUser } from '@/context/AuthContext';

const ROLES = ['miembro', 'director', 'administrador'];
const PAPERS = ['coordinador', 'experto', 'revisor', 'productor', 'publicador'];

function UserRow({ user, onUpdate }: { user: AppUser, onUpdate: () => void }) {
  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateUserRole(user.uid, e.target.value);
    onUpdate(); // Trigger a refetch in the parent
  };

  const handlePapersChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPapers = user.papers || [];
    const paper = e.target.value;
    let newPapers;
    if (e.target.checked) {
      newPapers = [...currentPapers, paper];
    } else {
      newPapers = currentPapers.filter(p => p !== paper);
    }
    await updateUserPapers(user.uid, newPapers);
    onUpdate(); // Trigger a refetch
  };

  return (
    <tr className="border-b">
      <td className="py-3 px-4">{user.displayName}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">
        <select defaultValue={user.role} onChange={handleRoleChange} className="role-select border rounded-md p-1">
          {ROLES.map(role => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-2">
          {PAPERS.map(paper => (
            <div key={paper} className="flex items-center">
              <input
                type="checkbox"
                id={`paper-${user.uid}-${paper}`}
                value={paper}
                defaultChecked={user.papers?.includes(paper)}
                onChange={handlePapersChange}
                className="h-4 w-4 text-hgio-green focus:ring-hgio-green border-gray-300 rounded"
              />
              <label htmlFor={`paper-${user.uid}-${paper}`} className="ml-2 text-sm text-gray-700">
                {paper.charAt(0).toUpperCase() + paper.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const userList = await getAllUsers();
    setUsers(userList as AppUser[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold text-hgio-blue mb-2 border-b pb-2">Gestión de Usuarios</h3>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-hgio-blue text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold">Usuario</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Email</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Rol</th>
                <th className="text-left py-3 px-4 uppercase font-semibold">Papeles</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map(user => <UserRow key={user.uid} user={user} onUpdate={fetchUsers} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}