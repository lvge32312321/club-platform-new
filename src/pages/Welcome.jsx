import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 欢迎引导页面
 */
export const Welcome = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 3秒后显示内容
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate('/quiz');
  };

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">社团招新智能匹配平台</h1>
          <p className="text-white/80 mt-2">开启你的社团之旅</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            嗨~ 2026级新同学！
          </h2>
          
          <p className="text-gray-600 mb-2 leading-relaxed">
            找到属于你的社团，从这里开始。
          </p>
          
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            用3分钟回答几个问题，AI帮你发现最match的社团。
          </p>

          <Button 
            size="lg" 
            className="w-full group"
            onClick={handleStart}
          >
            开始测评
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-xs text-gray-400 mt-4">
            已有测评记录？<button className="text-blue-600 hover:underline">查看推荐</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
