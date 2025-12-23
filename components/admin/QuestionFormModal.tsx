import React, { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface QuestionFormData {
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'ranking' | 'select';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
}

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  isLoading?: boolean;
}

const initialFormData: QuestionFormData = {
  text: '',
  type: 'multiple-choice',
  topic: '',
  difficulty: 'Medium',
  category: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
};

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (formData.type === 'multiple-choice') {
      const validOptions = formData.options?.filter(opt => opt.trim()) || [];
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData: QuestionFormData = {
      ...formData,
      options: formData.type === 'multiple-choice'
        ? formData.options?.filter(opt => opt.trim())
        : undefined,
    };

    await onSubmit(submitData);
    handleClose();
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...(formData.options || []), ''],
    });
  };

  const removeOption = (index: number) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    const newCorrectIndex = formData.correctOptionIndex === index
      ? 0
      : (formData.correctOptionIndex || 0) > index
        ? (formData.correctOptionIndex || 0) - 1
        : formData.correctOptionIndex;
    setFormData({
      ...formData,
      options: newOptions,
      correctOptionIndex: newCorrectIndex,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Question" size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Question Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className={cn(
              "w-full min-h-[100px] rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white",
              errors.text && "border-red-500 bg-red-50"
            )}
            placeholder="Enter the question text..."
          />
          {errors.text && <p className="text-xs text-red-500 mt-1">{errors.text}</p>}
        </div>

        {/* Type and Difficulty Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionFormData['type'] })}
              className="w-full h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="text">Text</option>
              <option value="select">Select</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as QuestionFormData['difficulty'] })}
              className="w-full h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Topic and Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Topic"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., React, JavaScript"
            error={errors.topic}
          />
          <Input
            label="Category"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Technical, Soft Skills"
          />
        </div>

        {/* Options for Multiple Choice */}
        {formData.type === 'multiple-choice' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Answer Options <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={formData.correctOptionIndex === index}
                    onChange={() => setFormData({ ...formData, correctOptionIndex: index })}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple"
                    title="Mark as correct answer"
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {(formData.options?.length || 0) > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.options && <p className="text-xs text-red-500 mt-1">{errors.options}</p>}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              Select the radio button next to the correct answer.
            </p>
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Explanation (Optional)
          </label>
          <textarea
            value={formData.explanation || ''}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            className="w-full min-h-[80px] rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white"
            placeholder="Explain why the correct answer is correct..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-purple hover:bg-brand-darkPurple text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Question'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
