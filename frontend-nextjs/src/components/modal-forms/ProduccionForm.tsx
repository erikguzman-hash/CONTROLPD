interface ProduccionFormProps {
  data: {
    producerId: string;
    publicadorId: string;
    fechaInicioCreacion: string;
    fechaEntregaPieza: string;
    fechaProgramacion: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Mock user lists
const productionUsers = [
  { uid: 'pqr', displayName: 'Laura Martinez (Producción)' },
];
const publisherUsers = [
  { uid: 'stu', displayName: 'Sofia Hernandez (Publicador)' },
];

export default function ProduccionForm({ data, onChange }: ProduccionFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="producerId" className="block text-sm font-medium text-gray-700">Asignar a Producción</label>
        <select id="producerId" value={data.producerId} onChange={onChange} className="mt-1 w-full p-2 border rounded-md bg-white">
          <option value="">Seleccionar productor...</option>
          {productionUsers.map(user => (
            <option key={user.uid} value={user.uid}>{user.displayName}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="publicadorId" className="block text-sm font-medium text-gray-700">Asignar a Publicador</label>
        <select id="publicadorId" value={data.publicadorId} onChange={onChange} className="mt-1 w-full p-2 border rounded-md bg-white">
          <option value="">Seleccionar publicador...</option>
          {publisherUsers.map(user => (
            <option key={user.uid} value={user.uid}>{user.displayName}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fechaInicioCreacion" className="block text-sm font-medium text-gray-700">Fecha de Inicio de Creación</label>
        <input type="date" id="fechaInicioCreacion" value={data.fechaInicioCreacion} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="fechaEntregaPieza" className="block text-sm font-medium text-gray-700">Fecha de Entrega de Pieza</label>
        <input type="date" id="fechaEntregaPieza" value={data.fechaEntregaPieza} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="fechaProgramacion" className="block text-sm font-medium text-gray-700">Fecha de Programación</label>
        <input type="date" id="fechaProgramacion" value={data.fechaProgramacion} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="task-file" className="block text-sm font-medium text-gray-700">Adjuntar Archivo</label>
        <input type="file" id="task-file" className="mt-1 w-full p-2 border rounded-md bg-white" />
        {/* File upload logic will be added later */}
      </div>
    </div>
  );
}