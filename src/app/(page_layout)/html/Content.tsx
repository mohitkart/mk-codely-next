'use client'

import { getColor } from "@/components/MkChart"
import datepipeModel from "@/utils/datepipemodel"
import FireApi from "@/utils/firebaseApi.utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Fragment, useEffect, useMemo, useState } from "react"

const BlogCard = ({ item }: { item: any }) => {
  return <div className="bg-white rounded-xl shadow-md overflow-hidden blog-card">
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span>{datepipeModel.datetime(item.createdAt)}</span>
        <span className="mx-2">•</span>
        <span>{item.categoryDetail?.name}</span>
      </div>
      <Link href={`/html/${item.id}`} className="text-xl font-bold mb-3">{item.title}</Link>
      <p className="text-gray-600 mb-4">{item.short_description}</p>
      <Link href={`/html/${item.id}`} className="flex items-center gap-2 text-blue-500 font-medium flex items-center">
        Read more
        <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
      </Link>
    </div>
  </div>
}

export default function Content() {
  const table = 'html'
  const [data, setData] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const { get, isLoading: listLoading } = FireApi()
  const { get: getCategory, isLoading: categoryLoading } = FireApi()
  const query = useSearchParams()

  type FilterType = {
    search?: any,
    category?: any
  }
  const [filters, setFilter] = useState<FilterType>({ category: query.get('category'), search: query.get('search') })
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
      data = res.data.map((itm: any, i: any) => ({ ...itm, color: getColor(i) }))
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
      if (filters.search) {
        const v = filters.search?.toLowerCase()
        if (!(item.title?.toLowerCase()?.includes(v)
          || item.description?.toLowerCase()?.includes(v)
          || item.short_description?.toLowerCase()?.includes(v)
        )) value = false
      }
      return value
    }).map((itm: any) => {
      return {
        ...itm,
        categoryDetail: categories.find((cat: any) => cat.id == itm.category)
      }
    }).sort((a: any, b: any) => {
      return b.createdAt - a.createdAt
    })
  }, [data, filters])

  const featuredPost = useMemo(() => {
    return list.filter((itm: any) => itm.featured)
  }, [list])

  return <>
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Content</h1>
          <p className="text-xl mb-8">Explore our collection of articles on technology, design and more.</p>
          <div className="relative">
            <input type="text"
              value={filters.search?.trim() || ''}
              onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search articles..." className="w-full py-3 px-4 rounded-lg text-[#000] focus:outline-none bg-white" />
            <button className="cursor-pointer absolute right-2 top-2 bg-blue-500 flex items-center justify-center text-white p-2 rounded-lg">
              <span className="material-symbols-outlined !text-[17px]">search</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    {featuredPost.length ? <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPost.map((item: any, i: any) => {
              return <Fragment key={i}>
                <BlogCard item={item} />
              </Fragment>
            })}
          </div>
        </div>
      </section>
    </> : <></>}


    <section className="py-12 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Latest Articles</h2>
          <div className="flex flex-wrap gap-2">
            {categoryLoading ? <>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
              <button className={`cursor-pointer shine h-[45px] w-[100px] px-4 py-2 rounded-lg`}></button>
            </> : <>
              <button onClick={() => setFilter(prev => ({ ...prev, category: '' }))} className={`cursor-pointer px-4 py-2 rounded-full shadow-sm text-sm ${!filters.category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
              {categories.map((item: any, i: any) => {
                return <button key={item.id}
                  style={{
                    backgroundColor: item.id == filters.category ? item.color : null
                  }}
                  onClick={() => setFilter(prev => ({ ...prev, category: item.id }))} className={`cursor-pointer px-4 py-2 rounded-full shadow-sm text-sm ${item.id == filters.category ? `bg-${item.color ? `[${item.color}]` : 'blue-600'} text-white` : `bg-white text-${item.color ? `[${item.color}]` : 'blue-600'}`}`}>{item.name}</button>
              })}
            </>}

          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listLoading ? <>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
            <div className="bg-white rounded-xl shadow-md shine h-[300px]"></div>
          </> : <>
            {list.map((item: any, i: any) => {
              return <Fragment key={i}>
                <BlogCard item={item} />
              </Fragment>
            })}
          </>}
        </div>

        {/* <div className="flex justify-center mt-12">
          <button className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
            Load More Articles
          </button>
        </div> */}
      </div>
    </section>

    <section className="py-16 bg-gradient-to-r from-primary to-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="max-w-2xl mx-auto mb-8">Stay updated with the latest articles, news, and insights. No spam, just valuable content.</p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input type="email" placeholder="Your email address" className="bg-white flex-grow px-4 py-3 rounded-lg text-[#000] focus:outline-none" />
          <button className="cursor-pointer bg-green-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-600">Subscribe</button>
        </div>
      </div>
    </section>
  </>;
}