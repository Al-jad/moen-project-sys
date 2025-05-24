import axiosInstance from '@/plugins/axios';
import type { ActionAudit, QueryParams, ServiceResponse } from '@/types/api';

class ActionAuditService {
  // Action Audit Operations
  async getAllActionAudits(params?: QueryParams): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', { params });
    return response;
  }

  async getActionAuditById(id: number): ServiceResponse<ActionAudit> {
    const response = await axiosInstance.get(`/api/ActionAudit/${id}`);
    return response;
  }

  async getActionAuditsByTable(tableName: string): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', {
      params: { tableName },
    });
    return response;
  }

  async getActionAuditsByUser(userId: number): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', {
      params: { userId },
    });
    return response;
  }

  async getActionAuditsByRecord(
    tableName: string,
    recordId: number
  ): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', {
      params: { tableName, recordId },
    });
    return response;
  }

  async getActionAuditsByDateRange(
    dateFrom: string,
    dateTo: string
  ): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', {
      params: { dateFrom, dateTo },
    });
    return response;
  }

  // Utility Methods
  async searchActionAudits(searchTerm: string): ServiceResponse<ActionAudit[]> {
    const response = await axiosInstance.get('/api/ActionAudit', {
      params: { search: searchTerm },
    });
    return response;
  }

  // Translation helpers
  getTableNameTranslation(tableName: string): string {
    if (tableName === null || tableName === undefined) {
      return 'غير محدد';
    }

    const translations: Record<string, string> = {
      AppUser: 'المستخدمين',
      Project: 'المشاريع',
      ProjectPhase: 'المراحل',
      ProjectActivity: 'الأنشطة',
      Activity: 'الأنشطة',
      Component: 'المكونات',
      Attachment: 'المرفقات',
      User: 'المستخدمين',
      Phase: 'المراحل',
      Task: 'المهام',
      Document: 'المستندات',
      Report: 'التقارير',
      Dashboard: 'لوحة القيادة',
      Beneficiary: 'الجهات المستفيدة',
      RegionalProject: 'المشاريع الإقليمية',
      Contract: 'العقود',
      Procedure: 'الإجراءات',
    };

    return translations[tableName] || tableName;
  }

  getActionTranslation(action: string): string {
    if (action === null || action === undefined) {
      return 'غير محدد';
    }

    const actionMap: Record<string, string> = {
      create: 'إنشاء',
      update: 'تعديل',
      delete: 'حذف',
    };

    return actionMap[action] || action;
  }
}

export const actionAuditService = new ActionAuditService();
export default actionAuditService;
