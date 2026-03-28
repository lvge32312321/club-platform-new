import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 社团数据 Hook
 * 用于获取社团列表、应用多重筛选以及获取单个社团详情
 */
export const useClubs = (filters = {}) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('clubs').select('*');

      // 1. 类别筛选：仅在值不为 'all' 时应用
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // 2. 招新状态筛选：如果为 'open'，只查询 recruit_open 为 true 的数据
      if (filters.recruitStatus === 'open') {
        query = query.eq('recruit_open', true);
      }

      // 3. 规模筛选：修正逻辑，仅在值不为 'all' 时应用
      // 之前代码在此处没有判断 'all'，导致数据库去匹配名为 "all" 的规模，从而返回空结果
      if (filters.scale && filters.scale !== 'all') {
        query = query.eq('scale', filters.scale);
      }

      // 4. 搜索逻辑：支持名称模糊匹配和标签包含匹配
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }

      // 排序：默认按创建时间倒序排列
      const { data, error: queryError } = await query.order('created_at', { ascending: false });
      
      if (queryError) throw queryError;
      setClubs(data || []);
    } catch (err) {
      console.error('获取社团数据失败:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  /**
   * 根据 ID 获取单个社团的详细信息
   */
  const getClubById = useCallback(async (id) => {
    try {
      const { data, error: queryError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (queryError) throw queryError;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    clubs,
    loading,
    error,
    refetch: fetchClubs,
    getClubById,
  };
};