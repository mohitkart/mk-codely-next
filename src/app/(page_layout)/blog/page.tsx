import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Blogs from "./Blogs";

export const metadata: Metadata = {
  title: `${APP_NAME} - Blogs`,
  description: APP_DESCRIPTION,
};

export default function BlogPage() {
  return (
   <>
  <Blogs 
  />
   </>
  );
}
