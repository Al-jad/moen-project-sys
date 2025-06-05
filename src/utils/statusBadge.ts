export interface StatusStyle {
  bg: string;
  text: string;
}

export interface StatusConfig {
  [key: string]: StatusStyle;
}

export const projectStatusColors: StatusConfig = {
  cancelled: {
    bg: 'bg-gray-500/10 dark:bg-gray-500/20',
    text: 'text-gray-800 dark:text-gray-300',
  },
  ongoing: {
    bg: 'bg-yellow-500/30 dark:bg-yellow-500/20',
    text: 'text-yellow-800 dark:text-yellow-300',
  },
  completed: {
    bg: 'bg-green-500/30 dark:bg-green-500/20',
    text: 'text-green-800 dark:text-green-300',
  },
  delayed: {
    bg: 'bg-red-500/30 dark:bg-red-500/20',
    text: 'text-red-800 dark:text-red-300',
  },
};

export const getProjectStatusConfig = (status: number): { key: string; label: string } => {
  const statusMap: { [key: number]: { key: string; label: string } } = {
    0: { key: 'cancelled', label: 'ملغاة' },
    1: { key: 'ongoing', label: 'قيد التنفيذ' },
    2: { key: 'completed', label: 'منجزة' },
    3: { key: 'delayed', label: 'متلكئة' },
    4: { key: 'proposed', label: 'مقترح' },
  };

  return statusMap[status] || { key: 'cancelled', label: 'غير معروف' };
};
