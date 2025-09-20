import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import HomeComponent from "./HomeComponent";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
   <HomeComponent/>
   </>
  );
}
