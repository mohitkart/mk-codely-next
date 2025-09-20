"use client";

import Header from "@/components/Header";
import { RootState } from "@/redux/store";
import { useRouter, } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const user: any = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) {
    }
  }, []);

  return (
    <>
       <main className="authlayout bg-white">
          {children}
        </main>
    </>
  );
}




