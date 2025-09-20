'use client'
import envirnment from "@/envirnment";
import Link from "next/link";
import { toast } from "react-toastify";
import RecordingDetail from "../RecordingDetail";
import { useEffect, useState } from "react";
import FireApi from "@/utils/firebaseApi.utils";
import { useParams } from "next/navigation";
import datepipeModel from "@/utils/datepipemodel";
const table = 'recording'
export default function RecordingDetailPage() {
  const [loaderData, setLoaderData] = useState<any>()
  const { slug } = useParams()
  const { get: getDetail, isLoading: detailLoading } = FireApi()
  const copyItem = (item: any) => {
    const url = `${envirnment.frontUrl}screen-recording/${item.file || item.name}`
    navigator.clipboard.writeText(url);
    toast.success("Url Copied")
  }

  const format = loaderData?.file?.split('.')?.[1]

  useEffect(() => {
    if (slug) {
      getDetail(table, [{field:'file',operator:'==',value:slug}]).then(res => {
        if (res.success) {
          const data=res.data?.[0]
          setLoaderData(data)
        }
      })
    }
  }, [slug])

  return <>
    <div className="max-w-6xl mx-auto">
      {detailLoading ? <>
      <div className="shine h-[30px] mb-3"></div>
      <div className="shine h-[300px] mb-3"></div>
      <div className="shine h-[20px] mb-3"></div>
      <div className="shine h-[20px] mb-3"></div>
      </> : <>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Recording Details</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
              <span className="material-symbols-outlined text-primary mr-2">home</span>
              <span className="text-gray-700 font-medium">Home</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">

            <RecordingDetail loaderData={loaderData} />

            {/* <div className="bg-white rounded-xl shadow-lg mt-6 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
              </div>
              <div className="p-5 max-h-60 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-sm text-gray-500 mr-4">00:45</span>
                    <p className="text-gray-700">Okay, let's start by looking at the new dashboard layout.</p>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-500 mr-4">01:20</span>
                    <p className="text-gray-700">As you can see, we've added the analytics section on the left.</p>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-500 mr-4">02:15</span>
                    <p className="text-gray-700">The user management tools are now more accessible from the main navigation.</p>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-500 mr-4">03:30</span>
                    <p className="text-gray-700">Let me show you how to generate a report using the new interface.</p>
                  </div>
                  <div className="flex">
                    <span className="text-sm text-gray-500 mr-4">04:50</span>
                    <p className="text-gray-700">First, select the date range you're interested in analyzing.</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>


          <div className="space-y-6">

            <div className="bg-white rounded-xl shadow-lg overflow-hidden detail-card">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recording Details</h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="text-gray-800">{format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Modified</p>
                    <p className="text-gray-800">{datepipeModel.datetime((loaderData?.updatedAt || loaderData?.createdAt))}</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-lg overflow-hidden detail-card">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Share Recording</h3>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                  <div className="flex">
                    <input type="text" readOnly value={`${envirnment.frontUrl}screen-recording/${loaderData?.file || loaderData?.name}`} className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm" />
                    <button
                      onClick={() => copyItem(loaderData)}
                      className="bg-blue-500 hover:bg-indigo-600 text-white px-4 rounded-r-lg">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>

                {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Settings</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Anyone with the link</option>
                  <option>Only people with access</option>
                  <option>Only me</option>
                </select>
              </div>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">add</span>
                Add People
              </button> */}
              </div>
            </div>


            {/* <div className="bg-white rounded-xl shadow-lg overflow-hidden detail-card">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                <button className="w-full flex items-center text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-gray-50">
                  <span className="material-symbols-outlined mr-3">drive_file_rename_outline</span>
                  Rename Recording
                </button>
                <button className="w-full flex items-center text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-gray-50">
                  <span className="material-symbols-outlined mr-3">folder</span>
                  Move to Folder
                </button>
                <button className="w-full flex items-center text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-gray-50">
                  <span className="material-symbols-outlined mr-3">tag</span>
                  Add Tags
                </button>
                <button className="w-full flex items-center text-gray-700 hover:text-primary p-3 rounded-lg hover:bg-gray-50">
                  <span className="material-symbols-outlined mr-3">description</span>
                  Export Details
                </button>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </>}
    </div>
  </>;
}
