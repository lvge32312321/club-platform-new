import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 引入 useLocation
import { Button } from '@/components/ui/button';
import { ClubCard } from '@/components/ClubCard';
import { useClubs } from '@/hooks/useClubs';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 获取路由传递的状态
  const { user, userProfile } = useAuth();
  const { clubs } = useClubs();
  const { calculateMatchScore } = useQuiz();
  const { applyToClub, applications } = useApplications(user?.id);
  
  const [selectedClub, setSelectedClub] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // 优先级：路由带过来的临时数据 > 用户档案里的数据
  const activeInterests = useMemo(() => {
    return location.state?.tempInterests || userProfile?.interests;
  }, [location.state, userProfile]);

  // 计算匹配度
  const recommendedClubs = useMemo(() => {
    if (!activeInterests || !clubs.length) return [];

    return clubs
      .map(club => ({
        ...club,
        matchScore: calculateMatchScore(activeInterests, club.tags),
      }))
      .filter(club => club.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }, [clubs, activeInterests, calculateMatchScore]);

  const handleApply = (club) => {
    // 只有在这里才需要强制登录
    if (!user) {
      toast.info('请先登录以提交报名申请');
      navigate('/login');
      return;
    }

    if (applications.some(app => app.club_id === club.id)) {
      toast.info('您已经报名过这个社团了');
      return;
    }

    setSelectedClub(club);
    setShowConfirm(true);
  };

  const confirmApply = async () => {
    if (!selectedClub) return;
    const result = await applyToClub(selectedClub.id, selectedClub.matchScore);
    if (result.success) {
      toast.success('报名成功！');
      setShowConfirm(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">智能推荐结果</span>
          </div>
          <h1 className="text-2xl font-bold">发现你的志趣所在</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {recommendedClubs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">暂无推荐数据，请先完成测评</p>
            <Button onClick={() => navigate('/quiz')}>去测评</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedClubs.map(club => (
              <ClubCard key={club.id} club={club} matchScore={club.matchScore} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>确认报名</DialogTitle></DialogHeader>
          <div className="py-4">确认要加入 {selectedClub?.name} 吗？</div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>取消</Button>
            <Button onClick={confirmApply}>确认报名</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};