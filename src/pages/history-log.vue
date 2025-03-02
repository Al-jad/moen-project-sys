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
            <template #project="{ value }">
              <span class="text-primary dark:text-primary-foreground">{{ value }}</span>
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
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import ViewLogModal from '@/components/ViewLogModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';

  // State
  const showDetailsDialog = ref(false);
  const selectedLog = ref(null);

  // Table configuration
  const columns = [
    { key: 'employee_name', label: 'اسم الموظف' },
    { key: 'project_name', label: 'المشروع' },
    { key: 'date', label: 'تاريخ التعديل' },
    { key: 'time', label: 'وقت التعديل' },
    { key: 'field', label: 'حقل التعديل' },
    { key: 'old_value', label: 'القيمة السابقة' },
    { key: 'new_value', label: 'القيمة الجديدة' },
    { key: 'actions', label: '', type: 'action', icon: 'lucide:eye' },
  ];

  const filters = [
    {
      key: 'project_name',
      placeholder: 'اختر المشروع',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'مشروع A' },
        { value: '2', label: 'مشروع B' },
        { value: '3', label: 'مشروع C' },
      ],
      icon: 'lucide:folder',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'employee_name',
      placeholder: 'اختر الموظف',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'موظف 1' },
        { value: '2', label: 'موظف 2' },
      ],
      icon: 'lucide:user',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  // Mock data - replace with actual API calls
  const logs = ref([
    {
      id: 1,
      employee_name: 'محمد انور',
      project_name: 'اسم المشروع',
      date: '2024/10/25',
      time: '10:33 ص',
      field: 'السعر',
      old_value: '1100$',
      new_value: '52145825',
    },
    {
      id: 2,
      employee_name: 'محمد انور',
      project_name: 'اسم المشروع',
      date: '2024/10/25',
      time: '10:33 ص',
      field: 'السعر',
      old_value: '1100$',
      new_value: '52145825',
    },
    {
      id: 3,
      employee_name: 'محمد انور',
      project_name: 'اسم المشروع',
      date: '2024/10/25',
      time: '10:33 ص',
      field: 'السعر',
      old_value: '1100$',
      new_value: '52145825',
    },
    {
      id: 4,
      employee_name: 'محمد انور',
      project_name: 'اسم المشروع',
      date: '2024/10/25',
      time: '10:33 ص',
      field: 'السعر',
      old_value: '1100$',
      new_value: '52145825',
    },
    {
      id: 5,
      employee_name: 'محمد انور',
      project_name: 'اسم المشروع',
      date: '2024/10/25',
      time: '10:33 ص',
      field: 'السعر',
      old_value: '1100$',
      new_value: '52145825',
    },
  ]);

  // Methods
  const exportToExcel = () => {
    // Implement Excel export functionality
    console.log('Exporting to Excel...');
  };

  const viewDetails = (log) => {
    selectedLog.value = log;
    showDetailsDialog.value = true;
  };
</script>
