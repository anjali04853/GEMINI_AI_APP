import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface DatasetFormData {
  name: string;
  description?: string;
  type: 'assessment' | 'interview' | 'mixed';
  category: string;
}

interface DatasetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatasetFormData) => Promise<void>;
  isLoading?: boolean;
}

const initialFormData: DatasetFormData = {
  name: '',
  description: '',
  type: 'assessment',
  category: '',
};

export const DatasetFormModal: React.FC<DatasetFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<DatasetFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Dataset name is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Dataset" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Dataset Name */}
        <Input
          label="Dataset Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., JavaScript Fundamentals"
          error={errors.name}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={cn(
              "w-full min-h-[100px] rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white"
            )}
            placeholder="Describe what this dataset contains..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as DatasetFormData['type'] })}
            className="w-full h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent focus:bg-white"
          >
            <option value="assessment">Assessment</option>
            <option value="interview">Interview</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Category */}
        <Input
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., Frontend, Backend, Full Stack"
          error={errors.category}
        />

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
                Creating...
              </>
            ) : (
              'Create Dataset'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
