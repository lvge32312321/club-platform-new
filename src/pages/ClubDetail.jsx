import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClubs } from '@/hooks/useClubs';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { ChevronLeft, Users, Calendar, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 社团详情页面
 */
export const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getClubById } = useClubs();
  const { applications, applyToClub } = useApplications(user?.id);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClub = async () => {
      const result = await getClubById(id);
      if (result.success) {
        setClub(result.data);
      } else {
        toast.error('加载社团信息失败');
      }
      setLoading(false);
    };
    loadClub();
  }, [id, getClubById]);

  const hasApplied = applications.some(app => app.club_id === id);
  const isFull = club && club.current_members >= club.max_members;
  const canApply = club?.recruit_open && !isFull && !hasApplied;

  const handleApply = async () => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    if (applications.filter(app => app.status === 'pending').length >= 5) {
      toast.error('最多同时报名5个社团');
      return;
    }

    const result = await applyToClub(club.id);
    if (result.success) {
      toast.success('报名成功！请等待审核');
    } else {
      toast.error(result.error || '报名失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">社团不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 封面图 */}
      <div className="relative h-64">
        <img
          src={club.cover_image}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 社团信息 */}
      <div className="px-4 -mt-6 relative z-10">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className="text-xl font-bold">{club.name}</h1>
                <p className="text-sm text-gray-500 mt-1">负责人：{club.leader_name}</p>
              </div>
              <Badge className={club.recruit_open ? 'bg-green-500' : 'bg-gray-400'}>
                {club.recruit_open ? '招新中' : '已结束'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {club.current_members}/{club.max_members}人
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {club.scale}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{club.category}</Badge>
              {club.tags?.map(tag => (
                <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            {club.contact && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Phone size={14} />
                <span>联系方式：{club.contact}</span>
              </div>
            )}

            {hasApplied ? (
              <Button className="w-full" variant="outline" disabled>
                已报名
              </Button>
            ) : isFull ? (
              <Button className="w-full" variant="outline" disabled>
                已招满
              </Button>
            ) : !club.recruit_open ? (
              <Button className="w-full" variant="outline" disabled>
                招新已结束
              </Button>
            ) : (
              <Button className="w-full" onClick={handleApply}>
                立即报名
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 详细信息 */}
      <div className="px-4 mt-4 max-w-lg mx-auto">
        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="intro">社团简介</TabsTrigger>
            <TabsTrigger value="activities">往期活动</TabsTrigger>
          </TabsList>
          <TabsContent value="intro" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-700 leading-relaxed">
                  {club.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activities" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>暂无活动记录</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
