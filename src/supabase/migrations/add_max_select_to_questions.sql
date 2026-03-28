-- ============================================
-- 为测评题目表添加最大选择数字段
-- 说明：支持多选题的不同最大选择数量限制（如Q4最多3项，Q6最多2项）
-- ============================================

-- 添加 max_select 列，默认值为3
ALTER TABLE questions ADD COLUMN IF NOT EXISTS max_select INTEGER DEFAULT 3;

-- 更新现有数据：Q4 (order_index = 4) 活动类型偏好 - 最多3项
UPDATE questions SET max_select = 3 WHERE order_index = 4 AND question_type = 'multi';

-- 更新现有数据：Q6 (order_index = 6) 技能提升目标 - 最多2项
UPDATE questions SET max_select = 2 WHERE order_index = 6 AND question_type = 'multi';

-- 确保单选题的 max_select 为1
UPDATE questions SET max_select = 1 WHERE question_type = 'single';
