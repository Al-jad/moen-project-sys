<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-darkmode">
      <div>
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <BackToMainButton />
            <h1 class="text-xl font-bold dark:text-white">الاجراءات الادارية</h1>
          </div>
        </div>
      </div>
      <div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div class="p-6">
          <div class="w-full">
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
            >
              <template #action="{ item }">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" class="text-gray-400 hover:text-gray-600">
                      <Icon icon="lucide:eye" class="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle class="text-right">
                        <p class="text-xl font-bold">اجراء اداري</p>
                      </DialogTitle>
                    </DialogHeader>
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
                  </DialogContent>
                </Dialog>
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
  import CustomTable from '@/components/CustomTable.vue';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
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

  const handleCellClick = ({ key, item }) => {
    if (key === 'employee') {
      console.log('Employee clicked:', item.employee);
    } else if (key === 'project') {
      console.log('Project clicked:', item.project);
    }
  };

  const showDetails = (item) => {
    console.log('Details shown for:', item);
  };

  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters);
  };

  const handleSearchChange = (query) => {
    console.log('Search query:', query);
  };

  const handleDateChange = (date) => {
    console.log('Date range:', date);
  };

  const handleExport = () => {
    console.log('Export clicked');
  };
</script>
