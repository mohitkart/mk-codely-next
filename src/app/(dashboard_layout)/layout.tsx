"use client";
import { login, logout } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import FireApi from "@/utils/firebaseApi.utils";
import { usePathname, useRouter, } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css"
import { MenuItem } from "@/types/dashboard";
import Sidebar from "./Sidebar";
import Header from "./Header";

const table = 'users'
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter()
  const user: any = useSelector((state: RootState) => state.user.data);
  const pathname = usePathname();
  const activeMenu = pathname.slice(1)
  const { get } = FireApi()
  const dispatch = useDispatch();

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Menu items data
  const menuItems: MenuItem[] = [
    // Main Menu
    { id: 'dashboard', label: 'Dashboard', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'users', label: 'User Management', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'code-list', label: 'Code', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'html-list', label: 'Html', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'blog-list', label: 'Blog', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'dictionary-list', label: 'Dictionary', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'category-list', label: 'Category', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'error-list', label: 'Errors', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'comment-list', label: 'Comments', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'music-list', label: 'Music', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },
    { id: 'token-list', label: 'Tokens', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Main Menu' },

    // Settings
    { id: 'profile', label: 'Profile', icon: <span className="material-symbols-outlined text-lg">dashboard</span>, section: 'Settings' },
  ];

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

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
      router.push('/')
    } else {
      getUserDetail()
    }
  }, []);

  if(!(user?.roleDetail?.name=='admin')) return <>
  <div>You are not authorized to use this page</div>
  </>

  return (
    <>
      <div className="font-sans bg-gray-50">
        <div className="flex h-screen">
          <Sidebar
            menuItems={menuItems}
            isMobileOpen={isMobileOpen}
            onMobileToggle={handleMobileToggle}
            user={user}
          />

          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            <Header
              onMenuToggle={handleMobileToggle}
              currentPage={menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
              user={user}
            />

            <main className="flex-1 overflow-y-auto p-6">
              <div className="">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}




