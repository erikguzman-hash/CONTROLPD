interface CreacionFormProps {
  data: {
    title: string;
    dueDate: string;
    description: string;
    temaMacro: string;
    fechaPublicacion: string;
    temaSemanal: string;
    temaDelDia: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CreacionForm({ data, onChange }: CreacionFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
        <input type="text" id="title" value={data.title} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Fecha Límite</label>
        <input type="date" id="dueDate" value={data.dueDate} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea id="description" value={data.description} onChange={onChange} rows={3} className="mt-1 w-full p-2 border rounded-md"></textarea>
      </div>
      <div>
        <label htmlFor="temaMacro" className="block text-sm font-medium text-gray-700">Tema Macro</label>
        <input type="text" id="temaMacro" value={data.temaMacro} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700">Fecha de publicación</label>
        <input type="date" id="fechaPublicacion" value={data.fechaPublicacion} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="temaSemanal" className="block text-sm font-medium text-gray-700">Tema semanal</label>
        <input type="text" id="temaSemanal" value={data.temaSemanal} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
      <div>
        <label htmlFor="temaDelDia" className="block text-sm font-medium text-gray-700">Tema del dia</label>
        <input type="text" id="temaDelDia" value={data.temaDelDia} onChange={onChange} className="mt-1 w-full p-2 border rounded-md" />
      </div>
    </div>
  );
}