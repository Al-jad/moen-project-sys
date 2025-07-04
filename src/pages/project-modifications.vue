<template>
  <DefaultLayout>
    <main class="min-h-screen bg-background p-6">
      <div>
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <BackToMainButton />
            <h1 class="text-xl font-bold text-foreground">الاجراءات الادارية</h1>
          </div>
        </div>
      </div>

      <!-- Notification Banner -->
      <Premium />

      <div class="relative rounded-lg bg-background-surface shadow-sm">
        <div class="absolute inset-0 z-10 cursor-not-allowed"></div>
        <div class="p-6">
          <div class="pointer-events-auto w-full">
            <CustomTable
              :columns="columns"
              :filters="filters"
              :data="tableData"
              @cell-click="handleCellClick"
              @action-click="showDetails"
              @filter-change="handleFilterChange"
              @search-change="handleSearchChange"
              @date-change="handleDateChange"
              @export="handleExport"
              :is-export-premium="true"
            >
              <template #action="{ item }">
                <BaseModal :open="isModalOpen" @update:open="isModalOpen = $event">
                  <template #trigger>
                    <PrimaryButton
                      icon="lucide:eye"
                      variant="ghost"
                      size="icon"
                      class="text-foreground-muted"
                      @click="isModalOpen = true"
                    />
                  </template>
                  <template #title>
                    <p class="text-xl font-bold">اجراء اداري</p>
                  </template>
                  <div class="grid gap-y-4 py-4">
                    <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span class="text-right text-gray-500">تاريخ اخر تعديل</span>
                      <span>{{ item.modificationDate }} @ {{ item.modificationTime }}</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span class="text-right text-gray-500">الموظف</span>
                      <span>{{ item.employee }}</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span class="text-right text-gray-500">المشروع</span>
                      <span>{{ item.project }}</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                      <span class="text-right text-gray-500">الحقل</span>
                      <span>{{ item.field }}</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                      <span class="text-right text-gray-500">القيمة السابقة</span>
                      <p class="text-sm leading-6">{{ item.oldValue }}</p>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] items-start gap-4">
                      <span class="text-right text-gray-500">القيمة الحالية</span>
                      <p class="text-sm leading-6">{{ item.newValue }}</p>
                    </div>
                  </div>
                </BaseModal>
              </template>
            </CustomTable>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import BaseModal from '@/components/BaseModal.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import Premium from '@/components/Premium.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  interface Column {
    key: string;
    label: string;
    type?: 'button' | 'text' | 'action';
  }

  interface Filter {
    key: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    icon: string;
    triggerClass: string;
  }

  const route = useRoute();
  const router = useRouter();
  const projectId = computed(() => route.params.id);
  const selectedProject = ref('all');
  const selectedEmployee = ref('all');

  // Table Columns Configuration
  const columns: Column[] = [
    { key: 'employee', label: 'اسم الموظف', type: 'button' },
    { key: 'project', label: 'المشروع', type: 'button' },
    { key: 'modificationDate', label: 'تاريخ التعديل' },
    { key: 'modificationTime', label: 'وقت التعديل' },
    { key: 'field', label: 'حقل التعديل' },
    { key: 'oldValue', label: 'القيمة السابقة' },
    { key: 'newValue', label: 'القيمة الجديدة' },
    { key: 'actions', label: '', type: 'action' },
  ];

  // Table Filters Configuration
  const filters: Filter[] = [
    {
      key: 'project',
      placeholder: 'اختر المشروع',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'اسم المشروع' },
      ],
      icon: 'lucide:folder',
      triggerClass: 'dark:bg-gray-800 flex-row-reverse dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'employee',
      placeholder: 'اختر الموظف',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'محمد انور' },
      ],
      icon: 'lucide:user-circle',
      triggerClass: 'dark:bg-gray-800 flex-row-reverse dark:text-gray-300 dark:border-gray-700',
    },
  ];

  const df = new DateFormatter('ar', { dateStyle: 'medium' });
  const date = ref<DateRange>();

  const dateRangeText = computed(() => {
    if (!date.value?.start) return '';

    if (!date.value?.end) {
      return df.format(date.value.start.toDate(getLocalTimeZone()));
    }

    return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(
      date.value.end.toDate(getLocalTimeZone())
    )}`;
  });

  const tableData = ref([
    {
      id: 1,
      employee: 'محمد انور',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 2,
      employee: 'دعاء الشيخلي',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 1,
      employee: 'محمد انور',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 2,
      employee: 'دعاء الشيخلي',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 1,
      employee: 'محمد انور',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 2,
      employee: 'دعاء الشيخلي',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 1,
      employee: 'محمد انور',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
    {
      id: 2,
      employee: 'دعاء الشيخلي',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$',
    },
  ]);

  const handleCellClick = ({ key, item }: { key: string; item: any }) => {
    if (key === 'employee') {
    } else if (key === 'project') {
    }
  };

  const showDetails = (item: any) => {};

  const handleFilterChange = (filters: any) => {};

  const handleSearchChange = (query: any) => {};

  const handleDateChange = (date: any) => {};

  const handleExport = () => {};

  const isModalOpen = ref(false);
</script>
