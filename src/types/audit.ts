// Action Audit Types (for History Log)
export interface ActionAudit {
  id: number;
  tableName: string;
  action: 'create' | 'update' | 'delete';
  recordId: number;
  userId?: number;
  userName?: string;
  changes?: any;
  timestamp: string;
  ipAddress?: string;
}
