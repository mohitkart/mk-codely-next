'use client'

import { fire } from "@/components/Swal";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { loaderHtml } from "@/utils/shared";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ADD_PAGE_NAME, EXPENSE_CATEGORY_TABLE, EXPENSE_STATUS_LIST, EXPENSE_TYPE_LIST, PAGE_NAME, PAGE_TABLE } from "./shared";
import { EXPENSE_CATEGORY_TABLE as contri_table } from "./contri/shared"
import { fireDateParse, FirestoreConditions } from "@/utils/firebase.utils";
import { getColor } from "@/components/MkChart";
import OptionDropdown from "@/components/OptionDropdown";
import datepipeModel from "@/utils/datepipemodel";
import pipeModel from "@/utils/pipeModel";
import DebouncedInput from "@/components/DebouncedInput";
import Modal from "@/components/Modal";
import AddEdit from "./AddEdit";
import ExpenseTabs from "./ExpenseTabs";
import { createBackup } from "@/utils/backup";
import MkDateRangePicker, { getRange } from "@/components/MkDateRangePicker";
import { indexedDBStorage } from "@/utils/indexedDBStorage";

export type ExpenseForm = {
  id?: string | null
  name: string
  status: string
  price: any
  date: any
  category: string
  type: string
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
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [addeditModal, setAddeditModal] = useState<any>();
  const range = getRange('This Month')
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'date desc',
    status: '',
    type: '',
    category: [],
    startDate: range.startDate,
    range: range.range,
    endDate: range.endDate,
  })
  const { get: getList, isLoading: isListLoading } = FireApi()
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const { deleteApi, isLoading: isActionLoading } = FireApi()


  const remove = (id: any) => {
    fire({
      icon: 'warning',
      title: 'Do you want to delete this?', cancelButtonText: 'No', confirmButtonText: 'Yes', showCancelButton: true
    }).then(async res => {
      if (res.isConfirmed) {
        loaderHtml(true)
        const arr = list.filter((itm: any) => itm.id != id)
        if (user) {
          deleteApi(PAGE_TABLE, id).then(res => {
            if (res.success) {
              setList(arr)
            }
          }).finally(() => {
            loaderHtml(false)
          })
        } else {
          await indexedDBStorage.setItem(PAGE_TABLE, arr)
          setList(arr)
          loaderHtml(false)
        }
      }
    })
  }

  const getData = async () => {
    const conditions: FirestoreConditions[] = [
      { field: 'addedBy', operator: '==', value: user?.id },
    ]

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(`${filters.startDate} 00:00`);
      const endDate = new Date(`${filters.endDate} 23:59`);
      conditions.push({ field: 'date', operator: '>=', value: startDate })
      conditions.push({ field: 'date', operator: '<=', value: endDate })
    }

    let data = []

    if (user) {
      loaderHtml(true)
      const res = await getList(PAGE_TABLE, conditions)
      if (res.data) {
        data = res.data.map((itm: any) => ({
          ...itm,
          createdAt: itm.createdAt || itm.date,
          status: itm.status || 'Pending'
        }))
      }
      loaderHtml(false)
    } else {
      const datad = await indexedDBStorage.getItem(PAGE_TABLE)
      data = datad || []
    }
    setList(data)
  }
  const getCategories = async () => {
    let data = []
    let data1 = []
    if (user) {
      const res = await getCategory(EXPENSE_CATEGORY_TABLE, [{ field: 'addedBy', operator: '==', value: user?.id },])
      const res1 = await getCategory(contri_table, [{ field: 'addedBy', operator: '==', value: user?.id },])

      if (res.data) {
        data = res.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) })).sort((a: any, b: any) => {
          if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1; // a comes before b
          if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;  // a comes after b
          return 0;
        })
      }

      if (res1.data) {
        data1 = res1.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) })).sort((a: any, b: any) => {
          if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1; // a comes before b
          if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;  // a comes after b
          return 0;
        })
      }
    }
    else {
      const datad = await indexedDBStorage.getItem(contri_table)
      data = datad || []
    }

    setCategories([...data, ...data1])
  }


  useEffect(() => {
    getData()
  }, [filters.startDate, filters.endDate])

  useEffect(() => {
   getCategories()
  }, [])

  const filter = (p = {}) => {
    setFilters(prev => ({ ...prev, ...p }))
  }

  const isReset = useMemo(() => {
    let value = false
    const keys = [
      'search',
      'status',
      'type',
    ]
    const f: any = filters
    if (keys.find(key => f[key] ? true : false)) value = true
    if (f.category?.length) value = true
    return value
  }, [filters])

  const reset = () => {
    const f = {
      status: '',
      search: '',
      type: '',
      category: [],
    }
    filter(f)
  }

  const data = useMemo(() => {
    const key = filters.sortBy?.split(' ')[0] || 'createdAt';
    return list
      .map(item => {
        return {
          ...item,
          date: fireDateParse(item.date),
          categoryDetail: categories.find(itm => itm.id == item.category),
        }
      })
      ?.filter((item: any) => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.type && item.type !== filters.type) return false;
        if (filters.category.length && !filters.category.some(id => item.category == id)) return false;

        if (filters.search) {
          const searchValue = filters.search.toLowerCase().trim();
          const title = item.name?.toLowerCase() || '';
          const price = String(item.price || '');
          if (!title.includes(searchValue) && !price.includes(searchValue))
            return false;
        }

        return true;
      })
      ?.sort((a: any, b: any) => {
        const aVal = a?.[key];
        const bVal = b?.[key];
        if (key === 'createdAt' ||key==='date'|| key === 'updatedAt') {
          return new Date(bVal).getTime() - new Date(aVal).getTime();
        }
        if (key === 'price') {
          return bVal - aVal
        }
        return String(aVal || '').localeCompare(String(bVal || ''));
      });
  }, [list, filters, categories]);

  const totalGive = useMemo(() => {
    const t = data?.filter(itm => itm.type == 'Give').map((itm: any) => Number(itm.price || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const totalGot = useMemo(() => {
    const t = data?.filter(itm => itm.type == 'Got').map((itm: any) => Number(itm.price || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const totalBalance = totalGot - totalGive

  const sortByList = [
    {
      name: 'Latest First',
      id: 'date desc'
    },
    {
      name: 'Name - A-Z',
      id: 'name desc'
    },
    {
      name: 'price - A-Z',
      id: 'price desc'
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
          ...e.value
        }

        if (!user) {
          await indexedDBStorage.setItem(PAGE_TABLE, arr)
        }

        setList([...arr])
      } else {
        const arr: any[] = [...list]
        arr.push(e.value)
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
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{PAGE_NAME}</h1>
            <p className="text-gray-600 mt-2">Manage your {ADD_PAGE_NAME} efficiently</p>
          </div>

          <button type="button"
            onClick={() => add()}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center ml-auto">
            <span className="material-symbols-outlined mr-2 text-sm">add</span>
            Add {ADD_PAGE_NAME}
          </button>
          {/* <button onClick={() => exportFuc()} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg flex items-center transition-colors">
            <span className="material-symbols-outlined mr-2">download</span>
            Export
          </button> */}
        </div>

      </header>

      <div className="mb-3">
        <ExpenseTabs />
      </div>



      <div className="lg:col-span-2">
        <div className="flex flex-wrap gap-4 text-blue-500">
          <span>Total Give: <span className="font-bold">{pipeModel.currency(totalGive)}</span></span>
          <span>Total Got:  <span className="font-bold">{pipeModel.currency(totalGot)}</span></span>
          <span>Total Balance:  <span className={`font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>{pipeModel.currency(totalGot - totalGive)}</span></span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="search-filter" className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex flex-wrap gap-4 items-center">
              <DebouncedInput
                value={filters.search}
                onChange={e => filter({ search: e })}
                type="text" placeholder="Search..." className="px-3 py-2 border border-gray-300 rounded-md" />
              <div>
                <MkDateRangePicker
                  value={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    range: filters.range
                  }}
                  onChange={e => {
                    filter({
                      startDate: e.startDate,
                      endDate: e.endDate,
                      range: e.range
                    })
                  }}
                />
                <div className="text-right">
                  {filters.startDate ? <>
                    <span className="text-blue-500 cursor-pointer text-[13px]"
                      onClick={() => filter({ startDate: '', endDate: '', range: '' })}
                    >Clear</span>
                  </> : <></>}
                </div>
              </div>
              <div className="min-w-[200px]">
                <OptionDropdown
                  value={filters.category}
                  onChange={e => filter({ category: e })}
                  options={categories}
                  isLoading={categoryLoading}
                  multiselect
                  placeholder="Category"
                />
              </div>
              <div className="min-w-[150px]">
                <OptionDropdown
                  value={filters.status}
                  onChange={e => filter({ status: e })}
                  isSearch={false}
                  showUnselect={false}
                  placeholder="Status"
                  options={EXPENSE_STATUS_LIST}
                />
              </div>
              <div className="min-w-[150px]">
                <OptionDropdown
                  value={filters.type}
                  onChange={e => filter({ type: e })}
                  isSearch={false}
                  showUnselect={false}
                  placeholder="Type"
                  options={EXPENSE_TYPE_LIST}
                />
              </div>
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
            {data.map((item: any) => {
              return <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200" key={item.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium text-gray-800 mr-2">{item.name}</h3>
                      <span
                        style={{
                          color: EXPENSE_STATUS_LIST.find(itm => itm.id == item.status)?.color,
                          backgroundColor: EXPENSE_STATUS_LIST.find(itm => itm.id == item.status)?.bgcolor
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium text-[${EXPENSE_STATUS_LIST.find(itm => itm.id == item.status)?.color}] bg-[${EXPENSE_STATUS_LIST.find(itm => itm.id == item.status)?.bgcolor}]`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="material-symbols-outlined align-text-bottom text-sm mr-1">person</span>
                      Type: <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.type == 'Got' ? 'text-green-500 bg-green-200' : 'text-red-500 bg-red-200'}`}
                      >{item?.type}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="material-symbols-outlined align-text-bottom text-sm mr-1">folder</span>
                      Category: {item?.categoryDetail?.name || '--'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 mb-1">{pipeModel.currency(item.price)}</div>
                    <div className="text-sm text-gray-500">{datepipeModel.datetime(item.date)}</div>
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

    {addeditModal ? <Modal
      title={`${addeditModal?.id ? 'Edit' : 'Add'} ${ADD_PAGE_NAME}`}
      body={<>
        <AddEdit
          detail={addeditModal}
          action={formAction}
          categories={categories}
        />
      </>}
      result={() => setAddeditModal(null)}
    /> : <></>}
  </>;
}