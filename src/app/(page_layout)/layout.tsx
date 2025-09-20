"use client";

import Header from "@/components/Header";
import { RootState } from "@/redux/store";
import ApiClientB from "@/utils/Apiclient";
import { useRouter, } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const user: any = useSelector((state: RootState) => state.user.data);

  const { get, post, put } = ApiClientB()


  const dispatch = useDispatch();

  const getUserDetail = () => {
    // get("user/profile", { id: (user._id || user.id) }).then(async (res) => {
    //   if (res.success) {
    //     const data = { ...user, ...res.data };
    //     dispatch(login(data));
    //   }
    // });
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) {
    } else {
      getUserDetail()
    }
  }, []);



  return (
    <>
      <Header user={user}/>
      <main className="pageContent bg-white">
        {children}
      </main>
    </>
  );
}




