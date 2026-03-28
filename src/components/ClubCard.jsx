import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * 社团卡片组件
 */
export const ClubCard = ({ club, matchScore = null, showApply = true, onApply }) => {
  const isFull = club.current_members >= club.max_members;
  const isRecruiting = club.recruit_open && !isFull;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/2] relative overflow-hidden">
        <img
          src={club.cover_image || 'https://nocode.meituan.com/photo/search?keyword=club&width=300&height=200'}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        {matchScore !== null && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            匹配度 {matchScore}%
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <Badge variant="secondary" className="bg-white/90">
            {club.category}
          </Badge>
          {!isRecruiting && (
            <Badge variant="destructive">
              {isFull ? '已招满' : '已结束'}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{club.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Users size={14} />
          <span>{club.current_members}/{club.max_members}人</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(club.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Link to={`/club/${club.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              查看详情
            </Button>
          </Link>
          {showApply && isRecruiting && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onApply?.(club)}
            >
              一键报名
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
