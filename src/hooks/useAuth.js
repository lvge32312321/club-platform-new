import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

/**
 * 这个钩子处理所有的用户认证逻辑。
 * 我们优化了 signUp 函数，将额外信息放入 metadata 中，
 * 配合数据库触发器，实现注册即自动同步用户信息。
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, fullName, studentId, major }) => {
    // 关键点：我们将 full_name 和 student_id 传给 options.data
    // 这样数据库里的 handle_new_user 触发器就能读到这些值并自动存入 users 表
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId,
          major: major,
        }
      }
    });

    if (error) {
      console.error("注册错误:", error.message);
      return { error };
    }
    return { data };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error("登录错误:", error.message);
    return { data, error };
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
};