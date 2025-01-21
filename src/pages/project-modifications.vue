<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-gray-200">
      <div>
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-6">
              <PrimaryButton
                variant="link"
                @click="$router.back()"
              >
                <ArrowRight class="w-4 h-4" />
                الرئيسية
              </PrimaryButton>
              <h1 class="text-xl font-bold">الاجراءات الادارية</h1>
            </div>
          </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm ">
        <div class="p-6">
          <div class="w-full">
            <CustomTable
              :columns="[
                { key: 'employee', label: 'اسم الموظف', type: 'button' },
                { key: 'project', label: 'المشروع', type: 'button' },
                { key: 'modificationDate', label: 'تاريخ التعديل' },
                { key: 'modificationTime', label: 'وقت التعديل' },
                { key: 'field', label: 'حقل التعديل' },
                { key: 'oldValue', label: 'القيمة السابقة' },
                { key: 'newValue', label: 'القيمة الجديدة' },
                { key: 'actions', label: '', type: 'action' }
              ]"
              :filters="[
                {
                  key: 'project',
                  placeholder: 'اختر المشروع',
                  options: [
                    { value: 'all', label: 'الكل' },
                    { value: '1', label: 'اسم المشروع' }
                  ],
                  icon: Folder
                },
                {
                  key: 'employee',
                  placeholder: 'اختر الموظف',
                  options: [
                    { value: 'all', label: 'الكل' },
                    { value: '1', label: 'محمد انور' }
                  ],
                  icon: UserCircle
                }
              ]"
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
                      <Eye class="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle class="text-right">
                        <p class="text-xl font-bold">اجراء اداري</p>
                      </DialogTitle>
                    </DialogHeader>
                    <div class="grid py-4 gap-y-4">
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
  import { ref, computed } from 'vue';
  import type { DateRange } from 'radix-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    UserCircle,
    Folder,
    Calendar as CalendarIcon,
    Eye,
    ArrowRight,
    FileSpreadsheet,
  } from 'lucide-vue-next';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
  import CustomTable from '@/components/CustomTable.vue'
  import PrimaryButton from '@/components/PrimaryButton.vue'
  import { Button } from '@/components/ui/button'
  import { Popover, PopoverTrigger } from '@/components/ui/popover'

  const route = useRoute();
  const router = useRouter();
  const projectId = computed(() => route.params.id);
  const selectedProject = ref('all');
  const selectedEmployee = ref('all');

  const df = new DateFormatter('ar', { dateStyle: 'medium' });
  const date = ref<DateRange>();

  const dateRangeText = computed(() => {
    if (!date.value?.start) return '';

    if (!date.value?.end) {
      return df.format(date.value.start.toDate(getLocalTimeZone()));
    }

    return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(date.value.end.toDate(getLocalTimeZone()))}`;
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
      newValue: '5214582$'
    },
    {
      id: 2,
      employee: 'دعاء الشيخلي',
      project: 'تجهيز أجهزة ومعدات مراقبة المياه',
      modificationDate: '2024/10/25',
      modificationTime: '10:33 ص',
      field: 'السعر',
      oldValue: '1100$',
      newValue: '5214582$'
    }
  ])

  const handleCellClick = ({ key, item }) => {
    if (key === 'employee') {
      // Handle employee click
      console.log('Employee clicked:', item.employee)
    } else if (key === 'project') {
      // Handle project click
      console.log('Project clicked:', item.project)
    }
  }

  const showDetails = (item) => {
    // The dialog is now handled in the template through the slot
    console.log('Details shown for:', item)
  }

  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters)
  }

  const handleSearchChange = (query) => {
    console.log('Search query:', query)
  }

  const handleDateChange = (date) => {
    console.log('Date range:', date)
  }

  const handleExport = () => {
    console.log('Export clicked')
  }
</script>