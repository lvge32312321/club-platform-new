-- ============================================
-- 创建社团表
-- 说明：存储社团基本信息和招新设置
-- ============================================

CREATE TABLE IF NOT EXISTS clubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    cover_image VARCHAR(500),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('学术科技', '艺术文化', '体育运动', '公益志愿', '社交联谊', '语言交流', '其他')),
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    scale VARCHAR(20) NOT NULL CHECK (scale IN ('<20人', '20-50人', '50-100人', '>100人')),
    leader_name VARCHAR(50) NOT NULL,
    contact VARCHAR(100),
    max_members INTEGER NOT NULL DEFAULT 50,
    current_members INTEGER DEFAULT 0,
    recruit_open BOOLEAN DEFAULT true,
    recruit_deadline TIMESTAMP WITH TIME ZONE,
    admin_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs(category);
CREATE INDEX IF NOT EXISTS idx_clubs_recruit_open ON clubs(recruit_open);
CREATE INDEX IF NOT EXISTS idx_clubs_admin_id ON clubs(admin_id);
