'use client'

import { fire } from "@/components/Swal";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { loaderHtml } from "@/utils/shared";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ADD_PAGE_NAME, EXPENSE_CATEGORY_TABLE, EXPENSE_PERSON_TABLE, EXPENSE_STATUS_LIST, PAGE_NAME, PAGE_TABLE } from "./shared";
import { fireDateParse, FirestoreConditions } from "@/utils/firebase.utils";
import { getColor } from "@/components/MkChart";
import OptionDropdown from "@/components/OptionDropdown";
import datepipeModel from "@/utils/datepipemodel";
import pipeModel from "@/utils/pipeModel";
import DebouncedInput from "@/components/DebouncedInput";
import Modal from "@/components/Modal";
import AddEdit from "./AddEdit";
import { createBackup } from "@/utils/backup";
import Balance from "./Balance";
import ExpenseTabs from "../ExpenseTabs";
import MkDateRangePicker from "@/components/MkDateRangePicker";

export type ExpenseForm = {
  id?: string | null
  name: string
  status: string
  price: any
  date: any
  category: string
  persons?: string[] | null
  paidBy: string
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
  const [persons, setPersons] = useState<PersonType[]>([]);
  const [addeditModal, setAddeditModal] = useState<any>();
  const [balanceModal, setBalanceModal] = useState<any>();
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt desc',
    status: 'Pending',
    paidBy: [],
    persons:[],
    category:[],
    startDate: '',
    endDate: '',
    range:''
  })
  const { get: getList, isLoading: isListLoading } = FireApi()
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const { get: getPersons, isLoading: personsLoading } = FireApi()
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

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(`${filters.startDate} 00:00`);
      const endDate = new Date(`${filters.endDate} 23:59`);
      conditions.push({ field: 'date', operator: '>=', value: startDate })
      conditions.push({ field: 'date', operator: '<=', value: endDate })
    }

    if (filters.status) {
      conditions.push({ field: 'status', operator: '==', value: filters.status })
    }
   
    let data = []

    if (user) {
      loaderHtml(true)
      const res = await getList(PAGE_TABLE, conditions)
      if (res.data) {
        data = res.data.map((itm: any) => ({
          ...itm,
          createdAt: itm.createdAt || itm.date,
          status: itm.status || 'deactive'
        }))
      }
       loaderHtml(false)
    }
    
    setList(data)
  }

  const getCategories = async () => {
    const res = await getCategory(EXPENSE_CATEGORY_TABLE, [{ field: 'addedBy', operator: '==', value: user?.id },])
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

  const getPersonsList = async () => {
    const res = await getPersons(EXPENSE_PERSON_TABLE, [{ field: 'addedBy', operator: '==', value: user?.id },])
    let data = []
    if (res.data) {
      data = res.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) })).sort((a: any, b: any) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1; // a comes before b
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;  // a comes after b
        return 0;
      })
    }
    setPersons(data)
  }

  useEffect(() => {
    getData()
  }, [filters.status,filters.startDate,filters.endDate])

  useEffect(() => {
    if (user) {
      getCategories()
      getPersonsList()
    }
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
    if(f.persons?.length) value=true
    if(f.paidBy?.length) value=true
    if(f.category?.length) value=true
    return value
  }, [filters])

  const reset = () => {
    const f = {
      // status: '',
      paidBy: [],
      search: '',
      category:[],
      persons:[]
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
          paidByDetail: persons.find(itm => itm.id == item.paidBy),
          personsDetail: item.persons?.map(p => persons.find(itm => itm.id == p))
        }
      })
      ?.filter((item: any) => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.paidBy.length && !filters.paidBy.some(personId=>item.paidBy==personId)) return false;
        if (filters.category.length && !filters.category.some(id=>item.category==id)) return false;
        if (filters.persons.length && !filters.persons.some((personId) => item.persons.includes(personId))) return false;
        

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
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(bVal).getTime() - new Date(aVal).getTime();
        }
        if (key === 'price') {
          return bVal - aVal
        }
        return String(aVal || '').localeCompare(String(bVal || ''));
      });
  }, [list, filters, categories]);

   const totalPaid = useMemo(() => {
    const t = data?.map((itm: any) => Number(itm.price || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

    const totalShare = useMemo(() => {
    const t = data?.filter((item:any)=>item.persons?.length>1).map((itm: any) => Number(itm.price || 0) / Number(itm.persons?.length || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const sortByList = [
    {
      name: 'Latest First',
      id: 'createdAt desc'
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

  const formAction = (e: any) => {
    setAddeditModal(null)
    if (e.action == 'submit') {
      if (addeditModal?.id) {
        const arr: any[] = [...list]
        const index = arr.map(itm => itm.id).indexOf(addeditModal?.id)
        arr[index] = {
          ...arr[index],
          ...e.value
        }
        setList([...arr])
      } else {
        const arr: any[] = [...list]
        arr.push(e.value)
        setList([...arr])
      }
    }
  }

  const exportFuc = () => {
    createBackup({ table: PAGE_TABLE, data: list })
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
          <span>Total Paid: <span className="font-bold">{pipeModel.currency(totalPaid)}</span></span>
           <span>Total Share Per Person:  <span className="font-bold">{pipeModel.currency(totalShare)}</span></span>
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
                    startDate:filters.startDate,
                    endDate:filters.endDate,
                    range:filters.range
                  }}
                  onChange={e=>{
                    filter({
                      startDate: e.startDate,
                      endDate: e.endDate,
                      range: e.range
                    })
                  }}
                  />
                  <div className="text-right">
                    {filters.startDate?<>
                      <span className="text-blue-500 cursor-pointer text-[13px]"
                    onClick={()=>filter({startDate:'',endDate:'',range:''})}
                    >Clear</span>
                    </>:<></>}
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
              <div className="min-w-[200px]">
                <OptionDropdown
                  value={filters.paidBy}
                  onChange={e => filter({ paidBy: e })}
                  options={persons}
                  isLoading={personsLoading}
                  multiselect
                  placeholder="Paid By"
                />
              </div>
              <div className="min-w-[200px]">
                <OptionDropdown
                  value={filters.persons}
                  onChange={e => filter({ persons: e })}
                  options={persons}
                  isLoading={personsLoading}
                  multiselect
                  placeholder="Contribution"
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
              <button type="button"
                onClick={() => setBalanceModal(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                Balances
              </button>
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
                      Paid by: <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor: item?.paidByDetail?.color
                        }}
                      >{item?.paidByDetail?.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="material-symbols-outlined align-text-bottom text-sm mr-1">group</span>
                      Shared with: {item.personsDetail?.map((itm: any) => itm?.name)?.sort()?.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="material-symbols-outlined align-text-bottom text-sm mr-1">folder</span>
                      Category: {item?.categoryDetail?.name || '--'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 mb-1">{pipeModel.currency(item.price)}</div>
                    <div className="text-sm text-gray-500">{datepipeModel.datetime(item.date)}</div>
                    <div className="text-lg font-semibold text-gray-400 mb-1">{pipeModel.currency(item.price / item.personsDetail?.length)}</div>
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
          persons={persons}
          categories={categories}
        />
      </>}
      result={() => setAddeditModal(null)}
    /> : <></>}
    {balanceModal ? <Modal
      title={`View Balance`}
      className="max-w-[1200px]"
      body={<>
        <Balance
          data={data}
          persons={persons}
          categories={categories}
        />
      </>}
      result={() => setBalanceModal(null)}
    /> : <></>}
  </>;
}