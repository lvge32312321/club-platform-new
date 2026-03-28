import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useClubs } from '@/hooks/useClubs';
import { useApplications } from '@/hooks/useApplications';
import { useNotifications } from '@/hooks/useNotifications';
import { ClubCard } from '@/components/ClubCard';
import { Sparkles, Bell, ChevronRight, Users } from 'lucide-react';

/**
 * 首页（Landing Page）
 */
export const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { clubs } = useClubs({ recruitStatus: 'open' });
  const { applications } = useApplications(user?.id);
  const { unreadCount } = useNotifications(user?.id);

  // 推荐社团（取前3个）
  const recommendedClubs = clubs.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold">
                {userProfile ? `你好，${userProfile.name}！` : '欢迎来到社团招新平台'}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {userProfile?.quiz_completed 
                  ? '基于你的兴趣，为你推荐以下社团' 
                  : '用3分钟完成测评，发现最适合你的社团'}
              </p>
            </div>
            <button 
              className="relative p-2 bg-white/20 rounded-full"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </div>

          {!userProfile?.quiz_completed && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">完成AI兴趣测评</p>
                    <p className="text-xs text-white/70">获取个性化社团推荐</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => navigate('/quiz')}
                >
                  开始
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-3">
          <Link to="/explore">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium">发现社团</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/applications">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-green-600">
                    {applications.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <p className="text-sm font-medium">待审核</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium">个人中心</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* 推荐社团 */}
      <div className="px-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">热门社团</h2>
          <Link to="/explore" className="text-sm text-blue-600 flex items-center">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recommendedClubs.map(club => (
            <ClubCard key={club.id} club={club} showApply={false} />
          ))}
        </div>

        {userProfile?.quiz_completed && (
          <Button 
            className="w-full mt-6"
            onClick={() => navigate('/recommendations')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            查看AI推荐
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
