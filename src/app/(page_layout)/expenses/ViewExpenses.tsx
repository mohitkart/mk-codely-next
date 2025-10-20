'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { EXPENSE_STATUS_LIST } from "./shared";
import pipeModel from "@/utils/pipeModel";
import datepipeModel from "@/utils/datepipemodel";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DebouncedInput from "@/components/DebouncedInput";

type ModalType = {
  data: { list: any[], s: string, r: string }
  persons:any[]
}

export default function ViewExpenses({ data,persons }: ModalType) {
  const user: any = useSelector((state: RootState) => state.user.data);
  const [filters,setFilter]=useState({search:''})

  const filter=(p={})=>{
    setFilter(prev=>({...prev,...p}))
  }

  const totalShare = useMemo(() => {
    const t = data?.list?.filter(itm => itm.paidBy == data.s && itm.persons?.includes(data.r)).map((itm: any) => Number(itm.price || 0) / Number(itm.persons?.length || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const totalReceive = useMemo(() => {
    const t = data?.list?.filter(itm => itm.paidBy == data.r && itm.persons?.includes(data.s)).map((itm: any) => Number(itm.price || 0) / Number(itm.persons?.length || 0)).reduce((p, c) => c + p, 0)
    return t
  }, [data])

  const list = useMemo(() => {
    const search=filters.search.trim().toLowerCase()
    const p = data?.list
    ?.filter(itm => (itm.paidBy == data.s && itm.persons?.includes(data.r)) || (itm.paidBy == data.r && itm.persons?.includes(data.s)))
    return p.filter(item=>{
      if(search){
        if(item.name?.toLowerCase()?.includes(search)) return true
        return false
      }
        return true
    })
  }, [data,filters.search])

 const copyCalculation = () => {
        let text = ''
        const datelist = Array.from(
            new Set(list.map((item) => datepipeModel.datetostring(item.date)))
        ).sort((a:any, b:any) => new Date(a).getTime() - new Date(b).getTime())

        datelist.map(date => {
                const listdate=list.filter(itm => itm.status != 'Hold'&&itm.status != 'Done'&& datepipeModel.datetostring(itm.date) == date) 
                text+=`Date : ${datepipeModel.date(date)}:-\n`

                persons.map(person=>{
                    const list=listdate.filter(item=>item.paidBy==person.id)
                    if (list.length) {
                        text += `Paid By ${person.name}:-\n`
                        list.map(item => {
                            text += `${item.name} (${pipeModel.currency(item.price)})\n`
                            const contributors= item.personsDetail.map((itm:any)=>itm.name).sort().join(', ')
                            const contri=item.price/item.personsDetail.length
                           text +=`Contributors : ${contributors}\n`
                            text +=`Contri : ${pipeModel.currency(contri)}\n\n`
                        })
                        text += `\n`
                    }
                })
                 text += `------------\n\n`

        })

        navigator.clipboard.writeText(text);
        toast.success("Copied")
    }
  return <>
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-[14px] mb-2">
          Total Share : {pipeModel.currency(totalShare)} <br />
          Total Receive : {pipeModel.currency(totalReceive)} <br />
          Balance : {pipeModel.currency(totalShare - totalReceive)} <br />
        </div>
        <div>
          <button onClick={() => copyCalculation()} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg flex items-center transition-colors">
            <span className="material-symbols-outlined mr-2">content_copy</span>
            Copy
          </button>
        </div>
      </div>
      <div>
         <div className="relative">
                  <DebouncedInput type="text" placeholder="Search payments..."
                  value={filters.search}
                  onChange={e=>filter({search:e})}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
                  <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400">search</span>
                </div>
      </div>
      
    </div>
    <div className="max-h-[calc(100vh-250px)] overflow-auto flex flex-wrap gap-3">
      {list?.map((item, i) => {
        return <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200 w-full" key={item.id}>
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
        </div>
      })}
    </div>

  </>;
}