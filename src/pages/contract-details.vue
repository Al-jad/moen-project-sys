<template>
  <DefaultLayout>
    <main class="bg-gray-200 p-6 dark:bg-gray-900">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-start gap-2">
        <BackButton />
        <h1 class="text-xl font-medium">صفحة تفاصيل العقد</h1>
      </div>

      <!-- Contract Details Card -->
      <div class="rounded-lg bg-white dark:border dark:border-gray-700 dark:bg-gray-800">
        <!-- Basic Info -->
        <div class="border-b dark:border-gray-700">
          <div class="p-6">
            <div class="grid grid-cols-[auto_1fr] gap-x-12 gap-y-4 text-right">
              <div class="text-gray-500 dark:text-gray-400">اسم المشروع</div>
              <div class="mr-4">{{ contract.projectName }}</div>

              <div class="text-gray-500 dark:text-gray-400">الجهة المنفذة للعقد</div>
              <div class="mr-4">{{ contract.company }}</div>

              <div class="text-gray-500 dark:text-gray-400">كلفة العقد</div>
              <div class="mr-4">{{ contract.amount }} دينار عراقي</div>

              <div class="text-gray-500 dark:text-gray-400">تاريخ الاحالة</div>
              <div class="mr-4">{{ contract.referralDate }}</div>

              <div class="text-gray-500 dark:text-gray-400">تاريخ توقيع العقد</div>
              <div class="mr-4">{{ contract.signDate }}</div>

              <div class="text-gray-500 dark:text-gray-400">رقم العقد</div>
              <div class="mr-4">{{ contract.number }}</div>
            </div>
          </div>
        </div>

        <!-- Execution Procedures -->
        <div class="p-6">
          <div class="mb-4 flex justify-between">
            <h2 class="text-lg font-medium">الاجراءات التنفيذية (٥)</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <PrimaryButton variant="ghost" size="icon" class="h-8 w-8" @click="openAddModal">
                  <Icon icon="lucide:plus" class="h-4 w-4" />
                </PrimaryButton>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                class="bg-white dark:border dark:border-gray-700 dark:bg-gray-800"
              >
                <p>اضافة اجراء جديد</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div class="grid w-[101.2%] grid-cols-1 gap-4">
            <ExecutionProcedure
              v-for="(procedure, index) in executionProcedures"
              :key="procedure.id"
              :procedure="procedure"
              :title="getTitle(index + 1)"
              @edit="openEditModal(procedure)"
            />
          </div>
        </div>
      </div>
    </main>

    <EditProcedureModal
      v-model:isOpen="isModalOpen"
      :procedure="selectedProcedure"
      :isEdit="!!selectedProcedure"
      :contractInfo="{
        name: 'عقد تجهيز محطات المراقبة 25 لسنة 2025',
        project: contract.projectName,
      }"
      @save="handleSave"
    />
  </DefaultLayout>
</template>

<script setup>
  import BackButton from '@/components/BackButton.vue';
  import EditProcedureModal from '@/components/EditProcedureModal.vue';
  import ExecutionProcedure from '@/components/ExecutionProcedure.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const contractId = route.params.id;

  // Mock data - replace with actual API call
  const contract = ref({
    projectName: 'مشروع A',
    company: 'شركة المتحدة للبرامجيات',
    amount: '125487',
    referralDate: '15.01.2025',
    signDate: '25.02.2025',
    number: '152 / و / ي',
  });

  const executionProcedures = ref([
    {
      id: 1,
      name: 'عملية التنصيب',
      weight: 27,
      duration: 67,
      startDate: '25.02.2025',
      plannedTechnicalProgress: 68,
      actualTechnicalProgress: 57,
      technicalDeviation: 33,
      plannedFinancialProgress: 68,
      actualFinancialProgress: 98,
    },
    {
      id: 2,
      name: 'التدريب خارج العراق',
      weight: 27,
      duration: 67,
      startDate: '25.02.2025',
      plannedTechnicalProgress: 68,
      actualTechnicalProgress: 57,
      technicalDeviation: 33,
      plannedFinancialProgress: 68,
      actualFinancialProgress: 98,
    },
  ]);

  const getTitle = (index) => {
    const titles = [
      'الاجراء الاول',
      'الاجراء الثاني',
      'الاجراء الثالث',
      'الاجراء الرابع',
      'الاجراء الخامس',
    ];
    return titles[index - 1];
  };

  const isModalOpen = ref(false);
  const selectedProcedure = ref(null);

  const openAddModal = () => {
    selectedProcedure.value = null;
    isModalOpen.value = true;
  };

  const openEditModal = (procedure) => {
    selectedProcedure.value = procedure;
    isModalOpen.value = true;
  };

  const handleSave = (formData) => {
    if (selectedProcedure.value) {
      // Edit existing procedure
      const index = executionProcedures.value.findIndex((p) => p.id === selectedProcedure.value.id);
      if (index !== -1) {
        executionProcedures.value[index] = {
          ...executionProcedures.value[index],
          ...formData,
        };
      }
    } else {
      // Add new procedure
      executionProcedures.value.push({
        id: Date.now(),
        ...formData,
        plannedTechnicalProgress: 0,
        technicalDeviation: 0,
        plannedFinancialProgress: 0,
        actualFinancialProgress: 0,
      });
    }
  };
</script>
