<template>
  <DefaultLayout>
    <main class="bg-gray-50 p-6 dark:bg-darkmode">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <BackToMainButton />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">العقود</h1>
        </div>
      </div>

      <!-- Notification Banner -->
      <Premium />

      <!-- Controls Container -->
      <div
        class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
      >
        <div class="mb-6 flex items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <PrimaryButton size="lg" class="px-2">
              <Icon icon="lucide:file-spreadsheet" class="ml-2 h-4 w-4" />
              تصدير Excel
            </PrimaryButton>

            <div class="min-w-[200px]">
              <CustomSelect
                v-model="selectedProject"
                :options="[
                  { value: 'all', label: 'الكل' },
                  ...projects.map((p) => ({ value: p.id, label: p.name })),
                ]"
                placeholder="اختر المشروع"
                :triggerClass="'flex flex-row-reverse w-full'"
                icon="lucide:folder"
              />
            </div>

            <div class="min-w-[200px]">
              <CustomSelect
                v-model="selectedContract"
                :options="[
                  { value: 'all', label: 'الكل' },
                  ...contractsList.map((c) => ({ value: c.id, label: c.name })),
                ]"
                placeholder="اختر العقد"
                :triggerClass="'flex flex-row-reverse w-full'"
                icon="lucide:file-text"
              />
            </div>

            <DateInput class="flex-row" v-model="date" placeholder="اختر التاريخ" />
          </div>

          <!-- Search -->
          <div class="relative min-w-[240px]">
            <FormField>
              <div class="relative">
                <CustomInput v-model="searchQuery" placeholder="بحث سريع" icon="lucide:search" />
              </div>
            </FormField>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="space-y-3">
          <ContractCard
            v-for="contract in filteredContracts"
            :key="contract.id"
            :contract="contract"
            @show-details="$router.push(`/contract-details/${contract.id}`)"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-center">
          <Pagination :totalPages="totalPages" :currentPage="currentPage" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import ContractCard from '@/components/ContractCard.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import Premium from '@/components/Premium.vue';
  import Pagination from '@/components/CustomPagination.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { DateFormatter } from '@internationalized/date';
  import { format } from 'date-fns';
  import { ar } from 'date-fns/locale';
  import { computed, ref } from 'vue';

  interface Project {
    id: string;
    name: string;
  }

  interface ContractListItem {
    id: string;
    name: string;
  }

  interface Contract {
    id: number;
    number: string;
    company: string;
    amount: number;
    signDate: string;
    referralDate: string;
    changeOrders: number;
    projectId?: string;
  }

  const searchQuery = ref('');
  const currentPage = ref(1);
  const selectedProject = ref<string>('all');
  const selectedContract = ref<string>('all');
  const date = ref<string | null>(null);
  const itemsPerPage = 7;

  const df = new DateFormatter('ar', { dateStyle: 'medium' });

  const dateRangeText = computed(() => {
    if (!date.value) return '';
    return df.format(new Date(date.value));
  });

  // Mock data for dropdowns
  const projects = ref<Project[]>([
    { id: '1', name: 'مشروع A' },
    { id: '2', name: 'مشروع B' },
    { id: '3', name: 'مشروع C' },
  ]);

  const contractsList = ref<ContractListItem[]>([
    { id: '1', name: 'عقد A' },
    { id: '2', name: 'عقد B' },
    { id: '3', name: 'عقد C' },
  ]);

  // Update the contracts data with projectId
  const contracts = ref<Contract[]>([
    {
      id: 1,
      number: '23/2025',
      company: 'شركة الاتحاد الجاد للبرمجيات',
      amount: 23333000,
      signDate: '8/07/2025',
      referralDate: '6/07/2025',
      changeOrders: 6,
      projectId: '1',
    },
    {
      id: 2,
      number: '24/2025',
      company: 'شركة الاتحاد الجاد للبرمجيات',
      amount: 23333000,
      signDate: '8/07/2025',
      referralDate: '6/07/2025',
      changeOrders: 6,
      projectId: '2',
    },
    {
      id: 3,
      number: '25/2025',
      company: 'شركة الاتحاد الجاد للبرمجيات',
      amount: 23333000,
      signDate: '8/07/2025',
      referralDate: '6/07/2025',
      changeOrders: 6,
      projectId: '3',
    },
  ]);

  // Methods
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ar });
  };

  const getProjectName = (id) => {
    const project = projects.value.find((p) => p.id === id);
    return project ? project.name : '';
  };

  const getContractName = (id) => {
    const contract = contractsList.value.find((c) => c.id === id);
    return contract ? contract.name : '';
  };

  // Update the filteredContracts computed to handle type checking
  const filteredContracts = computed(() => {
    let filtered = contracts.value;

    if (searchQuery.value) {
      const searchTerm = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (contract) =>
          contract.number.toLowerCase().includes(searchTerm) ||
          contract.company.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedProject.value !== 'all') {
      filtered = filtered.filter((contract) => contract.projectId === selectedProject.value);
    }

    if (selectedContract.value !== 'all') {
      filtered = filtered.filter((contract) => contract.id === Number(selectedContract.value));
    }

    if (date.value) {
      const selectedDate = new Date(date.value).toISOString().split('T')[0];
      filtered = filtered.filter((contract) => {
        const contractDate = new Date(contract.signDate).toISOString().split('T')[0];
        return contractDate === selectedDate;
      });
    }

    return filtered;
  });

  const totalPages = computed(() => {
    const total = Math.ceil(filteredContracts.value.length / itemsPerPage);
    return total > 0 ? total : 1;
  });
</script>

<style scoped>
  .rtl {
    direction: rtl;
  }
</style>
