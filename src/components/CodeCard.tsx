import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import packageModel from '@/utils/package';
import CodeEditor from './CodeEditor';
import { getFire } from '@/utils/firebase.utils';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { copyClipboard } from '@/utils/shared';

const CodeCard = ({ data }: { data: any }) => {
  const cuser = useSelector((state: RootState) => state.user.data);
  const [user, setUser] = useState<any>(cuser)
  const query = useSearchParams()
  const qToken = query.get('accessToken')
  const token = query.get('token')

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (qToken) {
      const token = qToken.replaceAll(' ', '+')
      async () => {
        const res = await getFire({
          table: 'users', conditions: [{
            field: 'accessToken', operator: '==', value: token
          }]
        })
        if (res.data?.length) {
          const data = { ...res.data, lastLogin: new Date().toISOString(), password: '********' }
          setUser(data)
        }
        console.table(res.data)
      }
    }

    if (token) {
      async () => {
        const res = await getFire({
          table: 'tokens', conditions: [{
            field: 'token', operator: '==', value: token
          }]
        })
        if (res.data?.length) {
          const data = { ...res.data, lastLogin: new Date().toISOString(), password: '********' }
          setUser(data)
        }
        console.table(res.data)
      }
    }
  }, [])

  const packageCheck = () => {
    return packageModel.check(data?.package, user)
  }

   const copy = () => {
          toast.success("Code Copied")
          let text=''
          const ext=data?.code[tab]
          if(ext) text=ext.code
          copyClipboard(text)
      }

  return <>
    <div className="bg-white rounded shadow" key={data?.id}>
      <ul className="flex bg-gray-100 border-b border-gray-300">
        {data?.code?.map((itm: any, i: any) => (
          <li key={i} className="mr-1">
            <button
              className={
                tab === i
                  ? 'inline-block px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'inline-block px-4 py-2 text-gray-600 hover:text-blue-600'
              }
              onClick={() => setTab(i)}
              type="button"
            >
              {itm.name + itm.ext}
            </button>
          </li>
        ))}

        {/* Uncomment and style this if needed */}
        
    <li className="ml-auto">
     <button onClick={() => copy()} className="cursor-pointer flex items-center text-sm text-indigo-300 hover:text-white">
                                            <span className="material-symbols-outlined">content_copy</span> Copy
                                        </button>
    </li> 
    
      </ul>

      <div className="p-0">
        {packageCheck() ? (
          <>
            {data?.code?.map((itm: any, i: any) => {
              if (tab == i) return <div key={i} className={tab === i ? 'block' : 'hidden'}>
                <CodeEditor
                  value={itm.code}
                  disabled
                />
              </div>
            })}
          </>
        ) : (
          <div className="py-3 text-center text-gray-700">
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
          </div>
        )}
      </div>
    </div>

  </>
}

export default CodeCard;