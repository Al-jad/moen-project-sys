export interface Log {
  id: number;
  tableName: string;
  tableRowId: string;
  action: string;
  createdAt: string;
  changes?: string | Record<string, unknown>;
  user?: {
    name: string;
  };
  details?: {
    fieldName: string;
    oldValue: string | null;
    newValue: string | null;
  }[];
}

export type ActionType = 'create' | 'update' | 'delete';

export interface LogTableItem extends Log {
  originalAction: string;
  filterableAction: string;
}

export interface LogFilter {
  key: string;
  placeholder: string;
  options: Array<{
    value: string | 'all';
    label: string;
  }>;
  icon: string;
  triggerClass: string;
}

export interface LogColumn {
  key: string;
  label: string;
  type?: 'text' | 'action' | 'button' | 'custom';
  icon?: string;
}
