interface RevisionFormProps {
  data: {
    revisorId: string;
    fechaRevisionIdea: string;
    fechaRevisionFinal: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Mock user list. In a real app, this would be fetched from Firestore.
const reviewerUsers = [
  { uid: 'abc', displayName: 'Juan Perez (Revisor)' },
  { uid: 'mno', displayName: 'Carlos Sanchez (Revisor)' },
];

export default function RevisionForm({ data, onChange }: RevisionFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="revisorId" className="block text-sm font-medium text-gray-700">Asignar a Revisor</label>
        <select id="revisorId" value={data.revisorId} onChange={onChange} className="mt-1 w-full p-2 border rounded-md bg-white">
          <option value="">Seleccionar revisor...</option>
          {reviewerUsers.map(user => (
            <option key={user.uid} value={user.uid}>{user.displayName}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fechaRevisionIdea" className="block text-sm font-medium text-gray-700">Fecha de Revisión de Idea</label>
        <input type="date" id="fechaRevisionIdea" value={data.fechaRevisionIdea} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="fechaRevisionFinal" className="block text-sm font-medium text-gray-700">Fecha de Revisión Final</label>
        <input type="date" id="fechaRevisionFinal" value={data.fechaRevisionFinal} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
    </div>
  );
}