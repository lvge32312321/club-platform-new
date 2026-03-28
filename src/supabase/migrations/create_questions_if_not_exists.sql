-- ============================================
-- 创建测评题目表（如果不存在）
-- 说明：确保 questions 表存在，包含完整的字段定义和初始数据
-- ============================================

-- 创建测评题目表
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('single', 'multi')),
    options JSONB NOT NULL,
    category VARCHAR(50) NOT NULL,
    order_index INTEGER NOT NULL,
    max_select INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(order_index);

-- 禁用 RLS 确保数据可访问
ALTER TABLE IF EXISTS public.questions DISABLE ROW LEVEL SECURITY;

-- 如果表为空，插入初始数据
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM public.questions) = 0 THEN
        INSERT INTO public.questions (id, question_text, question_type, options, category, order_index, max_select) VALUES
        ('11111111-1111-1111-1111-111111111111', '周末你更喜欢？', 'single', '[{"value": "学习", "tags": ["学术研究", "理论学习"], "score": 1}, {"value": "运动", "tags": ["体育运动", "健身跑步"], "score": 1}, {"value": "社交", "tags": ["社交联谊", "团队合作"], "score": 1}, {"value": "创作", "tags": ["艺术创作", "技术创新"], "score": 1}, {"value": "休息", "tags": ["休闲娱乐"], "score": 0.5}]'::jsonb, '日常活动偏好', 1, 1),
        ('22222222-2222-2222-2222-222222222222', '你偏好哪种学习方式？', 'single', '[{"value": "理论", "tags": ["学术研究", "理论研究"], "score": 1}, {"value": "实践", "tags": ["编程技术", "创新创业"], "score": 1}, {"value": "讨论", "tags": ["社交联谊", "语言表达"], "score": 1}, {"value": "自学", "tags": ["学术研究", "自我提升"], "score": 1}]'::jsonb, '学习风格', 2, 1),
        ('33333333-3333-3333-3333-333333333333', '你希望在社团中扮演什么角色？', 'single', '[{"value": "组织者", "tags": ["领导力", "组织管理"], "score": 1}, {"value": "参与者", "tags": ["团队合作", "社交联谊"], "score": 1}, {"value": "观察者", "tags": ["学术研究", "技能学习"], "score": 1}]'::jsonb, '社交场景', 3, 1),
        ('44444444-4444-4444-4444-444444444444', '以下哪类活动最吸引你？', 'multi', '[{"value": "学术讲座", "tags": ["学术研究", "知识分享"], "score": 1}, {"value": "体育竞技", "tags": ["球类运动", "健身跑步"], "score": 1}, {"value": "文艺表演", "tags": ["音乐舞蹈", "戏剧表演"], "score": 1}, {"value": "志愿服务", "tags": ["公益志愿", "社区服务"], "score": 1}, {"value": "技术创作", "tags": ["编程技术", "创新创业"], "score": 1}, {"value": "语言交流", "tags": ["英语角", "日语社"], "score": 1}]'::jsonb, '活动类型偏好', 4, 3),
        ('55555555-5555-5555-5555-555555555555', '你愿意每周花多少时间在社团？', 'single', '[{"value": "<2h", "tags": ["轻度参与"], "score": 0.5}, {"value": "2-5h", "tags": ["适度参与"], "score": 1}, {"value": "5-10h", "tags": ["深度参与"], "score": 1.5}, {"value": ">10h", "tags": ["全身心投入"], "score": 2}]'::jsonb, '时间投入意愿', 5, 1),
        ('66666666-6666-6666-6666-666666666666', '你最想在社团中提升什么？', 'multi', '[{"value": "专业技能", "tags": ["学术研究", "编程技术"], "score": 1}, {"value": "人际交往", "tags": ["社交联谊", "团队合作"], "score": 1}, {"value": "领导能力", "tags": ["组织管理", "领导力"], "score": 1}, {"value": "艺术修养", "tags": ["音乐舞蹈", "绘画书法"], "score": 1}, {"value": "身体素质", "tags": ["体育运动", "健身"], "score": 1}]'::jsonb, '技能提升目标', 6, 2),
        ('77777777-7777-7777-7777-777777777777', '你更喜欢哪种规模的社团？', 'single', '[{"value": "<20人", "tags": ["紧密小团体"], "score": 1}, {"value": "20-50人", "tags": ["适中规模"], "score": 1}, {"value": "50-100人", "tags": ["大型社团"], "score": 1}, {"value": ">100人", "tags": ["超大型社团"], "score": 1}]'::jsonb, '社团规模偏好', 7, 1);
    END IF;
END $$;
