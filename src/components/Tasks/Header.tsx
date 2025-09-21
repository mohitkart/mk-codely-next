// components/Header.tsx
import React from 'react';
import { toast } from 'react-toastify';
import type { Task, TaskFilters } from '@/types/tasks';
import datepipeModel from '@/utils/datepipemodel';
import { copyClipboard } from '@/utils/shared';

interface HeaderProps {
  onAddTask: () => void;
  filters?: TaskFilters;
  categories:any[];
  tasks:Task[];
  selected?:any[];
  onChange:(_:TaskFilters) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask,filters,tasks,categories=[],selected=[],onChange=(_)=>{} }) => {

    const copyTasks = () => {
    let text = `Date:- ${datepipeModel.date(filters?.startDate)}\n\n`

    const getSubTask = (parent: any, category: any) => {
      let text = ''
      let tasks1 = tasks.filter((itm: Task) => itm.category === category && itm.parent == parent).sort((a:any, b: any) => b.order - a.order);
      if (selected?.length) tasks1 = tasks1.filter((itm:Task) => selected.includes(itm.id));
      if (tasks1.length) {
        tasks1.map((itm:Task, i: number) => {
          text += `--> ${i + 1}) ${itm.name} - ${itm.status}${itm.description ? `\n${itm.description}` : ''}`
          if (itm.image) {
            text += `\nAttachment : ${itm.image?.url}`
          }
          text += `\n`
        })

        text += ``
      }

      return text
    }

    const getTasks = (citm: { id: any; name: any; }) => {
      let  tasks1 = tasks.filter((itm: Task) => itm.category === citm.id && !itm.parent).sort((a: any, b: any) => b.order - a.order);
      if (selected.length) tasks1 = tasks1.filter((itm: Task) => selected.includes(itm.id));
      let text = ''
      if (tasks1.length) {
        text += citm.id ? `Project:- ${citm.name}\n` : `Other\n`
        tasks1.map((itm: Task, i: number) => {
          text += `#${i + 1}. ${itm.name} - ${itm.status}${itm.description ? `\n${itm.description}` : ''}`


          if (itm.image) {
            text += `\nAttachment : ${itm.image.url}`
          }

          text += `\n\n`

          text += `${getSubTask(itm.id, citm.id)}\n`
        })

        text += `-------------------------------------------------------\n\n`
      }

      return text
    }

    categories.map(citm => {
      text += getTasks(citm)
    })
    text += getTasks({ id: '', name: 'Other' })
    navigator.clipboard.writeText(text);
     copyClipboard(text)
    toast.success("Copied")
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Task Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your projects and tasks efficiently</p>
      </div>
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        <div className="relative">
          <input type="text" placeholder="Search tasks..."
          value={filters?.search||''}
          onChange={e=>onChange({ search:e.target.value.trimStart() })}
          className="pl-9 pr-4 py-2 border rounded-md text-sm w-full md:w-64 focus:ring-1 focus:ring-blue-600 focus:border-blue-600" />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
        </div>
        <button 
          onClick={()=>onAddTask()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center hover:bg-indigo-600 transition"
        >
          <span className="material-symbols-outlined mr-2">add</span> Add Task
        </button>
        <button 
          onClick={()=>copyTasks()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center hover:bg-indigo-600 transition"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default Header;