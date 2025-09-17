'use client';

// This would typically come from a config file or API
const ROLES = ['miembro', 'director', 'administrador'];
const PAPERS = ['coordinador', 'experto', 'revisor', 'productor', 'publicador'];

// This is a mock user list. Later, it will be fetched from Firestore.
const users = [
  { uid: 'abc', displayName: 'Juan Perez', email: 'juan.perez@example.com', role: 'miembro', papers: ['experto', 'revisor'] },
  { uid: 'def', displayName: 'Ana Garcia', email: 'ana.garcia@example.com', role: 'director', papers: ['coordinador'] },
  { uid: 'ghi', displayName: 'Pedro Gomez', email: 'pedro.gomez@example.com', role: 'miembro', papers: [] },
];

function UserRow({ user }: { user: typeof users[0] }) {
  // In a real app, you'd have state and handlers to update roles/papers
  return (
    <tr className="border-b">
      <td className="py-3 px-4">{user.displayName}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">
        <select defaultValue={user.role} className="role-select border rounded-md p-1">
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
                defaultChecked={user.papers.includes(paper)}
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
  return (
    <div>
      <h3 className="text-lg font-bold text-hgio-blue mb-2 border-b pb-2">Gestión de Usuarios</h3>
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
            {users.map(user => <UserRow key={user.uid} user={user} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
