// components/Sidebar.tsx

import { useMemo, useState } from "react";
import type { Task, TaskFilters } from "~/types/tasks";
import FireApi from "~/utils/firebaseApi.utils";
import { getRandomCode, loaderHtml } from "~/utils/shared";
import Modal from "../Modal";
import { useSelector } from "react-redux";
import type { RootState } from "~/redux/store";
import { getColor } from "../MkChart";
import { fire } from "../Swal";

type props = {
  filters?: TaskFilters;
  tasks: Task[];
  categories: any[];
  isLoading?: boolean;
  onChange?: any;
  setCategories: (_: any) => void
}

const Sidebar = ({ categories, setCategories, filters, isLoading = false, onChange = (_: any) => { }, tasks }: props) => {
  const user: any = useSelector((state: RootState) => state.user.data);
  const catTable = 'taskCategory'
  const table = 'tasks'
  const { deleteApi, put, post, isLoading: isDeleteLoading } = FireApi()
  const [editModal, setEditModal] = useState<any>()
  const [search, setSearch] = useState<any>('')

  const onEditCategory = (item: any) => {
    setEditModal({
      name: item.name,
      id: item.id
    })
  }

  const onDeleteCategory = (id: any) => {
    fire({
      icon:'warning',
      title:'Are you sure you want to delete this project',
      showCancelButton:true
    }).then(res=>{
     if (res.isConfirmed) {
      if (user) {
        loaderHtml(true)
        deleteApi(catTable, id).then(res => {
          if (res.success) {
            let arr = [...categories]
            arr = arr.filter(itm => itm.id != id)
            setCategories([...arr]);
          }
        }).finally(() => {
          loaderHtml(false)
        })

        tasks.filter(item => item.category == id).map(item => {
          deleteApi(table, item.id).then(res => {
            if (res.success) {

            }
          })
        })
      } else {
        let arr = [...categories]
        arr = arr.filter(itm => itm.id != id)
        setCategories([...arr]);
      }

    }
    })
    
  }

  const AddCategory = () => {
    setEditModal({
      name: ''
    })
  }

  const onCategorySave = (res: any) => {
    let payload = {
      ...res
    }
    if (editModal?.id) {
      // Update existing task
      setCategories(categories.map(t => t.id === editModal?.id ? { ...t, ...payload } : t));
    } else {
      // Add new task
      const newData: Task = {
        ...payload,
        createdAt: new Date().toISOString(),
        color: getColor() 
      };
      setCategories([...categories, newData]);
    }
    setEditModal(null);
  }

  const formSubmit = () => {
    let payload: any = {
      name: editModal.name || '',
    }

    if (user) {
      loaderHtml(true)
      if (editModal?.id) {
        payload.id = editModal.id
        put(catTable, payload).then(res => {
          if (res.success) {
            onCategorySave(res.data)
          }
        }).finally(() => {
          loaderHtml(false)
        })
      } else {
        post(catTable, payload).then(res => {
          if (res.success) {
            onCategorySave(res.data)
          }
        }).finally(() => {
          loaderHtml(false)
        })
      }
    } else {
      if (editModal?.id) {
        payload.id = editModal.id
        onCategorySave(payload)
      } else {
        onCategorySave({
          ...payload,
          id: getRandomCode(16)
        })
      }
    }

  }

  const catList=useMemo(()=>{
      return categories.filter((item: Task) => {
      let value = true
      let s = search?.toLowerCase().trim()
      if (s) {
        if (!(item.name?.toLowerCase()?.includes(s)
        )) value = false
      }
      return value
    })
  },[categories,search])

  return (
    <>
      <div className="w-64 bg-white shadow-sm fixed h-full hidden md:block">
        <div className="p-5 border-b">
          <h1 className="text-xl font-bold text-blue-600 flex items-center">
            <span className="material-icons mr-2">task</span> Task Manager
          </h1>
        </div>
        <div className="p-4">
          <h2 className="text-xs uppercase text-gray-500 mb-3 tracking-wider font-semibold">Projects</h2>
          <div className="relative mb-4">
            <input type="text"
            value={search}
            onChange={e=>setSearch(e.target.value.trimStart())}
            placeholder="Search Project" className="w-full p-2 text-sm border rounded-md pl-8 focus:ring-1 focus:ring-blue-600 focus:border-blue-600" />
            <span className="material-icons absolute left-2 top-2.5 text-gray-400">search</span>
          </div>

          <ul className="space-y-1 overflow-auto h-[calc(100vh-400px)]">

            {isLoading ? <>
              <div className="shine h-[36px]"></div>
              <div className="shine h-[36px]"></div>
              <div className="shine h-[36px]"></div>
              <div className="shine h-[36px]"></div>
              <div className="shine h-[36px]"></div>
            </> : <>
              <li onClick={() => onChange({ category: '' })} className={`sticky top-0 ${!filters?.category ? 'bg-indigo-50' : 'bg-white'} flex items-center text-sm p-2 hover:bg-indigo-50 text-blue-600 rounded-md cursor-pointer font-medium`}>
                <span className="material-icons mr-2 text-blue-600">folder_open</span>
                All Projects <button
                  className="ml-auto edit-task-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    AddCategory();
                  }}
                >
                  <span className="material-icons text-gray-400 hover:text-gray-600">add</span>
                </button>
              </li>
              {catList?.map((item: any) => {
                return <li key={item.id} onClick={() => onChange({ category: item.id })} className={`flex items-center ${filters?.category == item.id ? 'bg-blue-100' : ''} text-sm p-2 hover:bg-gray-100 rounded-md cursor-pointer`}>
                  <span className={`material-icons mr-2 text-[${item.color}]`}>folder</span>
                  {item.name}

                  <button
                    className="ml-auto edit-task-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(item);
                    }}
                  >
                    <span className="material-icons text-gray-400 hover:text-gray-600">edit</span>
                  </button>
                  <button
                    className="edit-task-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(item.id);
                    }}
                  >
                    <span className="material-icons text-gray-400 hover:text-gray-600">delete</span>
                  </button>
                </li>
              })}
            </>}

          </ul>

          <h2 className="text-xs uppercase text-gray-500 my-3 mt-6 tracking-wider font-semibold">Recent</h2>
          <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
            <p className="text-xs font-medium text-indigo-700 flex items-center">
              <span className="material-icons mr-1">schedule</span> Shroom Groove
            </p>
            <p className="text-xs text-gray-500 mt-1">Last active: 2 Sep 2025</p>
          </div>
        </div>
      </div>

      {editModal ? <>
        <Modal
          title={`${editModal?.id ? 'Edit' : 'Add'} Project`}
          content={<>
            <form
              className="pt-3"
              onSubmit={e => {
                e.preventDefault();
                formSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={e =>
                    setEditModal((prev: any) => ({ ...prev, name: e.target.value }))
                  }
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
          onClose={() => setEditModal(null)}
        />
      </> : <></>}
    </>

  );
};

export default Sidebar;