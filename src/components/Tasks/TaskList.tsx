// components/TaskList.tsx
import React, { Fragment, useMemo } from 'react';
import { taskStatus, type Task } from '@/types/tasks';
import datepipeModel from '@/utils/datepipemodel';
import OptionDropdown from '../OptionDropdown';
import { truncate } from '@/utils/shared';

interface TaskListProps {
  tasks: Task[];
  categories: any[];
  listLoading?: boolean;
  categoryLoading?: boolean;
  selected?: any[];
  onSelect: (task: any) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (project?: string) => void;
  onDeleteTask: (id?: string) => void;
  onSaveTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

type catprops = {
  item: any;
  tasks: Task[];
  selectTask: (id: any) => void;
  selected: any[];
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id?: string) => void;
  onSaveTask: (task: Task) => void;
  onAddTask: (project?: string) => void;
}
const CategoryCard = ({ item, tasks, selectTask, selected = [],
  onTaskClick = (_: any) => { },
  onEditTask = (_: any) => { },
  onDeleteTask = (_: any) => { },
  onSaveTask = (_: any) => { },
  onAddTask = (_: any) => { },

}: catprops) => {
  return <div key={item.id} className="bg-white rounded-lg shadow-sm border project-card">
    <div className="p-4 border-b">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg flex items-center"
        style={{color:item.color}}
        arial-id={item.id}>
          <span className={`material-symbols-outlined mr-2 !text-[18px]`}>circle</span>
          {item.name}
        </h2>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {item.tasks.length} tasks
        </span>
      </div>
    </div>
    <div className="p-4 space-y-4">
      {item.tasks?.map((task: Task) => {
        const subTasks = tasks.filter(t => t.parent == task.id);

        return <div
          key={task.id}
          className="border rounded-lg p-4 hover:bg-gray-50 task-item"
        >
          <div className="flex items-start gap-1">
            <div className="inline-flex items-center mt-0.5">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                // checked={task.status === 'Done'}
                onClick={() => selectTask(task.id)}
                readOnly
                checked={selected.includes(task.id)}
              />
              <span
                onClick={() => onTaskClick(task)}
                className={`ml-3 cursor-pointer ${task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {truncate(task.name, 150)}
              </span>
            </div>
            <button
              className="ml-auto edit-task-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task);
              }}
            >
              <span className="material-symbols-outlined text-gray-400 hover:text-gray-600 !text-[18px]">edit</span>
            </button>
            <button
              className="edit-task-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
            >
              <span className="material-symbols-outlined text-gray-400 hover:text-gray-600 !text-[18px]">delete</span>
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2 ml-7">
            <span className="mr-3 flex items-center">
              <span className="material-symbols-outlined mr-1 !text-[18px]">schedule</span> {datepipeModel.datetime(task.createdAt || '')}
            </span>
            <OptionDropdown
              title={<>
                <span className={`inline-flex cursor-pointer items-center px-2 py-0.5 rounded-full text-xs ${task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  <span className="material-symbols-outlined mr-1 !text-xs">
                    {task.status === 'In Progress' ? 'sync' :
                      task.status === 'Done' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {task.status}
                </span>
              </>}
              options={taskStatus}
              value={task.status}
              onChange={e => {
                onSaveTask({ id: task.id, status: e })
              }}
            />
          </div>
          <div className='flex gap-2 flex-wrap mt-3'>
            <div onClick={() => onTaskClick(task)} className={`${subTasks?.length?'text-blue-500':'text-gray-500'} cursor-pointer text-sm flex items-center`}>
              <span className="material-symbols-outlined mr-1 !text-sm">format_list_bulleted</span>
              <span>{subTasks?.length} Subtasks</span>
            </div>
            <div onClick={() => onTaskClick(task)} className="cursor-pointer text-sm text-gray-500 flex items-center">
              <span className="material-symbols-outlined mr-1 !text-sm">folder</span>
              <span>{task?.categoryDetail?.name||task?.category||'Other'}</span>
            </div>
          </div>
         
        </div>
      })}
    </div>
    <div className="p-4 border-t">
      <button
        onClick={() => onAddTask(item.id)}
        className="w-full text-center text-blue-600 hover:bg-gray-100 py-2 rounded-md text-sm flex items-center justify-center"
      >
        <span className="material-symbols-outlined mr-2 !text-[18px]">add</span> Add Task
      </button>
    </div>
  </div>
}

const TaskList: React.FC<TaskListProps> = ({ tasks, categories = [], selected = [], onSelect, listLoading = false, categoryLoading = false, onTaskClick, onDeleteTask, onEditTask, onSaveTask, onAddTask }) => {
  const projects = useMemo(() => {
    const arr = categories.map((item: any) => {
      const projectTasks = tasks.filter(task => task.category === item.id);
      return {
        ...item,
        tasks: projectTasks.filter(itm => !itm.parent)
      }
    }).filter(itm => itm.tasks.length)

    return arr
  }, [tasks, categories])

  const selectTask = (id: any) => {
    const ext = selected.includes(id)
    let arr = [...selected]
    if (ext) arr = arr.filter(itm => itm != id)
    else arr.push(id)
    onSelect(arr)
  }

  const otherTasks=useMemo(()=>{
    return tasks.filter(task => !task.categoryDetail&&!task.parent).map(task=>({...task,category:''}))
  },[tasks])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {categoryLoading || listLoading ? <>
        <div className="bg-white h-[300px] shine rounded-lg shadow-sm border project-card"></div>
        <div className="bg-white h-[300px] shine rounded-lg shadow-sm border project-card"></div>
        <div className="bg-white h-[300px] shine rounded-lg shadow-sm border project-card"></div>
        <div className="bg-white h-[300px] shine rounded-lg shadow-sm border project-card"></div>
      </> : <>
        {projects.map(item => {
          return (
            <Fragment key={item.id}>
              <CategoryCard
                tasks={tasks}
                selectTask={selectTask}
                selected={selected}
                onTaskClick={onTaskClick}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onSaveTask={onSaveTask}
                onAddTask={onAddTask}
                item={item}
              />
            </Fragment>
          );
        })}
        {otherTasks.length?<>
        <CategoryCard
                tasks={tasks}
                selectTask={selectTask}
                selected={selected}
                onTaskClick={onTaskClick}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onSaveTask={onSaveTask}
                onAddTask={onAddTask}
                item={{
                  name:'Other',
                  id:null,
                  tasks:otherTasks
                }}
              />
        </>:<></>}
        
      </>}

    </div>
  );
};

export default TaskList;