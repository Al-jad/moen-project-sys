import type { TransformedFundedProject } from '@/types/funded-project';

export interface SortOption {
  id: string;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'cost-low', label: 'من السعر الادنى', icon: 'lucide:arrow-down-to-line' },
  { id: 'cost-high', label: 'من السعر الاعلى', icon: 'lucide:arrow-up-to-line' },
  { id: 'duration-high', label: 'من الفترة الاعلى', icon: 'lucide:arrow-up-wide-narrow' },
  { id: 'duration-low', label: 'من الفترة الادنى', icon: 'lucide:arrow-down-narrow-wide' },
  { id: 'progress-high', label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-up-circle' },
  { id: 'progress-low', label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-down-circle' },
];

export const getSelectedSortLabel = (selectedSort: string): string => {
  const option = sortOptions.find((opt) => opt.id === selectedSort);
  return option ? option.label : '';
};

export const sortProjects = (
  projects: TransformedFundedProject[],
  field: 'cost' | 'progress' | 'duration',
  order: 'high' | 'low'
): TransformedFundedProject[] => {
  const sortedProjects = [...projects];

  sortedProjects.sort((a, b) => {
    let aValue: number = 0;
    let bValue: number = 0;

    switch (field) {
      case 'cost':
        aValue = a.cost || 0;
        bValue = b.cost || 0;
        break;
      case 'progress':
        aValue = a.progress || 0;
        bValue = b.progress || 0;
        break;
      case 'duration':
        aValue = parseInt(a.duration) || 0;
        bValue = parseInt(b.duration) || 0;
        break;
    }

    return order === 'high' ? bValue - aValue : aValue - bValue;
  });

  return sortedProjects;
};

export const handleSort = (
  projects: TransformedFundedProject[],
  sortId: string
): TransformedFundedProject[] | null => {
  const [field, order] = sortId.split('-') as [string, string];

  if (field && (field === 'cost' || field === 'progress' || field === 'duration')) {
    return sortProjects(projects, field, order as 'high' | 'low');
  }

  return null;
};
