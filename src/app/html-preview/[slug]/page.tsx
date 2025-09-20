import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import Detail from "./Detail";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};
export default function Home() {
  return (
    <>
    <Detail/>
    </>
  );
}
