import { Home, Compass, ClipboardList, Bell, User } from 'lucide-react';
import { Index } from './pages/Index.jsx';
import { Welcome } from './pages/Welcome.jsx';
import { Quiz } from './pages/Quiz.jsx';
import { Recommendations } from './pages/Recommendations.jsx';
import { Explore } from './pages/Explore.jsx';
import { ClubDetail } from './pages/ClubDetail.jsx';
import { ApplicationsPage } from './pages/Applications.jsx';
import { Notifications } from './pages/Notifications.jsx';
import { Profile } from './pages/Profile.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';

/**
 * 导航配置
 */
export const navItems = [
  { title: '首页', to: '/', icon: <Home className="h-4 w-4" />, page: <Index />, showInNav: true },
  { title: '欢迎', to: '/welcome', icon: null, page: <Welcome />, showInNav: false },
  { title: '测评', to: '/quiz', icon: null, page: <Quiz />, showInNav: false },
  { title: '推荐', to: '/recommendations', icon: null, page: <Recommendations />, showInNav: false },
  { title: '发现', to: '/explore', icon: <Compass className="h-4 w-4" />, page: <Explore />, showInNav: true },
  { title: '社团详情', to: '/club/:id', icon: null, page: <ClubDetail />, showInNav: false },
  { title: '报名', to: '/applications', icon: <ClipboardList className="h-4 w-4" />, page: <ApplicationsPage />, showInNav: true },
  { title: '消息', to: '/notifications', icon: <Bell className="h-4 w-4" />, page: <Notifications />, showInNav: true },
  { title: '我的', to: '/profile', icon: <User className="h-4 w-4" />, page: <Profile />, showInNav: true },
  { title: '登录', to: '/login', icon: null, page: <Login />, showInNav: false },
  { title: '注册', to: '/register', icon: null, page: <Register />, showInNav: false },
];
