'use client'
import FireApi from "@/utils/firebaseApi.utils"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Content from "../Content";
import { fireDateParse } from "@/utils/firebase.utils";

const table = 'tasks'
export default function Detail() {
  const { slug } = useParams()
  const { get: getDetail, isLoading: detailLoading } = FireApi()
  const [loaderData, setLoaderData] = useState<any>()

  useEffect(() => {
    if (slug) {
      console.log("slug",slug)
      getDetail(table, [], slug).then(res => {
        if (res.success) {
          const data=res.data;
          data.date=fireDateParse(data.date)
          setLoaderData(data)
        }
      })
    }
  }, [])

  return <>
    {detailLoading ? <>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="shine h-[20px] mb-2"></div>
        <div className="shine h-[30px] mb-2"></div>
        <div className="shine h-[250px] rounded mb-2"></div>
        <div className="shine h-[30px] rounded mb-2"></div>
        <div className="shine h-[250px] rounded mb-2"></div>
      </main>
    </> : <>
      {loaderData ? <>
        <Content loaderData={loaderData} />
      </> : <></>}
    </>}
  </>;
}
