import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 报名申请Hook
 * 管理用户的社团报名申请
 */
export const useApplications = (userId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('applications')
        .select(`
          *,
          clubs:club_id (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 提交报名申请
  const applyToClub = useCallback(async (clubId, matchScore = null) => {
    try {
      const { data, error: queryError } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          club_id: clubId,
          match_score: matchScore,
          status: 'pending',
        });

      if (queryError) throw queryError;

      // 创建通知
      await supabase.from('notifications').insert({
        user_id: userId,
        type: '报名成功',
        title: '报名成功',
        content: '你已成功报名，请等待社团审核',
        related_club_id: clubId,
      });

      await fetchApplications();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchApplications]);

  // 取消报名
  const cancelApplication = useCallback(async (applicationId) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', applicationId);

      if (error) throw error;
      await fetchApplications();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    applyToClub,
    cancelApplication,
  };
};
