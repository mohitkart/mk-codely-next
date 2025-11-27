
import envirnment from "@/envirnment";
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

export const getShortCode = (str = '', type = 'code') => {
    // Define the regex pattern using regex literal
    let pattern = /\[\s*code\s*=\s*'([a-zA-Z0-9]+)'\s*\]/g;
    if (type == 'html') pattern = /\[\s*html\s*=\s*'([a-zA-Z0-9]+)'\s*\]/g;

    if(!str) return ''

    const value = str.matchAll(pattern)
    for (const match of value) {
      const fullMatch=match[0]; // Full matched string
      const captured=match[1]; // Captured group
      let rStr=`<iframe src="${envirnment.frontUrl}codeview/${captured}" width="100%" height="300" class="shortcode_code"></iframe>`
      if(type=='html') rStr=`<iframe src="${envirnment.frontUrl}study/${captured}" width="100%" height="300" class="shortcode_html"></iframe>`
      str = str.replaceAll(fullMatch,rStr)
    }

    return str
  }