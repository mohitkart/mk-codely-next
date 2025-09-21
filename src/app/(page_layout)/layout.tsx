"use client";
import Header from "@/components/Header";
import { login, logout } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { useRouter, } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const table = 'users'
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const user: any = useSelector((state: RootState) => state.user.data);

  const { get } = FireApi()
  const dispatch = useDispatch();

  const getUserDetail = () => {
    get(table, [{ field: 'accessToken', operator: '==', value: user.accessToken }]).then(async (res) => {
      if (res.success) {
        const rdata = res.data?.[0]
        if (rdata) {
          const data = { ...user, ...rdata };
          dispatch(login(data));
        } else {
          router.push('/')
          dispatch(logout());
        }

      }
    });
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
      <Header user={user} />
      <main className="pageContent bg-white">
        {children}
      </main>
    </>
  );
}




