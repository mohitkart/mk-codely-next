// components/SubtaskFormModal.tsx
import React, { useState, useEffect } from 'react';
import type { Subtask } from '@/types/tasks';

interface SubtaskFormModalProps {
  subtask: Subtask;
  onClose: () => void;
  onSave: (subtaskData: Partial<Subtask>) => void;
}

const SubtaskFormModal: React.FC<SubtaskFormModalProps> = ({ subtask, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');

  useEffect(() => {
    if (subtask) {
      setTitle(subtask.name);
      setStatus(subtask.status);
    }
  }, [subtask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name:title,
      status
    });
  };

  return (
    <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl font-semibold">{subtask ? 'Edit Subtask' : 'Add Subtask'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="py-4">
            <div className="mb-4">
              <label htmlFor="subtaskTitleInput" className="block text-sm font-medium text-gray-700 mb-1">Subtask Title</label>
              <input
                id="subtaskTitleInput"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subtaskStatusInput" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="subtaskStatusInput"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'To Do' | 'In Progress' | 'Done')}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </form>
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center hover:bg-indigo-600 transition mr-2"
            >
              <span className="material-symbols-outlined mr-2">save</span> Save Subtask
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskFormModal;