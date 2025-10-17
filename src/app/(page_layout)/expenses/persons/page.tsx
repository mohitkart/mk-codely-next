import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Content from "./Content";
import { PAGE_NAME } from "./shared";

export const metadata: Metadata = {
  title: `${APP_NAME} - ${PAGE_NAME}`,
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
