import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import { ADD_PAGE_NAME } from "../shared";
import AddEdit from "../AddEdit";
export const metadata: Metadata = {
  title: `${APP_NAME} - Add ${ADD_PAGE_NAME}`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
   <AddEdit/>
   </>
  );
}
