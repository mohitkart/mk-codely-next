'use client'
import CodeEditor from "@/components/CodeEditor"
import datepipeModel from "@/utils/datepipemodel"
import FireApi from "@/utils/firebaseApi.utils"
import { copyClipboard } from "@/utils/shared"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const table = 'html'
export default function Detail() {
  const { slug } = useParams()
  const { get: getDetail, isLoading: detailLoading } = FireApi()
  const { get: getCategory, isLoading: catLoading } = FireApi()
  const [loaderData, setLoaderData] = useState<any>()
  const [category, setCategory] = useState<any>()
  const [code, setCode] = useState<any>([])

  const gtCatDetail = async () => {
    const res = await getCategory('categories', [], loaderData.category)
    setCategory(res.data)
  }


  useEffect(() => {
    getDetail(table, [], slug).then(res => {
      if (res.success) {
        setLoaderData(res.data)
      }
    })
  }, [])

  useEffect(() => {
    if (loaderData) {
      gtCatDetail()
      const arr = [
        {
          name: 'app.html',
          code: loaderData.html
        },
        {
          name: 'app.css',
          code: loaderData.css
        },
        {
          name: 'app.scss',
          code: loaderData.scss
        },
        {
          name: 'app.js',
          code: loaderData.js
        }
      ].filter(itm => itm.code)
      setCode(arr)
    }
  }, [loaderData])

  const copy = (text: any) => {
    toast.success("Code Copied")
    copyClipboard(text)
  }

  return <>
  {detailLoading?<>
   <main className="container mx-auto px-4 py-8 max-w-4xl">
  <div className="shine h-[20px] mb-2"></div>
      <div className="shine h-[30px] mb-2"></div>
      <div className="shine h-[250px] rounded mb-2"></div>
      <div className="shine h-[30px] rounded mb-2"></div>
      <div className="shine h-[250px] rounded mb-2"></div>
   </main>
  </>:<>
   <main className="container mx-auto px-4 py-8 max-w-4xl">
      {loaderData ? <>
        <div className="breadcrumb text-sm mb-6">
          <Link href="/html" className="hover:text-indigo-600">Html</Link> / <span className="text-gray-800">{loaderData?.title}</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{loaderData?.title}</h1>
            {catLoading ? <>
              <span className="px-3 py-1 h-[30px] w-[100px] shine rounded-full"></span>
            </> : <>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">{category?.name}</span>
            </>}
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <i className="fab fa-react text-indigo-400 mr-2"></i>
            <span>{datepipeModel.datetime(loaderData?.createdAt)}</span>
          </div>

          <p className="text-gray-700 text-lg mb-6" dangerouslySetInnerHTML={{ __html: loaderData?.short_description }}></p>

          <div className="flex flex-wrap gap-3">
            {loaderData?.tags?.map((tag: any, i: any) => {
              return <div key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}</div>
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
          </div>
          <div>
            <iframe
              src={`/html-preview/${loaderData?.id}`}
              title="Docs"
              className="h-[400px] w-full border border-gray-400 rounded-lg shadow-lg mb-3"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Implementation</h2>
          </div>

          {code.map((item: any, i: any) => {
            return <div className="mb-3" key={i}>
              <div className="code-container">
                <div className="code-header flex gap-2 justify-between p-2 bg-gray-200">
                  <div className="flex items-center space-x-2">
                    <i className="fab fa-js-square text-yellow-400"></i>
                    <span>{item.name}{item.ext}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => copy(item.code)} className="cursor-pointer flex items-center text-sm text-indigo-300 hover:text-white">
                      <span className="material-symbols-outlined">content_copy</span> Copy
                    </button>
                  </div>
                </div>
                <div className="code-content">
                  <CodeEditor
                    value={item.code}
                    disabled
                  />
                </div>
              </div>
            </div>
          })}
        </div>
        <p className="text-gray-700 text-lg mt-6" dangerouslySetInnerHTML={{ __html: loaderData.description }}></p>
      </> : <>
        <h1 className="font-bold text-[20px] text-center">Not Data Found</h1>
      </>}
    </main>
  </>}
  </>;
}
