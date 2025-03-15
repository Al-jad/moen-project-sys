<template>
  <DefaultLayout>
    <main class="max-w-screen min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div>
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <BackToMainButton />
            <h1 class="text-xl font-bold dark:text-white"> الاجراءات التنفيذية </h1>
          </div>
          <div class="flex items-center gap-6">
            <PrimaryButton @click="showEditModal = true">
              <Icon icon="lucide:circle-plus" class="h-4 w-4" />
              اضافة إجراء تنفيذي
            </PrimaryButton>
          </div>
        </div>
      </div>
      <div class="mb-4 rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <div class="w-full overflow-x-auto">
            <CustomTable
              :columns="columns"
              :data="actions"
              :filters="filters"
              @export="exportToExcel"
              @action-click="handleViewAction"
            >
              <template #name="{ value }">
                <PrimaryButton variant="ghost" class="h-auto p-0">
                  {{ value }}
                </PrimaryButton>
              </template>
            </CustomTable>
          </div>
        </div>
      </div>
    </main>
    <ViewActionModal
      v-model:open="showViewModal"
      :action="selectedAction"
      @submit="handleSubmitAction"
    />
    <AddEditActionModal v-model:open="showEditModal" @submit="handleSubmitAction" />
  </DefaultLayout>
</template>

<script setup lang="ts">
  import AddEditActionModal from '@/components/AddEditActionModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ViewActionModal from '@/components/ViewActionModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const projectId = computed(() => route.params.id);
  const selectedProject = ref('all');
  const page = ref(1);
  const totalPages = ref(10);

  const df = new DateFormatter('ar', { dateStyle: 'medium' });
  const date = ref<DateRange>();

  const dateRangeText = computed(() => {
    if (!date.value?.start) return '';

    if (!date.value?.end) {
      return df.format(date.value.start.toDate(getLocalTimeZone()));
    }

    return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(date.value.end.toDate(getLocalTimeZone()))}`;
  });

  const selectedEmployee = ref('all');

  const showViewModal = ref(false);
  const selectedAction = ref(null);

  const handleViewAction = (action) => {
    selectedAction.value = action;
    showViewModal.value = true;
  };

  const showEditModal = ref(false);

  const handleEditAction = (action) => {
    selectedAction.value = action;
    showEditModal.value = true;
  };

  const handleSubmitAction = (formData) => {
    // Handle form submission here
  };

  // Table configuration
  interface Column {
    key: string;
    label: string;
    type?: 'button' | 'action' | 'text';
    icon?: any;
  }

  const columns: Column[] = [
    { key: 'name', label: 'اسم الاجراء', type: 'button' },
    { key: 'projectName', label: 'المشروع', type: 'text' },
    { key: 'contractNumber', label: 'العقد', type: 'text' },
    { key: 'weight', label: 'وزن الاجراء', type: 'text' },
    { key: 'duration', label: 'مدة الاجراء يوم', type: 'text' },
    { key: 'startDate', label: 'تاريخ بداية تنفيذ', type: 'text' },
    { key: 'plannedTechnicalProgress', label: 'نسبة الانجاز الفني المخطط', type: 'text' },
    { key: 'actualTechnicalProgress', label: 'نسبة الانجاز الفني الفعلي', type: 'text' },
    { key: 'technicalDeviation', label: 'نسبة الانحراف الفني', type: 'text' },
    { key: 'plannedFinancialProgress', label: 'نسبة الانجاز المالي المخطط', type: 'text' },
    { key: 'actualFinancialProgress', label: 'نسبة الانجاز المالي الفعلي', type: 'text' },
    { key: 'actions', label: '', type: 'action', icon: 'lucide:eye' },
  ];

  const filters = [
    {
      key: 'projectName',
      placeholder: 'اختر المشروع',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'اسم المشروع' },
      ],
      icon: 'lucide:folder',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'contractNumber',
      placeholder: 'اختر العقد',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'العقد 1' },
      ],
      icon: 'lucide:file-text',
      triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  // Mock data
  const actions = ref(
    Array(9)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        name: index % 2 === 0 ? 'التنصيب' : 'التشغيل',
        projectName: index % 2 === 0 ? 'مشروع A' : 'مشروع B',
        contractNumber: index % 2 === 0 ? 'عقد رقم 2023/157' : 'عقد رقم 2023/158',
        weight: index % 2 === 0 ? '25' : '54',
        duration: index % 2 === 0 ? '30' : '20',
        startDate: index % 2 === 0 ? '20.03.2025' : '15.03.2025',
        plannedTechnicalProgress: index % 2 === 0 ? '50%' : '75%',
        actualTechnicalProgress: index % 2 === 0 ? '45%' : '70%',
        technicalDeviation: index % 2 === 0 ? '5%' : '5%',
        plannedFinancialProgress: index % 2 === 0 ? '40%' : '60%',
        actualFinancialProgress: index % 2 === 0 ? '35%' : '55%',
      }))
  );

  const exportToExcel = () => {
    // Implement export to Excel functionality
  };
</script>

<style scoped></style>
