import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ClipboardList, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * 底部导航栏组件
 */
export const Navbar = ({ unreadCount = 0 }) => {
  const location = useLocation();
  
  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/explore', icon: Compass, label: '发现' },
    { to: '/applications', icon: ClipboardList, label: '报名' },
    { to: '/notifications', icon: Bell, label: '消息' },
    { to: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {to === '/notifications' && unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
