'use client';

import { useState, useEffect } from 'react';
import { useAuth, AppUser } from '@/context/AuthContext';
import { createTask, getTaskById, updateTask, getAllUsers } from '@/lib/firestore';
import CreacionForm from './modal-forms/CreacionForm';
import ExpertoForm from './modal-forms/ExpertoForm';
import RevisionForm from './modal-forms/RevisionForm';
import ProduccionForm from './modal-forms/ProduccionForm';

// Define the type for all possible form fields
interface TaskFormData {
  title: string; dueDate: string; description: string; temaMacro: string; fechaPublicacion: string; temaSemanal: string; temaDelDia: string;
  expertId: string; fechaEntregaTema: string; tipoPost: string;
  revisorId: string; fechaRevisionIdea: string; fechaRevisionFinal: string;
  producerId: string; publicadorId: string; fechaInicioCreacion: string; fechaEntregaPieza: string; fechaProgramacion: string;
}

const initialState: TaskFormData = {
  title: '', dueDate: '', description: '', temaMacro: '', fechaPublicacion: '', temaSemanal: '', temaDelDia: '',
  expertId: '', fechaEntregaTema: '', tipoPost: '',
  revisorId: '', fechaRevisionIdea: '', fechaRevisionFinal: '',
  producerId: '', publicadorId: '', fechaInicioCreacion: '', fechaEntregaPieza: '', fechaProgramacion: '',
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
};

type ModalTab = 'creacion' | 'experto' | 'revision' | 'produccion';

export default function TaskModal({ isOpen, onClose, taskId }: TaskModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ModalTab>('creacion');
  const [formData, setFormData] = useState<TaskFormData>(initialState);
  const [users, setUsers] = useState<AppUser[]>([]);

  const isEditMode = taskId !== null;

  useEffect(() => {
    // Fetch all users when the modal is first opened
    if (isOpen && users.length === 0) {
      const fetchUsers = async () => {
        const userList = await getAllUsers();
        setUsers(userList as AppUser[]);
      };
      fetchUsers();
    }

    if (isEditMode && isOpen) {
      const fetchTaskData = async () => {
        const taskData = await getTaskById(taskId);
        if (taskData) {
          const completeTaskData = { ...initialState, ...taskData };
          setFormData(completeTaskData);
        }
      };
      fetchTaskData();
    } else if (!isOpen) {
      setFormData(initialState);
      setActiveTab('creacion');
    }
  }, [taskId, isOpen, isEditMode, users.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert("Debes iniciar sesión para guardar una tarea."); return; }

    if (isEditMode) {
      await updateTask(taskId, formData);
    } else {
      const newTaskData = { ...formData, creatorId: user.uid, createdAt: new Date().toISOString(), status: 'solicitado' };
      await createTask(newTaskData);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Filter users for dropdowns
  const expertUsers = users.filter(u => u.papers?.includes('experto'));
  const reviewerUsers = users.filter(u => u.papers?.includes('revisor'));
  const productionUsers = users.filter(u => u.papers?.includes('productor'));
  const publisherUsers = users.filter(u => u.papers?.includes('publicador'));

  const tabStyles = "whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm";
  const activeTabStyles = "border-hgio-blue text-hgio-blue";
  const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50">
        <form onSubmit={handleSubmit}>
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-hgio-blue">{isEditMode ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
            <button type="button" onClick={onClose} className="text-3xl text-hgio-gray hover:text-black">&times;</button>
          </div>

          <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
               <button type="button" className={`${tabStyles} ${activeTab === 'creacion' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('creacion')}>Creación</button>
               <button type="button" className={`${tabStyles} ${activeTab === 'experto' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('experto')}>Experto</button>
               <button type="button" className={`${tabStyles} ${activeTab === 'revision' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('revision')}>Revisión</button>
               <button type="button" className={`${tabStyles} ${activeTab === 'produccion' ? activeTabStyles : inactiveTabStyles}`} onClick={() => setActiveTab('produccion')}>Producción</button>
            </nav>
          </div>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {activeTab === 'creacion' && <CreacionForm data={formData} onChange={handleInputChange} />}
            {activeTab === 'experto' && <ExpertoForm data={formData} onChange={handleInputChange} users={expertUsers} />}
            {activeTab === 'revision' && <RevisionForm data={formData} onChange={handleInputChange} users={reviewerUsers} />}
            {activeTab === 'produccion' && <ProduccionForm data={formData} onChange={handleInputChange} productionUsers={productionUsers} publisherUsers={publisherUsers} />}
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-end items-center space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancelar</button>
            <button type="submit" className="bg-hgio-green text-white font-bold py-2 px-4 rounded-md">{isEditMode ? 'Guardar Cambios' : 'Guardar Tarea'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}