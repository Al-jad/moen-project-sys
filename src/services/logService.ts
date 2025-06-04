import axiosInstance from '@/plugins/axios';
import type { Log, LogTableItem } from '@/types/logs';

export const TABLE_TRANSLATIONS: Record<string, string> = {
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
};

export const ACTION_TRANSLATIONS: Record<string, string> = {
  create: 'إنشاء',
  update: 'تعديل',
  delete: 'حذف',
};

export const FIELD_TRANSLATIONS: Record<string, string> = {
  createdAt: 'تاريخ الإنشاء',
  Name: 'الاسم',
  ComponentId: 'رقم المكون',
  Notes: 'ملاحظات',
  TargetPercentage: 'النسبة المستهدفة',
  Id: 'المعرف',
  description: 'الوصف',
  title: 'العنوان',
  status: 'الحالة',
  startDate: 'تاريخ البدء',
  endDate: 'تاريخ الانتهاء',
  projectId: 'رقم المشروع',
  userId: 'رقم المستخدم',
  fileName: 'اسم الملف',
  fileSize: 'حجم الملف',
  fileType: 'نوع الملف',
  path: 'المسار',
  email: 'البريد الإلكتروني',
  username: 'اسم المستخدم',
  password: 'كلمة المرور',
  phoneNumber: 'رقم الهاتف',
  role: 'الدور',
  progress: 'التقدم',
  attachmentId: 'رقم المرفق',
  activityId: 'رقم النشاط',
  phaseId: 'رقم المرحلة',
  updatedAt: 'تاريخ التحديث',
  deletedAt: 'تاريخ الحذف',
  isGovernment: 'مشروع حكومي',
  Lng: 'خط الطول',
  Lat: 'خط العرض',
  isActive: 'مفعل',
  isPublic: 'عام',
  isFeatured: 'مميز',
  FinancialAchievement: 'الانجاز المالي',
  isFunded: 'ممول',
  PeriodType: 'نوع الفترة',
  Duration: 'المدة',
  projectObjectives: 'أهداف المشروع',
  ActualStartDate: 'تاريخ بدء المشروع الفعلي',
  ActualEndDate: 'تاريخ انتهاء المشروع الفعلي',
  ProjectStatus: 'حالة المشروع',
  ProjectType: 'نوع المشروع',
  ProjectCategory: 'تصنيف المشروع',
  ProjectSubCategory: 'تصنيف المشروع الفرعي',
  ReferenceEntity: 'الجهة المرجعية',
  Location: 'الموقع',
  CreatedAt: 'تاريخ الإنشاء',
  UpdatedAt: 'تاريخ التحديث',
  IsDeleted: 'محذوف؟',
};

export const formatDate = (dateString: string): string => {
  // If no date string is provided, return empty string
  if (!dateString) return '';

  // Remove any Arabic-specific formatting characters
  const cleanDateString = dateString
    .replace(/[٠-٩]/g, (d) => {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return arabicNumerals.indexOf(d).toString();
    })
    .replace(/[ص]/g, 'AM')
    .replace(/[م]/g, 'PM')
    .replace(/‏/g, ''); // Remove zero-width spaces

  try {
    // Parse the cleaned date string
    const date = new Date(cleanDateString);

    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'تاريخ غير صالح';
    }

    // Format using Arabic locale
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'تاريخ غير صالح';
  }
};

function normalizeArabicNumerals(input: string): string {
  const arabicNumeralsMap: { [key: string]: string } = {
    '٠': '0',
    '٩': '9',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '‏': '',
    ص: 'AM',
    م: 'PM',
  };

  return input
    .split('')
    .map((char) => arabicNumeralsMap[char] || char)
    .join('')
    .trim();
}

export const getTableName = (tableName: string | null | undefined): string => {
  if (tableName === null || tableName === undefined) {
    return 'غير محدد';
  }
  return TABLE_TRANSLATIONS[tableName] || tableName;
};

export const translateAction = (action: string | null | undefined): string => {
  if (action === null || action === undefined) {
    return 'غير محدد';
  }
  return ACTION_TRANSLATIONS[action] || action;
};

export const translateFieldName = (fieldName: string): string => {
  return FIELD_TRANSLATIONS[fieldName] || fieldName;
};

export const fetchLogs = async (): Promise<LogTableItem[]> => {
  const response = await axiosInstance.get('/api/ActionAudit');

  return (response.data as Log[]).map((log: Log) => {
    const translatedAction = translateAction(log.action);

    return {
      ...log,
      createdAt: formatDate(log.createdAt),
      originalAction: log.action,
      action: translatedAction,
      tableName: log.tableName,
      filterableAction: translatedAction,
    };
  });
};

export const processLogForDisplay = (log: Log): Log => {
  const processedLog = { ...log };

  if (processedLog.tableName) {
    processedLog.tableName = getTableName(processedLog.tableName);
  }

  if (processedLog.changes) {
    try {
      let changes =
        typeof processedLog.changes === 'string'
          ? JSON.parse(processedLog.changes)
          : processedLog.changes;

      const translatedChanges: Record<string, unknown> = {};
      for (const field in changes) {
        translatedChanges[translateFieldName(field)] = changes[field];
      }

      processedLog.changes = translatedChanges;
    } catch (error) {
      console.error('Error parsing changes:', error);
    }
  }

  return processedLog;
};
