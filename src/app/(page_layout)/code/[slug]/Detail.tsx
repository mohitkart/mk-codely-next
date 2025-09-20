'use client'
import { copyClipboard } from "@/utils/shared";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect, useMemo, useState } from "react";
import packageModel from "@/utils/package";
import Link from "next/link";
import datepipeModel from "@/utils/datepipemodel";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { toast } from "react-toastify";

const table = 'code'

export default function Detail() {
  const user = useSelector((state: RootState) => state.user.data);
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
    if (loaderData) {
      gtCatDetail()
      let code = loaderData?.code
      if (code) {
        code = JSON.parse(code)
        setCode(code)
      }
    }
  }, [loaderData])

  useEffect(() => {
    getDetail(table, [], slug).then(res => {
      if (res.success) {
        setLoaderData(res.data)
      }
    })
  }, [])

  const access = useMemo(() => {
    return packageModel.check(loaderData?.package, user)
  }, [user, loaderData])

  const copy = (text: any) => {
    toast.success("Code Copied")
    copyClipboard(text)
  }

  return <>
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {detailLoading ? <>
        <div className="shine h-[20px] mb-6"></div>
        <div className="shine h-[148px] mb-2"></div>
        <div className="shine h-[28px] mb-2"></div>
        <div className="shine h-[10px] mb-2"></div>
        <div className="shine h-[300px] mb-2"></div>
      </> : <>
        {loaderData ? <>
          <div className="breadcrumb text-sm mb-6">
            <Link href="/" className="hover:text-indigo-600">Home</Link> / <span className="text-gray-800">{loaderData?.title}</span>
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
              <h2 className="text-xl font-semibold text-gray-800">Implementation</h2>
              <div className="flex space-x-2">
                {/* <button className="flex items-center cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              <span className="material-symbols-outlined">content_copy</span> Copy code
            </button> */}
              </div>
            </div>

            {access ? <>
              {code.map((item: any, i: any) => {
                return <div className="mb-3" key={i}>
                  <div className="code-container">
                    <div className="flex gap-3 justify-between p-2 bg-gray-500 text-white">
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
            </> : <>
              {user ? (
                <>Premium Package</>
              ) : (
                <>
                  Login to view{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </>
              )}
            </>}

          </div>

          {access ? <>
            <p className="text-gray-700 text-lg mt-6" dangerouslySetInnerHTML={{ __html: loaderData.description }}></p>
          </> : <></>}
        </> : <>
          <h1 className="font-bold text-[20px] text-center">Not Data Found</h1>
        </>}
      </>}

    </main>
  </>;

}
