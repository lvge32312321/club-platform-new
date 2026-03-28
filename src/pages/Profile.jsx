import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronRight, 
  ClipboardList, 
  Heart, 
  Bell, 
  HelpCircle, 
  FileText,
  LogOut 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * 个人中心页面
 */
export const Profile = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('已退出登录');
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: ClipboardList, label: '我的报名', to: '/applications', badge: null },
    { icon: Heart, label: '我的收藏', to: '/favorites', badge: null },
    { icon: Bell, label: '消息通知', to: '/notifications', badge: null },
    { icon: FileText, label: '完成测评', to: '/quiz', badge: null },
    { icon: HelpCircle, label: '帮助与反馈', to: '/help', badge: null },
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先登录</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {userProfile.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <p className="text-sm text-gray-500">学号：{userProfile.student_id}</p>
                {userProfile.department && (
                  <p className="text-sm text-gray-500">院系：{userProfile.department}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 菜单列表 */}
      <div className="p-4 max-w-lg mx-auto space-y-3">
        {menuItems.map((item) => (
          <Card
            key={item.label}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate(item.to)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-500" />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card
          className="cursor-pointer hover:bg-red-50 transition-colors mt-6"
          onClick={handleLogout}
        >
          <CardContent className="p-4 flex items-center gap-3 text-red-600">
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        <p>社团招新智能匹配平台 v1.0</p>
      </div>
    </div>
  );
};
