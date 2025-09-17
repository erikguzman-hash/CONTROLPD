'use client';

import { useState } from 'react';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalTab = 'creacion' | 'experto' | 'revision' | 'produccion';

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('creacion');

  if (!isOpen) {
    return null;
  }

  const tabStyles = "whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm";
  const activeTabStyles = "border-hgio-blue text-hgio-blue";
  const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50">
        <form>
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-hgio-blue">Crear Nueva Tarea</h2>
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
            {/* Form content for each tab will go here */}
            {activeTab === 'creacion' && <div>Creación Form</div>}
            {activeTab === 'experto' && <div>Experto Form</div>}
            {activeTab === 'revision' && <div>Revisión Form</div>}
            {activeTab === 'produccion' && <div>Producción Form</div>}
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-end items-center space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancelar</button>
            <button type="submit" className="bg-hgio-green text-white font-bold py-2 px-4 rounded-md">Guardar Tarea</button>
          </div>
        </form>
      </div>
    </div>
  );
}
