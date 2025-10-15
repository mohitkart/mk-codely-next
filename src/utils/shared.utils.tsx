import { useState } from "react"

export const statusList = [
  { id: 'active', name: 'Active' },
  { id: 'deactive', name: 'Inactive' },
]

export const TruncateHtml = (str: string = '', length = 150, longStr: any = '') => {
  const [read, setRead] = useState(false)
  if (!str) str = longStr

  return <>
    {read ? <span dangerouslySetInnerHTML={{ __html: longStr || str }}></span> : <>
      <span dangerouslySetInnerHTML={{ __html: str?.slice(0, length) }}></span>
      {str.length > length ? '...' : ''} {str.length > length ? <span className="cursor-pointer text-blue-500" onClick={() => setRead(!read)}>read more</span> : <></>}</>}
  </>
}