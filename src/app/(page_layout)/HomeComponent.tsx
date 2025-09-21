
'use client'

import { getColor } from "@/components/MkChart"
import datepipeModel from "@/utils/datepipemodel"
import FireApi from "@/utils/firebaseApi.utils"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function HomeComponent() {
    const table = 'code'
    const router = useRouter()
    const navigate = (p = '') => {
        router.push(p)
    }
    const [data, setData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])
    const { get, isLoading: listLoading } = FireApi()
    const { get: getCategory, isLoading: categoryLoading } = FireApi()

    type FilterType = {
        search?: any,
        category?: any
    }
    const [filters, setFilter] = useState<FilterType>({})
    const getData = async () => {
        const res = await get(table)
        let data = []
        if (res.data) {
            data = res.data
        }

        setData(data)
    }

    const getCategories = async () => {
        const res = await getCategory('categories', [{ field: 'type', operator: '==', value: 'code' }])
        let data = []
        if (res.data) {
            data = res.data.map((itm: any,i:any) => ({ ...itm, color: getColor(i) }))
        }
        setCategories(data)
    }

    useEffect(() => {
        getData()
        getCategories()
    }, [])

    const list = useMemo(() => {
        return data.filter((item: any) => {
            let value = true
            if (filters.category) {
                if (item.category != filters.category) value = false
            }
            return value
        }).map((itm: any) => {
            return {
                ...itm,
                categoryDetail: categories.find((cat: any) => cat.id == itm.category)
            }
        }).sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }, [data, filters,categories])
    return (
        <>
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
                    {listLoading ? <>
                        <div className="shine h-[100px] w-[130px] rounded-lg shadow-sm"></div>
                    </> : <>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">Total Snippets</h3>
                            <p className="text-3xl font-bold text-blue-600">{data.length}</p>
                        </div>
                    </>}

                    <div className="flex flex-wrap gap-2">
                        {categoryLoading ? <>
                            <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
                            <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
                            <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
                        </> : <>
                            <button onClick={() => setFilter(prev => ({ ...prev, category: '' }))} className={`cursor-pointer active px-4 py-2 rounded-lg ${!filters.category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                            {categories.map((item: any) => {
                                return <button key={item.id}
                                style={{backgroundColor:item.id == filters.category?item.color:null,color:item.id == filters.category?'white':''}}
                                onClick={() => setFilter(prev => ({ ...prev, category: item.id }))} className={`cursor-pointer px-4 py-2 rounded-lg ${item.id == filters.category ? `bg-${item.color ? `[${item.color}]` : 'blue-600'} text-white` : `bg-white text-${item.color ? `[${item.color}]` : 'blue-600'}`}`}>{item.name}</button>
                            })}
                        </>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listLoading ? <>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-shadow`}>
                            <div className="shine h-[200px]"></div>
                        </div>
                    </> : <>
                        {list.map((item: any, i: any) => {
                            const color = item.categoryDetail?.color
                            return <div key={i} style={{borderColor:color}} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-${color ? `[${color}]` : 'blue-600'} hover:shadow-lg transition-shadow`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span style={{backgroundColor:color}} className={`text-white bg-${color ? `[${color}]` : ''} text-xs font-medium px-2.5 py-0.5 rounded`}>{item.categoryDetail?.name}</span>
                                        <span className="text-gray-500 text-sm">{datepipeModel.datetime(item.createdAt)}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: item.short_description }}></p>
                                    <div className="flex justify-between items-center">
                                        <button className="text-blue-600 hover:text-secondary font-medium cursor-pointer" onClick={() => navigate(`/code/${item.id}`)}>View Code</button>
                                        <div className="flex space-x-2">
                                            <button className="text-gray-400 hover:text-blue-500"><i className="far fa-copy"></i></button>
                                            <button className="text-gray-400 hover:text-green-500"><i className="far fa-edit"></i></button>
                                            <button className="text-gray-400 hover:text-red-500"><i className="far fa-trash-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </>}
                </div>
            </main>
        </>
    );
}
