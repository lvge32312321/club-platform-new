import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { navItems } from './nav-items';
import { Navbar } from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';

const queryClient = new QueryClient();

/**
 * 导航栏包装组件
 */
const NavigationWrapper = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  
  // 在以下页面不显示导航栏
  const hideNavPaths = ['/welcome', '/login', '/register', '/quiz'];
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHideNav) return null;
  
  return <Navbar unreadCount={unreadCount} />;
};

/**
 * 应用主组件
 */
const AppContent = () => {
  return (
    <>
      <Routes>
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
      </Routes>
      <NavigationWrapper />
      <Toaster position="top-center" />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
