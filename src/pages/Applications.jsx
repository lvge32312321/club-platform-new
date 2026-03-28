import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 报名管理页面
 */
export const ApplicationsPage = () => {
  const { user } = useAuth();
  const { applications, loading, cancelApplication } = useApplications(user?.id);
  const [activeTab, setActiveTab] = useState('all');

  const statusConfig = {
    pending: { label: '待审核', color: 'bg-yellow-500', icon: Clock },
    accepted: { label: '已录取', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: '未录取', color: 'bg-red-500', icon: XCircle },
    cancelled: { label: '已取消', color: 'bg-gray-400', icon: Ban },
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const handleCancel = async (applicationId) => {
    const result = await cancelApplication(applicationId);
    if (result.success) {
      toast.success('已取消报名');
    } else {
      toast.error('操作失败');
    }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center">我的报名</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="pending">待审核</TabsTrigger>
            <TabsTrigger value="accepted">已录取</TabsTrigger>
            <TabsTrigger value="rejected">未录取</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无报名记录</p>
                <Link to="/explore">
                  <Button variant="outline" className="mt-4">
                    去发现社团
                  </Button>
                </Link>
              </div>
            ) : (
              filteredApplications.map(app => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{app.clubs?.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {getStatusBadge(app.status)}
                        </p>
                      </div>
                      {app.match_score && (
                        <Badge variant="secondary">
                          匹配度 {Math.round(app.match_score)}%
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      报名时间：{new Date(app.created_at).toLocaleString()}
                    </p>

                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCancel(app.id)}
                        >
                          取消报名
                        </Button>
                        <Link to={`/club/${app.club_id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            查看详情
                          </Button>
                        </Link>
                      </div>
                    )}

                    {app.status === 'accepted' && (
                      <Button size="sm" className="w-full">
                        加入社群
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
