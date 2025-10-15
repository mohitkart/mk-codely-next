import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import AddEdit from "../../AddEdit";
import { ADD_PAGE_NAME } from "../../shared";
export const metadata: Metadata = {
  title: `${APP_NAME} - Edit ${ADD_PAGE_NAME}`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
   <AddEdit/>
   </>
  );
}
