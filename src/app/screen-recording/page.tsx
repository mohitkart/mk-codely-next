import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Content from "./Content";

export const metadata: Metadata = {
  title: `${APP_NAME} - Screen Recording`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
  <Content/>
   </>
  );
}
