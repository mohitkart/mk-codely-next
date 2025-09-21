// components/TaskFormModal.tsx
import React, { useState, useEffect } from 'react';
import { taskStatus, type Task } from '@/types/tasks';
import datepipeModel from '@/utils/datepipemodel';
import OptionDropdown from '../OptionDropdown';
import Modal from '../Modal';
import FireApi from '@/utils/firebaseApi.utils';
import { getRandomCode, loaderHtml } from '@/utils/shared';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import CodeEditor from '../CodeEditor';
import Editor from '../Editor';

interface TaskFormModalProps {
  task: Task | null;
  categories: any[];
  tasks: any[];
  onClose: () => void;
  onSave: (taskData: Task) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, tasks = [], categories = [], onClose, onSave }) => {
  const user: any = useSelector((state: RootState) => state.user.data);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [parent, setParent] = useState('');
  const table = 'tasks'
  const { post, put } = FireApi()

  useEffect(() => {
    if (task) {
      setTitle(task.name || '');
      setDescription(task.description || '');
      setLongDescription(task.longDescription||task.description|| '');
      setStatus(task.status || '');
      setProject(task.category || '');
      setParent(task.parent || '');
      setDueDate(task.date || '');
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: title,
      description,
      longDescription,
      parent,
      status,
      category: project,
      date: dueDate ? new Date(dueDate) : null
    }
    if (user) {
      loaderHtml(true)
      if (task?.id) {
        payload.id = task.id
        put(table, payload).then(res => {
          if (res.success) {
            onSave(res.data)
          }
        }).finally(() => {
          loaderHtml(false)
        })
      } else {
        post(table, payload).then(res => {
          if (res.success) {
            onSave(res.data)
          }
        }).finally(() => {
          loaderHtml(false)
        })
      }
    }else{
      if (task?.id) {
        payload.id = task.id
        onSave(payload)
      } else {
        onSave({
          ...payload,
          id:getRandomCode(16)
        })
      }
    }
    
  };

  return (
    <>
      <Modal
        title={task?.id ? 'Edit Task' : 'Add New Task'}
         className='!max-w-[600px]'
        body={<>
          <form onSubmit={handleSubmit} className="">
            <div className="py-4 max-h-[calc(100vh-150px)] overflow-auto">
              <div className="mb-4">
                <label htmlFor="taskProject" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <OptionDropdown
                  value={project}
                  className='w-full'
                  onChange={e => {
                    setProject(e)
                    setParent('')
                  }}
                  showUnselect
                  options={categories || []}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="taskTitleInput" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <textarea
                  id="taskTitleInput"
                  rows={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="taskDescriptionInput" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Editor
                className=''
                value={longDescription}
                onChange={(html,text)=>{
                setDescription(text)
                setLongDescription(html)
                }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="taskProject" className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <OptionDropdown
                  value={parent}
                  className='w-full'
                  onChange={e => {
                    setParent(e)
                  }}
                  showUnselect
                  options={tasks.filter(item => ((item.categoryDetail?.id == project)||(!project&&!item.categoryDetail)) && item.id != task?.id && !item.parent) || []}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="taskStatusInput" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <OptionDropdown
                  value={status}
                  className='w-full'
                  onChange={e => {
                    setStatus(e)
                  }}
                  options={taskStatus}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="taskDateInput" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  id="taskDateInput"
                  type="date"
                  value={datepipeModel.datetostring(dueDate)}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center hover:bg-indigo-600 transition mr-2"
              >
                <span className="material-symbols-outlined mr-2">save</span> Save Task
              </button>
              <button
                onClick={onClose}
                type='button'
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </>}
        result={onClose}
      />
    </>
  );
};

export default TaskFormModal;