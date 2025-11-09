'use client'

import { fire } from "@/components/Swal";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { loaderHtml } from "@/utils/shared";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ADD_PAGE_NAME, PAGE_NAME, PAGE_TABLE } from "./shared";
import { FirestoreConditions } from "@/utils/firebase.utils";
import OptionDropdown from "@/components/OptionDropdown";
import datepipeModel from "@/utils/datepipemodel";
import DebouncedInput from "@/components/DebouncedInput";
import Modal from "@/components/Modal";
import AddEdit from "./AddEdit";
import ExpenseTabs from "../ExpenseTabs";
import { indexedDBStorage } from "@/utils/indexedDBStorage";

export type ExpenseForm = {
  id?: string | null
  name: string
}

export type CategoryType = {
  id: string | null
  name: string
  color: string
}

export type PersonType = {
  id: string | null
  name: string
  color: string
}

export default function Content() {
  const user: any = useSelector((state: RootState) => state.user.data);
  const [list, setList] = useState<ExpenseForm[]>([])
  const [addeditModal, setAddeditModal] = useState<any>();
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt desc',
  })
  const { get: getList, isLoading: isListLoading } = FireApi()
  const { deleteApi, isLoading: isActionLoading } = FireApi()


  const remove = (id: any) => {
    fire({
      icon: 'warning',
      title: 'Do you want to delete this?', cancelButtonText: 'No', confirmButtonText: 'Yes', showCancelButton: true
    }).then(res => {
      if (res.isConfirmed) {
        loaderHtml(true)
        deleteApi(PAGE_TABLE, id).then(res => {
          if (res.success) {
            const arr = list.filter((itm: any) => itm.id != id)
            setList(arr)
          }
        }).finally(() => {
          loaderHtml(false)
        })
      }
    })
  }

  const getData = async () => {
    const conditions: FirestoreConditions[] = [
      { field: 'addedBy', operator: '==', value: user?.id },
    ]

    let data = []
    if(user){
          const res = await getList(PAGE_TABLE, conditions)
  if (res.data) {
      data = res.data.map((itm: any) => ({
        ...itm,
        createdAt: itm.createdAt || itm.date,
        status: itm.status || 'deactive'
      }))
    }
    }else{
  const datad = await indexedDBStorage.getItem(PAGE_TABLE)
      data = datad || []
    }
    setList(data)
  }

  useEffect(() => {
    getData()
  }, [])

  const filter = (p = {}) => {
    setFilters(prev => ({ ...prev, ...p }))
  }

  const isReset = useMemo(() => {
    let value = false
    const keys = [
      'search',
      // 'status',
    ]
    const f: any = filters
    if (keys.find(key => f[key] ? true : false)) value = true
    return value
  }, [filters])

  const reset = () => {
    const f = {
      // status: '',
      search: '',
    }
    filter(f)
  }

  const data = useMemo(() => {
    const key = filters.sortBy?.split(' ')[0] || 'createdAt';
    return list
      .map(item => {
        return {
          ...item,
        }
      })
      ?.filter((item: any) => {
        if (filters.search) {
          const searchValue = filters.search.toLowerCase().trim();
          const title = item.name?.toLowerCase() || '';
          if (!title.includes(searchValue))
            return false;
        }

        return true;
      })
      ?.sort((a: any, b: any) => {
        const aVal = a?.[key];
        const bVal = b?.[key];
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(bVal).getTime() - new Date(aVal).getTime();
        }
        if (key === 'price') {
          return bVal - aVal
        }
        return String(aVal || '').localeCompare(String(bVal || ''));
      });
  }, [list, filters]);


  const sortByList = [
    {
      name: 'Latest First',
      id: 'createdAt desc'
    },
    {
      name: 'Name - A-Z',
      id: 'name desc'
    },
  ]

  function edit(item: any) {
    setAddeditModal(item)
  }
  function add() {
    setAddeditModal({
      name: 'untitled'
    })
  }

  const formAction = async (e: any) => {
    setAddeditModal(null)
    if (e.action == 'submit') {
      if (addeditModal?.id) {
        const arr: any[] = [...list]
        const index = arr.map(itm => itm.id).indexOf(addeditModal?.id)
        arr[index] = {
          ...arr[index],
          ...e.value,
        }

        if (!user) {
          await indexedDBStorage.setItem(PAGE_TABLE, arr)
        }
        setList([...arr])
      } else {
        const arr: any[] = [...list]
        arr.push({
          ...e.value,
          createdAt: datepipeModel.datetodatetime(e.value.createdAt)
        })

        if (!user) {
          await indexedDBStorage.setItem(PAGE_TABLE, arr)
        }
        setList([...arr])
      }
    }
  }

  return <>
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{PAGE_NAME}</h1>
            <p className="text-gray-600 mt-2">Manage your {ADD_PAGE_NAME} efficiently</p>
          </div>

          <button type="button"
            onClick={() => add()}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center">
            <span className="material-symbols-outlined mr-2 text-sm">add</span>
            Add {ADD_PAGE_NAME}
          </button>
        </div>

      </header>
      <div className="mb-3">
        <ExpenseTabs />
      </div>


      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="search-filter" className="mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <DebouncedInput
                value={filters.search}
                onChange={e => filter({ search: e })}
                type="text" placeholder="Search..." className="px-3 py-2 border border-gray-300 rounded-md" />
              <div>
                <OptionDropdown
                  value={filters.sortBy}
                  options={sortByList}
                  isSearch={false}
                  onChange={e => filter({ sortBy: e })}
                  showUnselect={false}
                />
              </div>
              {isReset ? <>
                <button type="button"
                  onClick={() => reset()}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                  Reset
                </button>
              </> : <></>}

            </div>
          </div>


          <div id="expense-list" className="space-y-4 min-h-[50px] relative">
            {isListLoading ? <>
              <div className="p-3 text-center absolute top-0 left-0 w-full text-green-500">Loading....</div>
            </> : <></>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item: any) => {
                return <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200" key={item.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-800 mr-2">{item.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{datepipeModel.datetime(item.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      onClick={() => edit(item)}
                      className="edit-btn p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="delete-btn p-1 text-red-600 hover:bg-red-100 rounded">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              })}
            </div>
        

          </div>
        </div>
      </div>

    </div>

    {addeditModal ? <Modal
      title={`${addeditModal?.id ? 'Edit' : 'Add'} ${ADD_PAGE_NAME}`}
      body={<>
        <AddEdit
          detail={addeditModal}
          action={formAction}
        />
      </>}
      result={() => setAddeditModal(null)}
    /> : <></>}

  </>;
}