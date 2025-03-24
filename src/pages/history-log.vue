<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div>
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <BackToMainButton />
            <h1 class="text-xl font-bold dark:text-white">سجل الاحداث</h1>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            :columns="columns"
            :data="logs"
            :filters="filters"
            :showDateFilter="true"
            :isPremium="true"
            @export="exportToExcel"
            @action-click="viewDetails"
          >
            <template #tableName="{ value }">
              <span class="text-primary dark:text-gray-300">{{ getTableName(value) }}</span>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- View Details Dialog -->
      <ViewLogModal v-model:open="showDetailsDialog" :log="selectedLog" />
    </main>
  </DefaultLayout>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import ViewLogModal from '@/components/ViewLogModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';

  // State
  const showDetailsDialog = ref(false);
  const selectedLog = ref(null);
  const logs = ref([]);
  const isLoading = ref(false);

  // Table configuration
  const columns = [
    { key: 'id', label: 'رقم العملية' },
    { key: 'tableName', label: 'اسم الجدول' },
    { key: 'action', label: 'نوع العملية' },
    { key: 'createdAt', label: 'تاريخ العملية' },
    { key: 'actions', label: '', type: 'action', icon: 'lucide:eye' },
  ];

  const filters = [
    {
      key: 'tableName',
      placeholder: 'اختر الجدول',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'Project', label: 'المشاريع' },
        { value: 'Attachment', label: 'المرفقات' },
        { value: 'AppUser', label: 'المستخدمين' },
        { value: 'Activity', label: 'الأنشطة' },
        { value: 'Component', label: 'المكونات' }
      ],
      icon: 'lucide:folder',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'action',
      placeholder: 'نوع العملية',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'create', label: 'إنشاء' },
        { value: 'update', label: 'تعديل' },
        { value: 'delete', label: 'حذف' },
      ],
      icon: 'lucide:activity',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getTableName = (tableName) => {
    const translations = {
      'AppUser': 'المستخدمين',
      'Project': 'المشاريع',
      'ProjectPhase': 'المراحل',
      'ProjectActivity': 'الأنشطة',
      'Activity': 'الأنشطة',
      'Component': 'المكونات',
      'Attachment': 'المرفقات',
      'User': 'المستخدمين',
      'Phase': 'المراحل',
      'Task': 'المهام',
      'Document': 'المستندات',
      'Report': 'التقارير',
      'Dashboard': 'لوحة القيادة'
    };
    return translations[tableName] || tableName;
  };

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      isLoading.value = true;
      const response = await axiosInstance.get('/api/ActionAudit');

      // Process the data to format dates and prepare for display
      logs.value = response.data.map(log => ({
        ...log,
        createdAt: formatDate(log.createdAt),
        // Translate action types to Arabic
        action: translateAction(log.action),
      }));
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Translate action types to Arabic
  const translateAction = (action) => {
    const actionMap = {
      'create': 'إنشاء',
      'update': 'تعديل',
      'delete': 'حذف'
    };
    return actionMap[action] || action;
  };

  // Translate field names to Arabic
  const translateFieldName = (fieldName) => {
    const fieldTranslations = {
      'createdAt': 'تاريخ الإنشاء',
      'isDeleted': 'محذوف',
      'Name': 'الاسم',
      'ComponentId': 'رقم المكون',
      'Notes': 'ملاحظات',
      'TargetPercentage': 'النسبة المستهدفة',
      'id': 'المعرف',
      'description': 'الوصف',
      'title': 'العنوان',
      'status': 'الحالة',
      'startDate': 'تاريخ البدء',
      'endDate': 'تاريخ الانتهاء',
      'projectId': 'رقم المشروع',
      'userId': 'رقم المستخدم',
      'fileName': 'اسم الملف',
      'fileSize': 'حجم الملف',
      'fileType': 'نوع الملف',
      'path': 'المسار',
      'email': 'البريد الإلكتروني',
      'username': 'اسم المستخدم',
      'password': 'كلمة المرور',
      'phoneNumber': 'رقم الهاتف',
      'role': 'الدور',
      'progress': 'التقدم',
      'attachmentId': 'رقم المرفق',
      'activityId': 'رقم النشاط',
      'phaseId': 'رقم المرحلة',
      'updatedAt': 'تاريخ التحديث',
      'deletedAt': 'تاريخ الحذف',
      'isGovernment': 'مشروع حكومي',
      'Lng': 'خط الطول',
      'Lat': 'خط العرض',
      'isDeleted': 'محذوف',
      'isActive': 'مفعل',
      'isPublic': 'عام',
      'isFeatured': 'مميز',
      'FinancialAchievement': 'الانجاز المالي',
      'isFunded': 'ممول',
      'PeriodType': 'نوع الفترة',
      'Duration': 'المدة',
      'projectObjectives': 'أهداف المشروع',
      'ActualStartDate': 'تاريخ بدء المشروع الفعلي',
      'ActualEndDate': 'تاريخ انتهاء المشروع الفعلي',
      'ProjectStatus': 'حالة المشروع',
      'ProjectType': 'نوع المشروع',
      'ProjectCategory': 'تصنيف المشروع',
      'ProjectSubCategory': 'تصنيف المشروع الفرعي',
      
    };
    return fieldTranslations[fieldName] || fieldName;
  };

  // Methods
  const exportToExcel = () => {
    // Implement Excel export functionality
  };

  const viewDetails = (log) => {
    // Create a copy of the log object to avoid mutating the original data
    const processedLog = { ...log };
    
    // Translate the table name
    if (processedLog.tableName) {
      processedLog.tableName = getTableName(processedLog.tableName);
    }
    
    // Translate field names in changes before showing details
    if (processedLog.changes) {
      try {
        let changes = typeof processedLog.changes === 'string' 
          ? JSON.parse(processedLog.changes) 
          : processedLog.changes;
        
        // Transform the changes object to translate field names
        const translatedChanges = {};
        for (const field in changes) {
          translatedChanges[translateFieldName(field)] = changes[field];
        }
        
        processedLog.changes = translatedChanges;
      } catch (error) {
        console.error('Error parsing changes:', error);
      }
    }
    
    selectedLog.value = processedLog;
    showDetailsDialog.value = true;
  };

  // Fetch logs on component mount
  onMounted(() => {
    fetchLogs();
  });
</script>
