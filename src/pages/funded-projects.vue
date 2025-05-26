<template>
  <DefaultLayout>
    <div class="flex min-h-screen">
      <div class="border-r border-border bg-background-surface">
        <ProjectsFilter
          :isFundedProjects="true"
          :showFundingTypeFilter="false"
          @filter-applied="applyFilters"
          :searchQuery="searchQuery"
          :budgetRange="budgetRange"
          :selectedStatus="selectedStatus"
          :selectedBeneficiaries="selectedBeneficiaries"
          :showGovernmentProjects="showGovernmentProjects"
          :beneficiaries="beneficiaries"
          :selectedCurrency="selectedCurrency"
          @currency-changed="handleCurrencyChange"
        />
      </div>
      <div class="flex-1 bg-background">
        <div class="p-6 lg:p-8">
          <div class="w-full mx-auto space-y-8 max-w-7xl">
            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-lg bg-primary/10">
                    <Icon icon="lucide:building-2" class="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 class="text-3xl font-bold text-foreground">المشاريع الممولة</h1>
                    <p class="text-foreground-muted">إدارة ومتابعة جميع المشاريع الممولة</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-foreground-muted">العملة:</span>
                  <CustomSelect
                    v-model="selectedCurrency"
                    :options="currencyOptions"
                    placeholder="اختر العملة"
                    :triggerClass="'w-32'"
                    icon="lucide:currency-dollar"
                    @update:model-value="handleCurrencyChange"
                  />
                </div>
              </div>
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <BaseStatsCard
                  icon="lucide:folders"
                  :value="filteredProjects.length"
                  label="اجمالي المشاريع"
                  color="blue"
                />
                <BaseStatsCard
                  icon="lucide:target"
                  :value="getTotalComponents"
                  label="اجمالي المكونات"
                  color="green"
                />
                <BaseStatsCard
                  icon="lucide:list-todo"
                  :value="getTotalActivitiesAll"
                  label="اجمالي الفعاليات"
                  color="purple"
                />
                <BaseStatsCard
                  icon="lucide:dollar-sign"
                  :value="formattedTotalCost"
                  label="اجمالي التمويل"
                  color="amber"
                />
              </div>
            </div>
            <div class="border shadow-sm rounded-xl border-border bg-background-surface">
              <div class="p-6 border-b border-border">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-foreground">قائمة المشاريع</h2>
                    <Badge class="px-3 py-1 bg-primary/10 text-primary">
                      {{ filteredProjects.length }} من {{ projects.length }} مشروع
                    </Badge>
                  </div>
                  <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                      <CustomDrop
                        :items="sortOptions"
                        label="ترتيب"
                        icon="lucide:align-left"
                        variant="outline"
                        @select="handleSortSelect"
                      />
                      <div
                        v-if="selectedSort"
                        class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-background-hover text-foreground-muted"
                      >
                        <span>{{ getSelectedSortLabel }}</span>
                        <button
                          class="p-1 transition-colors rounded-full hover:bg-background-hover"
                          @click="clearSort"
                        >
                          <Icon icon="lucide:x" class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <PrimaryButton variant="destructive" @click="OpenPremiumModal">
                        <Icon icon="lucide:lock" class="w-4 h-4" />
                        طباعة
                      </PrimaryButton>
                      <RouterLink to="/add-funded-project">
                        <PrimaryButton variant="primary">
                          <Icon icon="lucide:plus" class="w-4 h-4" />
                          <span>اضافة مشروع جديد</span>
                        </PrimaryButton>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <div
                    v-for="n in 6"
                    :key="n"
                    class="rounded-lg h-80 animate-pulse bg-background-hover"
                  />
                </div>
                <div v-else>
                  <div
                    v-if="projects.length === 0"
                    class="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg border-border"
                  >
                    <div class="p-4 mb-4 rounded-full bg-background-hover">
                      <Icon icon="lucide:folder-open" class="w-10 h-10 text-foreground-muted" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد مشاريع</h3>
                    <p class="max-w-sm mb-6 text-foreground-muted">
                      قم بإضافة مشروع جديد للبدء في إدارة المشاريع الممولة
                    </p>
                    <RouterLink to="/add-funded-project">
                      <PrimaryButton variant="primary" size="sm">
                        <Icon icon="lucide:plus" class="w-4 h-4" />
                        اضافة مشروع
                      </PrimaryButton>
                    </RouterLink>
                  </div>
                  <div
                    v-else-if="filteredProjects.length === 0"
                    class="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg border-border"
                  >
                    <div class="p-4 mb-4 rounded-full bg-background-hover">
                      <Icon icon="lucide:search-x" class="w-10 h-10 text-foreground-muted" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-foreground">
                      لا توجد نتائج تطابق الفلتر
                    </h3>
                    <p class="max-w-sm mb-6 text-foreground-muted">
                      حاول تعديل معايير الفلتر أو قم بإلغاء الفلتر لعرض جميع المشاريع.
                    </p>
                  </div>
                  <div v-else class="space-y-6">
                    <div class="grid grid-cols-1 gap-6">
                      <FundedProjectCard
                        v-for="project in paginatedProjects"
                        :key="project.id"
                        :project="project"
                        :selectedCurrency="selectedCurrency"
                        @attachment-added="fetchProjects"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination at bottom of container -->
              <div
                v-if="filteredProjects.length > 0"
                class="px-6 py-4 border-t border-border bg-background-surface"
              >
                <div class="flex justify-center">
                  <CustomPagination
                    v-model="currentPage"
                    :total="filteredProjects.length"
                    :per-page="itemsPerPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PremiumModal v-model:open="showPremiumModal" @close="showPremiumModal = false" />
  </DefaultLayout>
</template>
<script setup lang="ts">
  import BaseStatsCard from '@/components/BaseStatsCard.vue';
  import CustomDrop from '@/components/CustomDrop.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import { useBeneficiaries } from '@/composables/useBeneficiaries';
  import { useToast } from '@/composables/useToast';
  import { UNITS } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import { formatTotalCost } from '@/utils/formatCost';
  import {
    getSelectedSortLabel as getSortLabel,
    handleSort as handleSortUtil,
    sortOptions,
  } from '@/utils/sortUtils';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const fundedProjectStore = useFundedProjectStore();
  const projects = computed(() => fundedProjectStore.projects);
  const filteredProjects = computed(() => fundedProjectStore.filteredProjects);
  const isLoading = computed(() => fundedProjectStore.loading);
  const error = computed(() => fundedProjectStore.error);

  const router = useRouter();
  const route = useRoute();
  const showPremiumModal = ref(false);
  const currentPage = ref(1);
  const itemsPerPage = ref(6);

  // Use the beneficiaries composable
  const {
    beneficiaries,
    selectedBeneficiaries,
    fetchBeneficiaries,
    filterByBeneficiaries,
    resetBeneficiarySelection,
  } = useBeneficiaries();

  const selectedSort = ref('');

  const handleSort = (sortId: string) => {
    selectedSort.value = sortId;
    const sortedProjects = handleSortUtil(filteredProjects.value, sortId);
    if (sortedProjects) {
      fundedProjectStore.$patch((state) => {
        state.filteredProjects = sortedProjects;
      });
    }
  };

  const handleSortSelect = (item: { id: string }) => {
    handleSort(item.id);
  };

  const getSelectedSortLabel = computed(() => getSortLabel(selectedSort.value));

  const clearSort = () => {
    selectedSort.value = '';
    fetchProjects();
  };

  const showGovernmentProjects = ref(route.query.showGovernmentProjects === 'true');
  const selectedStatus = ref({
    all: !route.query.status,
    completed: route.query.status === '2',
    inProgress: route.query.status === '1',
    delayed: route.query.status === '3',
    cancelled: route.query.status === '0',
  });

  const minMaxBudgetRange = computed((): [number, number] => {
    if (!projects.value.length) return [0, 0];
    const costs = projects.value.map((project) => project.cost).filter((cost) => cost > 0);
    if (!costs.length) return [0, 0];
    return [Math.floor(Math.min(...costs)), Math.ceil(Math.max(...costs))];
  });

  const searchQuery = ref('');
  const budgetRange = ref<[number, number]>(minMaxBudgetRange.value);
  const isBudgetFilterEnabled = ref(false);
  const selectedCurrency = ref(localStorage.getItem('selectedCurrency') || 'IQD');

  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];

  const { showSuccess } = useToast();

  const applyFilters = (filters: {
    searchQuery?: string;
    budgetRange?: number[];
    selectedStatus: {
      all: boolean;
      completed: boolean;
      inProgress: boolean;
      delayed: boolean;
      cancelled: boolean;
    };
    selectedBeneficiaries: Record<string, boolean>;
    showGovernmentProjects: boolean;
    isBudgetFilterEnabled: boolean;
  }) => {
    let result = [...projects.value];

    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        return (
          (project.title && project.title.toLowerCase().includes(query)) ||
          (project.department && project.department.toLowerCase().includes(query)) ||
          (project.status && project.status.toLowerCase().includes(query)) ||
          (project.id && project.id.toString().includes(query))
        );
      });
    }

    if (filters.isBudgetFilterEnabled && filters.budgetRange?.length === 2) {
      const [minBudget, maxBudget] = filters.budgetRange;
      result = result.filter((project) => {
        const cost = project.cost || 0;
        return cost >= minBudget && cost <= maxBudget;
      });
    }

    if (filters.selectedStatus && !filters.selectedStatus.all) {
      result = result.filter((project) => {
        const statusMap = {
          completed: '2',
          inProgress: '1',
          delayed: '3',
          cancelled: '0',
        };
        return (
          (filters.selectedStatus.completed && project.status === statusMap.completed) ||
          (filters.selectedStatus.inProgress && project.status === statusMap.inProgress) ||
          (filters.selectedStatus.delayed && project.status === statusMap.delayed) ||
          (filters.selectedStatus.cancelled && project.status === statusMap.cancelled)
        );
      });
    }

    if (filters.showGovernmentProjects) {
      result = result.filter((project) => project.isGovernment);
    }

    // Use the filterByBeneficiaries helper from our composable
    result = filterByBeneficiaries(result, filters.selectedBeneficiaries);

    fundedProjectStore.$patch((state) => {
      state.filteredProjects = result;
    });
    currentPage.value = 1;
  };

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProjects.value.slice(start, end);
  });

  const OpenPremiumModal = () => {
    showPremiumModal.value = true;
  };

  const fetchProjects = async () => {
    await fundedProjectStore.fetchAllProjects();
  };

  onMounted(async () => {
    try {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        selectedCurrency.value = savedCurrency;
      }

      await Promise.all([fetchProjects(), fetchBeneficiaries()]);

      if (route.query.status || route.query.showGovernmentProjects) {
        let statusMessage = '';
        if (route.query.status) {
          switch (route.query.status) {
            case '2':
              statusMessage = 'تم تطبيق فلتر المشاريع المنجزة';
              break;
            case '1':
              statusMessage = 'تم تطبيق فلتر المشاريع قيد التنفيذ';
              break;
            case '3':
              statusMessage = 'تم تطبيق فلتر المشاريع المتلكئة';
              break;
            case '0':
              statusMessage = 'تم تطبيق فلتر المشاريع الملغاة';
              break;
          }
          showSuccess('تم تطبيق الفلتر', statusMessage);
        }
        if (route.query.showGovernmentProjects === 'true') {
          showSuccess('تم تطبيق الفلتر', 'تم تطبيق فلتر البرنامج الحكومي');
        }

        applyFilters({
          searchQuery: '',
          budgetRange: minMaxBudgetRange.value,
          selectedStatus: {
            all: !route.query.status,
            completed: route.query.status === '2',
            inProgress: route.query.status === '1',
            delayed: route.query.status === '3',
            cancelled: route.query.status === '0',
          },
          selectedBeneficiaries: selectedBeneficiaries.value,
          showGovernmentProjects: route.query.showGovernmentProjects === 'true',
          isBudgetFilterEnabled: false,
        });
      }
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  });

  watch(
    () => route.query,
    (newQuery) => {
      if (newQuery.status || newQuery.showGovernmentProjects) {
        applyFilters({
          searchQuery: '',
          budgetRange: minMaxBudgetRange.value,
          selectedStatus: {
            all: !newQuery.status,
            completed: newQuery.status === '2',
            inProgress: newQuery.status === '1',
            delayed: newQuery.status === '3',
            cancelled: newQuery.status === '0',
          },
          selectedBeneficiaries: selectedBeneficiaries.value,
          showGovernmentProjects: newQuery.showGovernmentProjects === 'true',
          isBudgetFilterEnabled: false,
        });
      }
    },
    { immediate: true }
  );

  const viewProject = (projectId: string) => {
    router.push({
      name: 'funded-projects-details',
      params: { id: projectId },
    });
  };

  const getTotalComponents = computed(() => fundedProjectStore.totalComponents);
  const getTotalActivitiesAll = computed(() => fundedProjectStore.totalActivities);

  const formattedTotalCost = computed(() =>
    formatTotalCost(projects.value, selectedCurrency.value)
  );

  const handleCurrencyChange = (newCurrency: string) => {
    selectedCurrency.value = newCurrency;
    localStorage.setItem('selectedCurrency', newCurrency);
    showSuccess(
      'تم تغيير العملة',
      newCurrency === 'USD'
        ? 'تم تغيير العملة إلى الدولار الأمريكي'
        : 'تم تغيير العملة إلى الدينار العراقي'
    );

    if (budgetRange.value) {
      const newRange: [number, number] = [
        newCurrency === 'USD' ? budgetRange.value[0] / 1450 : budgetRange.value[0] * 1450,
        newCurrency === 'USD' ? budgetRange.value[1] / 1450 : budgetRange.value[1] * 1450,
      ];
      budgetRange.value = newRange;
    }
  };
</script>
