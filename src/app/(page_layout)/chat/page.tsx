

import { Metadata } from "next";
import Content from "./Content";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import envirnment from "@/envirnment";

export const metadata: Metadata = {
  title: `${APP_NAME} - Chat`,
  description: APP_DESCRIPTION,
};

export const revalidate = 60 // seconds

export default async function ChatPage() {
  const res = await fetch(`${envirnment.frontUrl}api/messages`, {
    next: { revalidate: 60 },
  })
  const posts = await res.json()

  const conversationsres = await fetch(`${envirnment.frontUrl}api/messages/conversation`, {
    next: { revalidate: 60 },
  })
  const conversations=await conversationsres.json()

  return (
    <Content
    posts={posts}
    conversations={conversations}
    />
  );
}