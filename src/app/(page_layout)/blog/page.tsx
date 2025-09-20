import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";

export const metadata: Metadata = {
  title: `${APP_NAME} - Blogs`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
  blogs
   </>
  );
}
