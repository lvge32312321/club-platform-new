import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * AI兴趣测评Hook
 * 管理测评题目和计算匹配度
 */
export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取测评题目
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: queryError } = await supabase
        .from('questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (queryError) throw new Error(`数据库查询失败: ${queryError.message}`);
      if (!data || data.length === 0) throw new Error('数据库中暂无测评题目');

      const parsedData = data.map((q) => {
        let parsedOptions = [];
        try {
          parsedOptions = Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]');
        } catch (parseErr) {
          parsedOptions = [];
        }
        return {
          ...q,
          options: parsedOptions,
          max_select: q.max_select || (q.question_type === 'multi' ? 3 : 1)
        };
      });

      setQuestions(parsedData.filter(q => q.options && q.options.length > 0));
    } catch (err) {
      setError(err.message || '加载题目时发生错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 计算用户兴趣向量（不依赖登录状态）
  const calculateInterestVector = useCallback((answers) => {
    const tagScores = {};
    Object.entries(answers).forEach(([questionId, selectedOptions]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const selectedValues = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
      selectedValues.forEach(value => {
        const option = question.options.find(o => o.value === value);
        if (option && option.tags) {
          option.tags.forEach(tag => {
            tagScores[tag] = (tagScores[tag] || 0) + (option.score || 1);
          });
        }
      });
    });
    return tagScores;
  }, [questions]);

  // 计算与社团的匹配度
  const calculateMatchScore = useCallback((userTags, clubTags) => {
    if (!userTags || !clubTags || clubTags.length === 0) return 0;
    let totalScore = 0;
    let maxPossibleScore = 0;

    clubTags.forEach(clubTag => {
      const userScore = userTags[clubTag] || 0;
      totalScore += userScore;
      // 归一化计算
      maxPossibleScore += Math.max(...Object.values(userTags)) || 1;
    });

    return maxPossibleScore === 0 ? 0 : Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100);
  }, []);

  // 保存测评结果（仅在登录时调用）
  const saveQuizResult = useCallback(async (userId, answers) => {
    try {
      const interests = calculateInterestVector(answers);
      const { error } = await supabase
        .from('users')
        .update({
          quiz_completed: true,
          quiz_answers: answers,
          interests: interests,
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true, interests };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [calculateInterestVector]);

  return { questions, loading, error, refetch: fetchQuestions, calculateInterestVector, calculateMatchScore, saveQuizResult };
};