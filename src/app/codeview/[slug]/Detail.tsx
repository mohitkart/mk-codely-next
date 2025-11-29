'use client'
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CodeCard from "@/components/CodeCard";

const table = 'code'
export default function Detail() {
    const user = useSelector((state: RootState) => state.user.data);
    const { get: getDetail, isLoading: detailLoading } = FireApi()
    const [loaderData, setLoaderData] = useState<any>()
    const { slug } = useParams()

    useEffect(() => {
        getDetail(table, [], slug).then(res => {
            if (res.success) {
                const data = res.data
                let code = data?.code
                if (code) {
                    code = typeof code == 'object' ? code : JSON.parse(code)
                }
                data.code = code
                setLoaderData(data)
            }
        })
    }, [])

    return (
        <>
            {detailLoading ? <>
                <div className="shine h-[30px] mb-2"></div>
                <div className="shine h-[250px]"></div>
            </> : <>
                <CodeCard
                data={loaderData}
                />
            </>}
        </>
    );
}
