import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClubCard } from "@/components/ClubCard";
import { useClubs } from "@/hooks/useClubs";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["全部", "学术科技", "文化艺术", "体育竞技", "志愿公益", "创新创业"];
const STATUS_OPTIONS = [
  { label: "全部状态", value: "all" },
  { label: "招新中", value: "open" },
  { label: "已结束", value: "closed" },
];

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "全部",
    recruitStatus: "all",
  });

  // 【核心修复】使用 useMemo 包装筛选参数
  // 只有当 searchQuery 或 filters 真正改变时，这个对象才会重新生成
  const clubParams = useMemo(() => ({
    category: filters.category === "全部" ? null : filters.category,
    recruitStatus: filters.recruitStatus,
    search: searchQuery,
  }), [filters.category, filters.recruitStatus, searchQuery]);

  // 将稳定的参数传给 hook
  const { clubs, loading } = useClubs(clubParams);

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索与筛选头部 */}
      <div className="flex flex-col space-y-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">发现社团</h1>
          <p className="text-muted-foreground">探索校园精彩，开启你的第二课堂</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索社团名称或关键词..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.recruitStatus}
              onValueChange={(value) => setFilters(prev => ({ ...prev, recruitStatus: value }))}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="招新状态" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={filters.category === cat ? "default" : "secondary"}
              className="cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors"
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* 结果展示区 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : clubs && clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">未找到相关社团</h3>
          <p className="text-muted-foreground">尝试调整筛选条件或搜索其他关键词</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSearchQuery("");
              setFilters({ category: "全部", recruitStatus: "all" });
            }}
          >
            重置所有筛选
          </Button>
        </div>
      )}
    </div>
  );
};

export default Explore;