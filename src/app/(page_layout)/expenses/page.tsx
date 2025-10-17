import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Content from "./Content";

export const metadata: Metadata = {
  title: `${APP_NAME} - Expenses`,
  description: APP_DESCRIPTION,
};

export default function BlogPage() {
  return (
   <>
  <Content 
  />
   </>
  );
}
