'use client'

import MKTable, { MkTableColumn } from "@/components/MkTable";
import { ADD_PAGE_NAME, PAGE_NAME, PAGE_TABLE, PAGE_URL } from "./shared";
import { useEffect, useMemo, useState } from "react";
import datepipeModel from "@/utils/datepipemodel";
import Link from "next/link";
import FireApi from "@/utils/firebaseApi.utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FirestoreConditions } from "@/utils/firebase.utils";
import { getColor } from "@/components/MkChart";
import OptionDropdown from "@/components/OptionDropdown";
import { statusList } from "@/utils/shared.utils";
import packageModel from "@/utils/package";
import { createBackup } from "@/utils/backup";
import { fire } from "@/components/Swal";
import { loaderHtml } from "@/utils/shared";
import DebouncedInput from "@/components/DebouncedInput";

export default function Content() {
    const user: any = useSelector((state: RootState) => state.user.data);
    const [list, setList] = useState([])
    const [categories, setCategories] = useState<any[]>([])
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'createdAt desc',
        status: '',
        category: '',
        package: '',
    })
    const { get: getList, isLoading: isListLoading } = FireApi()
    const { get: getCategory, isLoading: categoryLoading } = FireApi()
    const { deleteApi, isLoading: isActionLoading } = FireApi()


    const remove=(id:any)=>{
        fire({
            icon:'warning',
            title:'Do you want to delete this?',cancelButtonText:'No',confirmButtonText:'Yes',showCancelButton:true}).then(res=>{
            if(res.isConfirmed){
                loaderHtml(true)
                deleteApi(PAGE_TABLE,id).then(res=>{
                    if(res.success){
                        const arr=list.filter((itm:any)=>itm.id!=id)
                        setList(arr)
                    }
                }).finally(()=>{
                    loaderHtml(false)
                })
            }
        })
    }

    const columns: MkTableColumn[] = [
        {
            key: 'title', name: 'Title', sort: true,
            render: (row) => {
                return <span className="capitalize">{row?.title}</span>
            }
        },

        {
            key: 'category', name: 'Category',
            render: (row) => {
                return <>{categories.find(itm => itm.id == row?.category)?.name || '--'}</>
            }
        },
        {
            key: 'package', name: 'package',
            render: (row) => {
                return <span className='capitalize'>{row.package}</span>
            }
        },
        {
            key: 'createdAt', name: 'Created At', sort: true,
            render: (row) => {
                return <>
                    {datepipeModel.datetime(row?.createdAt || row.date)}
                </>
            }
        },
        {
            key: 'updatedAt', name: 'Updated At', sort: true,
            render: (row) => {
                return <>
                    {datepipeModel.datetime(row?.updatedAt)}
                </>
            }
        },
        {
            key: 'status', name: 'Status',
            render: (itm) => {
                return <>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${itm.status == 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {itm.status == 'active' ? 'Active' : 'Inactive'}
                    </span>
                </>
            }
        },
        {
            key: 'action', name: 'Action',
            render: (itm) => {
                return <>
                    <div className="flex space-x-2">
                        <Link href={`html/${itm.id}`} target="_blank" className="action-btn" title="View">
                            <span className="material-symbols-outlined">visibility</span>
                        </Link>
                       <Link href={`${PAGE_URL}/edit/${itm.id}`} className="action-btn" title="View">
                            <span className="material-symbols-outlined">edit</span>
                        </Link>
                        <button className="action-btn" title="Delete"
                        onClick={()=>remove(itm.id)}
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </>
            }
        },
    ]

    const getData = async () => {
        const conditions: FirestoreConditions[] = [
            // { field: 'addedBy', operator: '==', value: user?.id },
        ]

        const res = await getList(PAGE_TABLE, conditions)
        let data = []
        if (res.data) {
            data = res.data.map((itm: any) => ({
                ...itm,
                createdAt: itm.createdAt || itm.date,
                status: itm.status || 'deactive'
            }))
        }
        setList(data)
    }

    const getCategories = async () => {
        const res = await getCategory('categories', [{ field: 'type', operator: '==', value: 'code' }])
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
        getData()
        getCategories()
    }, [])

    const filter = (p = {}) => {
        setFilters(prev => ({ ...prev, ...p }))
    }

    const isReset = useMemo(() => {
        let value = false
        if (filters.search || filters.status || filters.category || filters.package) value = true
        return value
    }, [filters])

    const reset = () => {
        const f = {
            status: '',
            search: '',
            category: '',
            package: ''
        }
        filter(f)
    }

    const data = useMemo(() => {
        const key = filters.sortBy?.split(' ')[0] || 'createdAt';
        return list
            ?.filter((item: any) => {
                if (filters.category && item.category !== filters.category) return false;
                if (filters.status && item.status !== filters.status) return false;
                if (filters.package && item.package !== filters.package) return false;

                if (filters.search) {
                    const searchValue = filters.search.toLowerCase().trim();
                    const title = item.title?.toLowerCase() || '';
                    const description = item.description?.toLowerCase() || '';
                    if (!title.includes(searchValue) && !description.includes(searchValue))
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
                return String(aVal || '').localeCompare(String(bVal || ''));
            });
    }, [list, filters]);


    const sortByList = [
        {
            name: 'Latest First',
            id: 'createdAt desc'
        },
        {
            name: 'Title - A-Z',
            id: 'title desc'
        },
    ]

    const exportFuc=()=>{
        createBackup({table:PAGE_TABLE,data:list})
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between">

                    <div className="relative flex-grow max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">search</span>
                        <DebouncedInput type="text" placeholder="Search..."
                        value={filters.search}
                        onChange={e=>filter({search:e})}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>


                    <div className="flex gap-3">
                        <Link href={`${PAGE_URL}/add`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center transition-colors">
                            <span className="material-symbols-outlined mr-2">add</span>
                            Add {ADD_PAGE_NAME}
                        </Link>
                        <button onClick={()=>exportFuc()} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg flex items-center transition-colors">
                            <span className="material-symbols-outlined mr-2">download</span>
                            Export
                        </button>
                    </div>
                </div>


                <div className="mt-6 flex gap-4 items-end flex-wrap">

                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <OptionDropdown
                            value={filters.status}
                            options={statusList}
                            isSearch={false}
                            onChange={e => filter({ status: e })}
                        />
                    </div>

                    
                     <div className="min-w-[250px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <OptionDropdown
                            value={filters.category}
                            options={categories}
                            onChange={e => filter({ category: e })}
                        />
                    </div>
                    <div className="min-w-[170px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                        <OptionDropdown
                            value={filters.package}
                            options={packageModel.list}
                            onChange={e => filter({ package: e })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <OptionDropdown
                            value={filters.sortBy}
                            options={sortByList}
                            isSearch={false}
                            onChange={e => filter({ sortBy: e })}
                            showUnselect={false}
                        />
                    </div>
                    <div>
                        {isReset ? <>
                            <button type="button"
                                onClick={() => reset()}
                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-3 rounded-lg flex items-center transition-colors">
                                Reset
                            </button>
                        </> : <></>}

                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <MKTable
                    data={data}
                    columns={columns}
                    total={data.length}
                    isLoading={isListLoading}
                />
            </div>
        </>
    );
}
