
import { Metadata } from "next";
import Content from "./Content";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";

export const metadata: Metadata = {
  title: `${APP_NAME} - Chat`,
  description: APP_DESCRIPTION,
};

export default function ChatPage() {

  return (
    <Content/>
  );
}
