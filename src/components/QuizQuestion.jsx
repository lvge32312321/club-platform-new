import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

/**
 * 测评题目组件
 */
export const QuizQuestion = ({ question, value, onChange }) => {
  const isMulti = question.question_type === 'multi';
  // 从题目数据获取最大选择数，默认为3
  const maxSelect = question.max_select || 3;

  const handleSingleChange = (newValue) => {
    onChange(question.id, newValue);
  };

  const handleMultiChange = (optionValue, checked) => {
    const currentValues = Array.isArray(value) ? value : [];

    if (checked) {
      if (currentValues.length < maxSelect) {
        onChange(question.id, [...currentValues, optionValue]);
      } else {
        toast.warning(`最多只能选择 ${maxSelect} 项`);
      }
    } else {
      onChange(question.id, currentValues.filter(v => v !== optionValue));
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">
          <span className="text-blue-600 mr-2">Q{question.order_index}</span>
          {question.question_text}
        </h3>
        
        {isMulti ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              最多选择{maxSelect}项 (已选 {Array.isArray(value) ? value.length : 0}/{maxSelect})
            </p>
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => handleMultiChange(option.value, checked)}
                />
                <Label 
                  htmlFor={`${question.id}-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.value}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup 
            value={value} 
            onValueChange={handleSingleChange}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${question.id}-${option.value}`}
                />
                <Label 
                  htmlFor={`${question.id}-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};
