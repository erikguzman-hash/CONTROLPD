interface ExpertoFormProps {
  data: {
    expertId: string;
    fechaEntregaTema: string;
    tipoPost: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Mock user list. In a real app, this would be fetched from Firestore.
const expertUsers = [
  { uid: 'abc', displayName: 'Juan Perez (Experto)' },
  { uid: 'jkl', displayName: 'Maria Rodriguez (Experto)' },
];

export default function ExpertoForm({ data, onChange }: ExpertoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="expertId" className="block text-sm font-medium text-gray-700">Asignar a Experto</label>
        <select id="expertId" value={data.expertId} onChange={onChange} className="mt-1 w-full p-2 border rounded-md bg-white">
          <option value="">Seleccionar experto...</option>
          {expertUsers.map(user => (
            <option key={user.uid} value={user.uid}>{user.displayName}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fechaEntregaTema" className="block text-sm font-medium text-gray-700">Fecha de entrega de Tema</label>
        <input type="date" id="fechaEntregaTema" value={data.fechaEntregaTema} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="tipoPost" className="block text-sm font-medium text-gray-700">Tipo de Post</label>
        <input type="text" id="tipoPost" value={data.tipoPost} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
    </div>
  );
}