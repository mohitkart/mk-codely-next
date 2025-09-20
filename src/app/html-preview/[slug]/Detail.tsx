'use client'
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const table = 'html'
export default function Detail() {
    const { get: getDetail, isLoading: detailLoading } = FireApi()
    const [loaderData, setLoaderData] = useState<any>()
    const { slug } = useParams()

    useEffect(() => {
        getDetail(table, [], slug).then(res => {
            if (res.success) {
                setLoaderData(res.data)
            }
        })
    }, [])

    return (
        <>
            {detailLoading ? <>
                <div className="shine h-[300px]"></div>
            </> : <>
                <style>{loaderData && loaderData.css}</style>
                <div dangerouslySetInnerHTML={{ __html: loaderData && loaderData.html }}></div>
                <script>{loaderData && loaderData.js}</script>
            </>}

        </>
    );
}
