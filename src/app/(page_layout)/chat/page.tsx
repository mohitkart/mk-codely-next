

import { Metadata } from "next";
import Content from "./Content";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import envirnment from "@/envirnment";

export const metadata: Metadata = {
  title: `${APP_NAME} - Chat`,
  description: APP_DESCRIPTION,
};

export const revalidate = 60 // seconds

const parseJson=(str:string)=>{
 try{
    const value=JSON.parse(str)
    return value
  }catch(err){
    console.log("err",err)
    return null
  }
}

export default async function ChatPage() {
  const res = await fetch(`${envirnment.frontUrl}api/messages`, {
    next: { revalidate: 30 },
  })
  const poststext = await res.text()
  const posts:any[]=parseJson(poststext)||[]
  const conversationsres = await fetch(`${envirnment.frontUrl}api/messages/conversation`, {
    next: { revalidate: 30 },
  })
  const conversationstext=await conversationsres.text()
  const conversations:any[]=parseJson(conversationstext)||[]

  return (
    <Content
    posts={posts}
    conversations={conversations}
    />
  );
}