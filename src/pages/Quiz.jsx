import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from '@/components/QuizQuestion';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

export const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, loading, error, refetch, calculateInterestVector, saveQuizResult } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion?.id]) {
      toast.error('请先回答当前问题');
      return;
    }
    isLastQuestion ? handleSubmit() : setCurrentIndex(prev => prev + 1);
  };

  const handleSubmit = async () => {
    // 检查是否全部回答
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`还有 ${unanswered.length} 道题未回答`);
      setCurrentIndex(questions.findIndex(q => !answers[q.id]));
      return;
    }

    setIsSubmitting(true);
    
    // 1. 无论是否登录，都在本地计算兴趣向量
    const interests = calculateInterestVector(answers);

    // 2. 如果已登录，则同步到数据库
    if (user) {
      await saveQuizResult(user.id, answers);
    }

    setIsSubmitting(false);
    toast.success('测评完成！正在生成个性化推荐...');
    
    // 3. 将计算出的兴趣数据传递给推荐页（关键点：即使没登录也能带过去）
    navigate('/recommendations', { state: { tempInterests: interests } });
  };

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(prev => prev - 1); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-center"><Button onClick={refetch}>重试</Button></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button onClick={handlePrev} disabled={currentIndex === 0}><ChevronLeft /></button>
          <span className="text-sm">第 {currentIndex + 1} 题 / 共 {questions.length} 题</span>
          <div className="w-10" />
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {currentQuestion && (
          <>
            <QuizQuestion question={currentQuestion} value={answers[currentQuestion.id]} onChange={handleAnswerChange} />
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={handlePrev} disabled={currentIndex === 0}>上一题</Button>
              <Button className="flex-1" onClick={handleNext} disabled={!answers[currentQuestion?.id] || isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : isLastQuestion ? '完成测评' : '下一题'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};