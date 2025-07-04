<template>
  <DefaultLayout>
    <main class="min-h-screen bg-background p-6">
      <div class="rounded-xl border border-border bg-card shadow-lg">
        <div class="p-8">
          <div class="mb-8 border-b border-border pb-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <BackToMainButton />
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">سجل الاحداث</h1>
                </div>
                <p class="text-foreground-muted">عرض وتتبع جميع العمليات في النظام</p>
              </div>
            </div>
          </div>
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="logs"
            :filters="filters"
            :showDateFilter="true"
            :isPremium="true"
            :showSearch="true"
            :showExport="true"
            :loading="isLoading"
            @export="exportToExcel"
            @action-click="viewDetails"
          >
            <template #tableName="{ item }">
              <span class="text-primary dark:text-gray-300">{{
                getTableName(item.tableName)
              }}</span>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- View Details Dialog -->
      <ViewLogModal v-if="selectedLog" v-model:open="showDetailsDialog" :log="selectedLog" />
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import ViewLogModal from '@/components/ViewLogModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { getTableName } from '@/services/logService';
  import { useLogStore } from '@/stores/useLogStore';
  import type { LogColumn, LogFilter, LogTableItem } from '@/types/logs';
  import { exportToExcel as exportDataToExcel } from '@/utils/excel';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';

  // Initialize store
  const logStore = useLogStore();
  const { logs, isLoading, selectedLog } = storeToRefs(logStore);

  // State
  const showDetailsDialog = ref(false);
  const tableRef = ref();

  // Table configuration
  const columns: LogColumn[] = [
    { key: 'id', label: 'رقم العملية', type: 'text' },
    { key: 'tableName', label: 'اسم الجدول', type: 'text' },
    { key: 'action', label: 'نوع العملية', type: 'text' },
    { key: 'createdAt', label: 'تاريخ العملية', type: 'text' },
    { key: 'actions', label: '', type: 'action', icon: 'lucide:eye' },
  ];

  const filters: LogFilter[] = [
    {
      key: 'tableName',
      placeholder: 'اختر الجدول',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'Project', label: 'المشاريع' },
        { value: 'Attachment', label: 'المرفقات' },
        { value: 'AppUser', label: 'المستخدمين' },
        { value: 'Activity', label: 'الأنشطة' },
        { value: 'Component', label: 'المكونات' },
        { value: 'Beneficiary', label: 'الجهات المستفيدة' },
      ],
      icon: 'lucide:folder',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'action',
      placeholder: 'نوع العملية',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'إنشاء', label: 'إنشاء' },
        { value: 'تعديل', label: 'تعديل' },
        { value: 'حذف', label: 'حذف' },
      ],
      icon: 'lucide:activity',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  // Methods
  const exportToExcel = () => {
    const formattedData = logs.value.map((log) => ({
      'رقم العملية': log.id || '',
      'اسم الجدول': getTableName(log.tableName) || 'غير محدد',
      'نوع العملية': log.action || '',
      'تاريخ العملية': log.createdAt || '',
      'اسم المستخدم': log.user?.name || 'غير معروف',
    }));

    exportDataToExcel(formattedData, {
      fileName: 'سجل الاحداث.xlsx',
      sheetName: 'سجل الاحداث',
      locale: 'ar',
      dateFormat: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    });
  };

  const viewDetails = (_action: string, row: Record<string, any>) => {
    const logItem = row as unknown as LogTableItem;
    logStore.setSelectedLog({
      id: logItem.id,
      tableName: logItem.tableName,
      tableRowId: logItem.tableRowId || '',
      action: logItem.originalAction,
      createdAt: logItem.createdAt,
      changes: logItem.changes,
      user: logItem.user,
      details: logItem.details || [],
    });
    showDetailsDialog.value = true;
  };

  // Fetch logs on component mount
  onMounted(() => {
    logStore.fetchLogs();
  });
</script>
