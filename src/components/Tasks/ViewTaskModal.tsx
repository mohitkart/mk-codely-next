// components/ViewTaskModal.tsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { taskStatus, type Task } from '@/types/tasks';
import datepipeModel from '@/utils/datepipemodel';
import Modal from '../Modal';
import { truncate } from '@/utils/shared';
import OptionDropdown from '../OptionDropdown';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import FireApi from '@/utils/firebaseApi.utils';
import { fireDateParse, type FirestoreConditions } from '@/utils/firebase.utils';
import Breadcrumb from '../Breadcrumb';
import { TruncateHtml } from '@/utils/shared.utils';

interface ViewTaskModalProps {
  task: Task;
  tasks: Task[];
  selected:any[];
  onClose: () => void;
  onSelect: (_:any) => void;
  onEditTask: (task: Task) => void;
  onAddSubtask: (task: Task) => void;
  onEditSubtask: (taskId: any, subtask: Task) => void;
  onDeleteSubtask: (taskId: any) => void;
  onSaveTask: (task: Task) => void;
  onTaskClick: (task: Task) => void;
}


type refershProps ={
  data?:any;
  id?:any;
  action:'add'|'delete'|'edit';
}
export interface ViewTaskModalRef {
  refreshSubTasks: (_:refershProps) => void;   // ✅ function exposed to parent
}

const ViewTaskModal = forwardRef<ViewTaskModalRef, ViewTaskModalProps>(({
  task,
  tasks,
  selected=[],
  onSelect,
  onClose,
  onEditTask,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onSaveTask,
  onTaskClick
}, ref) => {
  const table = 'tasks'
  const catTable = 'taskCategory'
  const user: any = useSelector((state: RootState) => state.user.data);
  const statusClass = task.status === 'In Progress'
    ? 'bg-blue-100 text-blue-800'
    : task.status === 'Done'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  const { get: getTasks, isLoading: isTaskLoading } = FireApi()
  const { get: getParent, isLoading: isParentLoading } = FireApi()
  const { get: getCategory, isLoading: isCategoryLoading } = FireApi()
  const [subTasks, setSubTask] = useState<Task[]>([])
  const [category, setCategory] = useState<any>()
  const [parent, setParent] = useState<any>()

  // ✅ internal function to reload subtasks
  const loadSubTasks = async () => {
    if (user) {
      const conditions: FirestoreConditions[] = [
        { field: 'parent', operator: '==', value: task.id }
      ]
      const res = await getTasks(table, conditions);
      if (res.success) {
        const data = res.data.map((itm: Task) => ({ ...itm, date: fireDateParse(itm.date) })).sort((a: any, b: any) => {
          return new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
        })
        setSubTask(data)
      }
    } else {
      const arr=tasks.filter(itm=>itm.parent==task.id)
      setSubTask([...arr])
    }
  }


  const refreshCall=(p:refershProps)=>{
    let arr=[...subTasks]
    if(p.action=='delete'){
      arr=arr.filter(itm=>itm.id!=p.id)
    }else if(p.action=='add'){
      arr.push(p.data)
    }else if(p.action=='edit'){
      if(p.id==task.id){
        // task=p.data
      } else {
        arr = arr.map(t => t.id === p?.data?.id ? { ...t, ...p?.data } : t)
      }
    }

    setSubTask([...arr].sort((a: any, b: any) => {
      return new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
    }))
  }

  useImperativeHandle(ref, () => ({
    refreshSubTasks: refreshCall
  }))

   const selectTask = (id: any) => {
    const ext = selected.includes(id)
    let arr = [...selected]
    if (ext) arr = arr.filter(itm => itm != id)
    else arr.push(id)
    onSelect(arr)
  }

  useEffect(() => {
    loadSubTasks();

    if (task.category) {
      getCategory(catTable, [], task.category).then(res => {
        if (res.success) {
          setCategory(res.data)
        }
      })
    }
  }, [task.id])

  useEffect(()=>{
    if(task.parent){
      getParent(table, [], task.parent).then(res => {
        if (res.success) {
          const data = res.data
          data.date = fireDateParse(data.date),
            setParent(data)
        }
      })
    }else{
      setParent(null)
    }
  },[task.parent])

  if (!task.categoryDetail) task.categoryDetail = category

  return (
    <>
      <Modal
        className='!max-w-[900px]'
        title="Task Details"
        body={<>
          <div className="py-4 max-h-[calc(100vh-150px)] overflow-auto">
            {isParentLoading?<>
            <div className='shine h-[30px] mb-3'></div>
            </>:<>
            {parent?<>
              <Breadcrumb
            className='mb-3'
            links={[
              {
                name:'Task Management',
                onClick:()=>{
                  onClose()
                }
              },
              {
                name:parent?.name,
                onClick:()=>{
                  onTaskClick(parent)
                }
              }
            ]}
            currentPage={task.name||''}
            />
            </>:<>
              <Breadcrumb
            className='mb-3'
            links={[
              {
                name:'Task Management',
                 onClick:()=>{
                  onClose()
                }
              }
            ]}
             currentPage={task.name||''}
            />
            </>}
            </>}
          
            <h4 className="text-lg font-medium mb-2  whitespace-pre-line">{task.name}</h4>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="material-symbols-outlined mr-1 text-gray-400">schedule</span>
              <span>{datepipeModel.datetime(task.date||'')}</span>
            </div>
            <div className="mb-4 flex gap-2">
              <OptionDropdown
                title={<>
                  <span className={`cursor-pointer inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                    {task.status}
                  </span>
                </>}
                options={taskStatus}
                value={task.status}
                onChange={e => {
                  onSaveTask({ id: task.id, status: e })
                }}
                disabled={!(task?.addedBy == user?.id)}
              />
              {isCategoryLoading?<>
               <div className="shine h-[26px] w-[120px]"></div>
              </>:<>
               <div className="cursor-pointer text-sm text-gray-500 flex items-center">
                <span className="material-symbols-outlined mr-1 text-sm">folder</span>
                <span>{task?.categoryDetail?.name || task?.category || 'Other'}</span>
              </div>
              </>}
             
            </div>
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-2">Description</h5>
              <p className="text-gray-600 whitespace-pre-line">{TruncateHtml(task.longDescription,150)}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-700">Subtasks</h5>
                {task?.addedBy == user?.id ? <>
                  <button
                    onClick={() => onAddSubtask(task)}
                    className="text-blue-600 text-sm flex items-center"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">add</span> Add Subtask
                  </button>
                </> : <></>}
              </div>
              <div className="space-y-2 mt-2">
                {isTaskLoading?<>
                  <div className='shine h-[44px] mb-1'></div>
                  <div className='shine h-[44px] mb-1'></div>
                  <div className='shine h-[44px] mb-1'></div>
                  <div className='shine h-[44px] mb-1'></div>
                </>:<>
                {subTasks?.length === 0 ? (
                  <p className="text-gray-500 text-sm py-2 text-center">No subtasks yet</p>
                ) : (
                  subTasks?.map(subtask => {
                    const subtaskStatusClass = subtask.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : subtask.status === 'Done'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800';

                    return (
                      <div key={subtask.id} className="subtask-item flex items-center p-2 border rounded-md">
                        <span className="inline-flex items-center flex-1">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            // checked={task.status === 'Done'}
                            onClick={() => selectTask(subtask.id)}
                            readOnly
                            checked={selected.includes(subtask.id)}
                          />
                          <span 
                          onClick={()=>onTaskClick(subtask)}
                          className={`cursor-pointer ml-2 ${subtask.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {subtask.name}
                          </span>
                        </span>

                        <OptionDropdown
                          title={<>
                            <span className={`cursor-pointer inline-block px-2 py-1 rounded-full text-xs font-medium ${subtaskStatusClass} mr-2`}>
                              {subtask.status}
                            </span>
                          </>}
                          options={taskStatus}
                          value={subtask.status}
                          onChange={e => {
                            onSaveTask({ id: subtask.id, status: e })
                          }}
                          disabled={!(subtask?.addedBy == user?.id)}
                        />
                        {subtask?.addedBy == user?.id ? <>
                          <button
                            onClick={() => onEditSubtask(task.id, subtask)}
                            className="edit-subtask-btn text-gray-400 hover:text-gray-600"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteSubtask(subtask.id)}
                            className="delete-subtask-btn text-gray-400 hover:text-red-600 ml-1"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </> : <></>}


                      </div>
                    );
                  })
                )}
                </>}
                
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            {task?.addedBy == user?.id ? <>
              <button
                onClick={() => onEditTask(task)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center hover:bg-indigo-600 transition mr-2"
              >
                <span className="material-symbols-outlined mr-2">edit</span> Edit
              </button>
            </> : <></>}

            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </>}
        result={onClose}
      />
    </>
  );
});

ViewTaskModal.displayName='ViewTaskModal'
export default ViewTaskModal;
