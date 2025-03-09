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
            @export="exportToExcel"
            @action-click="viewDetails"
          >
            <template #tableName="{ value }">
              <span class="text-primary dark:text-gray-300">{{ value || 'غير محدد' }}</span>
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

  // Methods
  const exportToExcel = () => {
    // Implement Excel export functionality
    console.log('Exporting to Excel...');
  };

  const viewDetails = (log) => {
    selectedLog.value = log;
    showDetailsDialog.value = true;
  };

  // Fetch logs on component mount
  onMounted(() => {
    fetchLogs();
  });
</script>
