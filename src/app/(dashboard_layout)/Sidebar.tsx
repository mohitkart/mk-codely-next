import { MenuItem } from '@/types/dashboard';
import { APP_NAME } from '@/utils/shared';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react';

interface SidebarProps {
  menuItems: MenuItem[];
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
  user:any;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  isMobileOpen = false,
  onMobileToggle,
  user
}) => {
      const router = useRouter()
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const pathname = usePathname();

   const handleMenuClick = (menuId: string) => {
    router.push(`/${menuId}`)
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-transition w-64 bg-white shadow-lg flex flex-col fixed lg:static inset-y-0 left-0 z-50
        transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">dashboard</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">{APP_NAME}</span>
          </div>
        </div>
        
        {/* Navigation with Scroll */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollable-menu">
            {Object.entries(groupedMenuItems).map(([section, items]) => (
              <div key={section}>
                <div className="px-4 py-4 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section}
                  </h3>
                </div>
                
                <nav className="px-4 py-2 space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                        ${pathname == `/${item.id}`
                          ? 'active-menu-item' 
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
          
          {/* User Profile */}
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User profile" 
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs font-medium text-gray-500">Administrator</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-500">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;