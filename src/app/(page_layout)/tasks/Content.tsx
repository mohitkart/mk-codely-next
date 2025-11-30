'use client'

import Header from "@/components/Tasks/Header"
import { getColor } from "@/components/MkChart"
import { getRange } from "@/components/MkDateRangePicker"
import Modal from "@/components/Modal"
import { fire } from "@/components/Swal"
import Filters from "@/components/Tasks/Filters"
import Sidebar from "@/components/Tasks/Sidebar"
import Stats from "@/components/Tasks/Stats"
import TaskFormModal from "@/components/Tasks/TaskFormModal"
import TaskList from "@/components/Tasks/TaskList"
import ViewTaskModal, { ViewTaskModalRef } from "@/components/Tasks/ViewTaskModal"
import { RootState } from "@/redux/store"
import { Task, TaskFilters } from "@/types/tasks"
import datepipeModel from "@/utils/datepipemodel"
import { fireDateParse, FirestoreConditions } from "@/utils/firebase.utils"
import FireApi from "@/utils/firebaseApi.utils"
import { loaderHtml, replaceUrl } from "@/utils/shared"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"

export default function TaskComponent({loaderData}:{loaderData?:Task}) {
  const user: any = useSelector((state: RootState) => state.user.data);
  const table = 'tasks'
  const catTable = 'taskCategory'
  const {slug}=useParams()
  const viewModalRef = useRef<ViewTaskModalRef>(null);
  const { get, isLoading: listLoading } = FireApi()
  const router=useRouter()
  const query=useSearchParams()
  const navigate=(p='')=>{
    router.push(p)
  }
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const { get: getRecent, isLoading: recentLoading } = FireApi()
  const { deleteApi, put, post, isLoading: isDeleteLoading } = FireApi()

  const [data, setData] = useState<Task[]>([])
  const [categories, setCategories] = useState<any>([])
  const [selected, setSelected] = useState<any>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState<any>(false);
  const [copyModal, setCopyModal] = useState<any>();
  const [recentPost, setRecentPost] = useState<Task[]>([])
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
    const url=`/tasks/${task.id}`
    replaceUrl({url})
    // navigate(url)
  };


  const handleEditTask = (task: Task) => {
    setIsTaskFormOpen(task);
  };

  const handleAddTask = (project?: string) => {
    setIsTaskFormOpen({ category: project, status: 'In Progress', date: new Date().toISOString() });
  };

  const handleAddSubtask = (task: Task) => {
    setIsTaskFormOpen({ category: task.category, parent: task.id, status: 'In Progress', date: new Date().toISOString() });
  };

  const handleEditSubtask = (taskId: any, subtask: Task) => {
    setIsTaskFormOpen({ ...subtask, parent: taskId });
  };

  const handleSaveTask = (taskData: Task) => {
    const payload = {
      ...taskData
    }
    if (isTaskFormOpen?.id) {
      // Update existing task
      setData(data.map(t => t.id === isTaskFormOpen?.id ? { ...t, ...payload } : t));
      setRecentPost(recentPost.map(t => t.id === isTaskFormOpen?.id ? { ...t, ...payload } : t));
      
      // setIsViewModalOpen(false);
      if(selectedTask?.id==payload.id){
            setSelectedTask({
              ...selectedTask,
              ...payload
            })
        }else{
          viewModalRef.current?.refreshSubTasks({action:'edit',data:payload})
        }
    } else {
      // Add new task
      const newTask: Task = {
        ...payload,
        createdAt: new Date().toISOString()
      };
      setData([...data, newTask]);
       viewModalRef.current?.refreshSubTasks({action:'add',data:newTask})
    }
    setIsTaskFormOpen(null)
    // setIsViewModalOpen(false);
  };

  const handleDeleteTask = (id: any) => {
    fire({
      icon:'warning',
      title:'Are you sure you want to delete this task',
      showCancelButton:true
    }).then(res=>{
       if (res.isConfirmed) {
      if (user) {
        loaderHtml(true)
        deleteApi(table, id).then(res => {
          if (res.success) {
           setData((prev:Task[])=>{
                let arr=[...prev]
                 arr = arr.filter(itm => itm.id != id)
                return arr
              });
              setRecentPost((prev:Task[])=>{
                let arr=[...prev]
                 arr = arr.filter(itm => itm.id != id)
                return arr
              });
            viewModalRef.current?.refreshSubTasks({action:'delete',id:id})
          }
        }).finally(() => {
          loaderHtml(false)
        })

        data.filter(item => item.parent == id).map(item => {
          deleteApi(table, item.id).then(res => {
            if (res.success) {
              setData((prev:Task[])=>{
                let arr=[...prev]
                 arr = arr.filter(itm => itm.id != item.id)
                return arr
              });
              setRecentPost((prev: Task[]) => {
                let arr = [...prev]
                arr = arr.filter(itm => itm.id != item.id)
                return arr
              });
            }
          })
        })
      } else {
        let arr = [...data]
        data.filter(item => item.parent == id).map(item => {
           arr = arr.filter(itm => itm.id != item.id)
        })
        arr = arr.filter(itm => itm.id != id)
        setData([...arr]);
        setRecentPost((prev: Task[]) => {
          let arr = [...prev]
          arr = arr.filter(itm => itm.id != id)
          return arr
        });
      }
    }
    })
   
  }

  const onSaveTask = (task: Task) => {
    const p = {
      ...task
    }
    if (user) {
      loaderHtml(true)
      put(table, p).then(res => {
        if (res.success) {
          setData(data.map(t => t.id === p?.id ? { ...t, ...p } : t));
           setRecentPost(recentPost.map(t => t.id === p?.id ? { ...t, ...p } : t));
          // setIsViewModalOpen(false);
          if(selectedTask?.id==p.id){
            setSelectedTask({
              ...selectedTask,
              ...p
            })
          }else{
            viewModalRef.current?.refreshSubTasks({action:'edit',data:p})
          }
          
        }
      }).finally(() => {
        loaderHtml(false)
      })
    } else {
      setData(data.map(t => t.id === p?.id ? { ...t, ...p } : t));
    }
  }

  const handleCloseModals = () => {
    setIsViewModalOpen(false);
    setIsTaskFormOpen(null);
    setSelectedTask(null);
    // navigate('/tasks')
    replaceUrl({url:'/tasks'})
  };
  const range = getRange('Today')

  const [filters, setFilter] = useState<TaskFilters>({
    startDate: range.startDate,
    endDate: range.endDate,
    category: query.get('category'), search: query.get('search')
  })
  const getData = async () => {
    const startDate = new Date(`${filters.startDate} 00:00`);
    const endDate = new Date(`${filters.endDate} 23:59`);
    const conditions: FirestoreConditions[] = [
      { field: 'addedBy', operator: '==', value: user?.id },
    ]

    if (filters.startDate && filters.endDate) {
      conditions.push({ field: 'date', operator: '>=', value: startDate })
      conditions.push({ field: 'date', operator: '<=', value: endDate })
    }

    const res = await get(table, conditions)
    let data = []
    if (res.data) {
      data = res.data.map((itm:Task)=>({
        ...itm,
        date: fireDateParse(itm.date),
      }))
    }
    setData(data)
  }

  const getCategories = async () => {
    const res = await getCategory(catTable, [{ field: 'addedBy', operator: '==', value: user?.id }])
    let data = []
    if (res.data) {
      data = res.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) })).sort((a: any, b: any) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1; // a comes before b
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;  // a comes after b
        return 0;
      })
    }
    setCategories(data)
  }

  useEffect(() => {
    if (user) {
      getData()
    }
  }, [filters.startDate, filters.endDate])

  useEffect(() => {
    if (user) {
      getCategories()
    }
  }, [])
  useEffect(() => {
    if (!user) {
      setData([])
      setCategories([])
    }
  }, [user])

  useEffect(() => {
    if (loaderData) {
      handleTaskClick(loaderData)
    }
  }, [slug])

  useEffect(() => {
    if (user) {
      getRecent(table, [{ field: 'addedBy', operator: '==', value: user.id }], '', false, 'createdAt', 'desc', 10).then(res => {
        if (res.success) {
          const data = res.data.map((item: any) => ({ ...item, date: fireDateParse(item.date) }))
          setRecentPost(data)
        }
      })
    }else{
      setRecentPost([])
    }
  }, [])

  const list = useMemo(() => {
    return data.filter((item: Task) => {
      let value = true
      if (filters.category) {
        if (item.category != filters.category) value = false
      }
      if (filters.status) {
        if (item.status != filters.status) value = false
      }
      if (filters.startDate) {
        const startDate = new Date(`${filters.startDate} 00:00`).getTime();
        const endDate = new Date(`${filters.endDate} 23:59`).getTime();
        const date = new Date(fireDateParse(item.date)).getTime()
        if (date >= startDate && date <= endDate) value = true
        else value = false
      }
      if (filters.search) {
        const v = filters.search?.toLowerCase()
        if (!(item.name?.toLowerCase()?.includes(v)
          || item.description?.toLowerCase()?.includes(v)
        )) value = false
      }
      return value
    }).map((itm)=>({
      ...itm,
        categoryDetail: categories.find((cat: any) => cat.id == itm.category)
    })).sort((a: any, b: any) => {
      return new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
    })

  }, [data, filters,categories])

  const selectToggle = () => {
    if (selected.length) {
      setSelected([])
    } else {
      setSelected([...list.map(itm => itm.id)])
    }
  }


  const copySelected = () => {
    setCopyModal({
      date: datepipeModel.datetodatetime(new Date()),
    })
  }

  const copySubmit = async () => {
    const arr = [...list.filter(itm => selected.includes(itm.id))];
    loaderHtml(true);

    const data2: any[] = [];

    // Run async tasks in parallel and wait for all
    await Promise.all(
      arr.map(async item => {
        const p = { ...item, copyId: item.id };
        delete p.id;

        const res = await post(table, {
          ...p,
          date: new Date(copyModal.date),
          name: `${item.name} - copy`,
          status: "In Progress",
          time: "",
          endDate: null,
          parent: null,
        });

        if (res.success) {
          data2.push({
            ...res.data,
            createdAt: new Date().toISOString(),
          });
          list.filter(itm=>itm.parent==p.copyId).map(async citem => {
            const p = { ...citem, copyId: citem.id };
            delete p.id;
            const childres = await post(table, {
              ...p,
              date: new Date(copyModal.date),
              name: `${citem.name} - copy`,
              status: "In Progress",
              time: "",
              endDate: null,
              parent: res.data?.id,
            });
            if (childres.success) {
              data2.push({
                ...childres.data,
                createdAt: new Date().toISOString(),
              });
            }
          })
        }
      })
    );

    setData([...data, ...data2]);
    loaderHtml(false);
    setCopyModal(null);
    setSelected([]);
  };


  return (
    <div className={`flex min-h-screen ${user?'bg-gray-50':'bg-red-50'} text-gray-800`}>
      <Sidebar
        tasks={data}
        filters={filters}
        categories={categories}
        isLoading={categoryLoading}
        setCategories={setCategories}
        recentPost={recentPost}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        onChange={(e: TaskFilters) => setFilter(prev => ({ ...prev, ...e }))}
      />
      <div className="md:ml-64 flex-1 p-5 md:p-8">
        <Header onAddTask={handleAddTask}
          tasks={data}
          selected={selected}
          categories={categories}
          filters={filters}
          onChange={(e: TaskFilters) => setFilter(prev => ({ ...prev, ...e }))}
        />
        <Stats tasks={list} />
        <Filters
          filters={filters}
          onChange={(e: TaskFilters) => setFilter(prev => ({ ...prev, ...e }))}
        />
        <div className="flex flex-wrap gap-3 mb-3">
          <div
            onClick={() => selectToggle()}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer inline-block"
          >
            {selected.length ? 'Unselect All' : 'Select All'}
          </div>
          {selected.length > 0 && (
            <>
              <div
                onClick={() => copySelected()}
                className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline cursor-pointer inline-block"
              >
                Copy Tasks
              </div>
            </>
          )}
        </div>
        <TaskList
          listLoading={listLoading}
          categoryLoading={categoryLoading}
          tasks={list}
          selected={selected}
          onSelect={(e: any) => setSelected([...e])}
          categories={categories}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onSaveTask={onSaveTask}
        />
      </div>

      {isViewModalOpen && selectedTask && (
        <ViewTaskModal
          task={selectedTask}
          ref={viewModalRef}
          tasks={list}
           selected={selected}
          onSelect={(e: any) => setSelected([...e])}
           onTaskClick={handleTaskClick}
          onSaveTask={onSaveTask}
          onClose={handleCloseModals}
          onEditTask={handleEditTask}
          onAddSubtask={handleAddSubtask}
          onEditSubtask={handleEditSubtask}
          onDeleteSubtask={handleDeleteTask}
        />
      )}

      {isTaskFormOpen && (
        <TaskFormModal
          categories={categories}
          task={isTaskFormOpen}
          tasks={list}
          // onClose={()=>setIsTaskFormOpen(false)}
          onClose={()=>setIsTaskFormOpen(null)}
          onSave={handleSaveTask}
        />
      )}

      {copyModal ? <>
        <Modal
          title='Copy Tasks'
          body={<>
            <form
              className="pt-3"
              onSubmit={e => {
                e.preventDefault();
                copySubmit();
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-medium">Task Start Date</label>
                <input
                  type="datetime-local"
                  value={copyModal.date}
                  onChange={e =>
                    setCopyModal((prev: any) => ({ ...prev, date: e.target.value }))
                  }
                  readOnly
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>

          </>}
          result={() => setCopyModal(null)}
        />
      </> : <></>}

    </div>
  );
}