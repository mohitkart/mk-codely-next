'use client'
import FireApi from "@/utils/firebaseApi.utils";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import packageModel from "@/utils/package";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { copyClipboard } from "@/utils/shared";
import CodeEditor from "@/components/CodeEditor";
import Link from "next/link";
import CodeCard from "@/components/CodeCard";

const table = 'code'
export default function Detail() {
    const user = useSelector((state: RootState) => state.user.data);
    const { get: getDetail, isLoading: detailLoading } = FireApi()
    const [loaderData, setLoaderData] = useState<any>()
    const [code, setCode] = useState<any>([])
    const { slug } = useParams()

    useEffect(() => {
        getDetail(table, [], slug).then(res => {
            if (res.success) {
                const data = res.data
                let code = data?.code
                if (code) {
                    code = typeof code == 'object' ? code : JSON.parse(code)
                    setCode(code)
                }
                data.code = code
                setLoaderData(data)
                console.log(data)
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


    return (
        <>
            {detailLoading ? <>
                <div className="shine h-[30px] mb-2"></div>
                <div className="shine h-[250px]"></div>
            </> : <>
                <CodeCard
                data={loaderData}
                />
                {/* {access ? <>
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
                </>} */}

            </>}


        </>
    );
}
