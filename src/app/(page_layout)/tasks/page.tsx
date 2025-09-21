import { Metadata } from "next";
import { APP_DESCRIPTION } from "@/utils/shared";
import Content from "./Content";

export const metadata: Metadata = {
  title: `Mk Taskly`,
  description: APP_DESCRIPTION,
};

export default function Page() {
  return (
   <>
  <Content />
   </>
  );
}
