<template>
  <DefaultLayout>
    <div class="flex min-h-screen">
      <div class="h-full border-r border-border bg-background-surface">
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
          <div class="mx-auto w-full max-w-7xl space-y-8">
            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="rounded-lg bg-primary/10 p-3">
                    <Icon icon="lucide:building-2" class="h-8 w-8 text-primary" />
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
            <div class="rounded-xl border border-border bg-background-surface shadow-sm">
              <div class="border-b border-border p-6">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-foreground">قائمة المشاريع</h2>
                    <Badge class="bg-primary/10 px-3 py-1 text-primary">
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
                        class="flex items-center gap-2 rounded-lg bg-background-hover px-3 py-2 text-sm text-foreground-muted"
                      >
                        <span>{{ getSelectedSortLabel }}</span>
                        <button
                          class="rounded-full p-1 transition-colors hover:bg-background-hover"
                          @click="clearSort"
                        >
                          <Icon icon="lucide:x" class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <PrimaryButton variant="destructive" @click="OpenPremiumModal">
                        <Icon icon="lucide:lock" class="h-4 w-4" />
                        طباعة
                      </PrimaryButton>
                      <RouterLink to="/add-funded-project">
                        <PrimaryButton variant="primary">
                          <Icon icon="lucide:plus" class="h-4 w-4" />
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
                    class="h-80 animate-pulse rounded-lg bg-background-hover"
                  />
                </div>
                <div v-else>
                  <div
                    v-if="projects.length === 0"
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                  >
                    <div class="mb-4 rounded-full bg-background-hover p-4">
                      <Icon icon="lucide:folder-open" class="h-10 w-10 text-foreground-muted" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد مشاريع</h3>
                    <p class="mb-6 max-w-sm text-foreground-muted">
                      قم بإضافة مشروع جديد للبدء في إدارة المشاريع الممولة
                    </p>
                    <RouterLink to="/add-funded-project">
                      <PrimaryButton variant="primary" size="sm">
                        <Icon icon="lucide:plus" class="h-4 w-4" />
                        اضافة مشروع
                      </PrimaryButton>
                    </RouterLink>
                  </div>
                  <div
                    v-else-if="filteredProjects.length === 0"
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                  >
                    <div class="mb-4 rounded-full bg-background-hover p-4">
                      <Icon icon="lucide:search-x" class="h-10 w-10 text-foreground-muted" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-foreground">
                      لا توجد نتائج تطابق الفلتر
                    </h3>
                    <p class="mb-6 max-w-sm text-foreground-muted">
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
                class="border-t border-border bg-background-surface px-6 py-4"
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
  import CustomPagination from '@/components/CustomPagination.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import FundedProjectCard from '@/components/FundedProjectCard.vue';
  import PremiumModal from '@/components/PremiumModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
  import Badge from '@/components/ui/badge/Badge.vue';
  import { useBeneficiaries } from '@/composables/useBeneficiaries';
  import { useToast } from '@/composables/useToast';
  import { UNITS } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import type { FundedProject } from '@/types/funded-project';
  import { formatTotalCost } from '@/utils/formatCost';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const props = defineProps<{
    searchQuery?: string;
    budgetRange?: [number, number];
    selectedStatus?: {
      all: boolean;
      completed: boolean;
      inProgress: boolean;
      delayed: boolean;
      cancelled: boolean;
    };
    selectedBeneficiaries?: Record<string, boolean>;
    showGovernmentProjects?: boolean;
    selectedCurrency?: string;
  }>();

  const emit = defineEmits<{
    'filter-applied': [
      filters: {
        searchQuery?: string;
        budgetRange?: [number, number];
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
      },
    ];
    'currency-changed': [currency: string];
  }>();

  const fundedProjectStore = useFundedProjectStore();

  const projects = computed(() => fundedProjectStore.projects as FundedProject[]);
  const filteredProjects = computed(() => fundedProjectStore.filteredProjects as FundedProject[]);
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

  interface DropdownItem {
    label: string;
    icon?: string;
    disabled?: boolean;
    class?: string;
    onClick?: () => void;
  }

  type SortId =
    | 'price-low'
    | 'price-high'
    | 'period-high'
    | 'period-low'
    | 'progress-high'
    | 'progress-low';
  type SortLabel = keyof typeof sortMap;

  const sortMap = {
    'من السعر الادنى': 'price-low',
    'من السعر الاعلى': 'price-high',
    'من الفترة الاعلى': 'period-high',
    'من الفترة الادنى': 'period-low',
    'نسبة الانجاز الاعلى': 'progress-high',
    'نسبة الانجاز الاقل': 'progress-low',
  } as const;

  const sortOptions: DropdownItem[] = [
    { label: 'من السعر الادنى', icon: 'lucide:arrow-down-0-1' },
    { label: 'من السعر الاعلى', icon: 'lucide:arrow-up-0-1' },
    { label: 'من الفترة الاعلى', icon: 'lucide:arrow-down-narrow-wide' },
    { label: 'من الفترة الادنى', icon: 'lucide:arrow-up-narrow-wide' },
    { label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-down-0-1' },
    { label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-up-0-1' },
  ];

  const selectedSort = ref<SortId | ''>('');

  const handleSort = (sortId: SortId) => {
    selectedSort.value = sortId;
    const sortedProjects = [...projects.value];

    switch (sortId) {
      case 'price-low':
        sortedProjects.sort((a, b) => a.cost - b.cost);
        break;
      case 'price-high':
        sortedProjects.sort((a, b) => b.cost - a.cost);
        break;
      case 'period-high':
        sortedProjects.sort((a, b) => Number(b.duration) - Number(a.duration));
        break;
      case 'period-low':
        sortedProjects.sort((a, b) => Number(a.duration) - Number(b.duration));
        break;
      case 'progress-high':
        sortedProjects.sort((a, b) => b.financialAchievement - a.financialAchievement);
        break;
      case 'progress-low':
        sortedProjects.sort((a, b) => a.financialAchievement - b.financialAchievement);
        break;
    }

    fundedProjectStore.$patch((state) => {
      state.filteredProjects = sortedProjects;
    });
  };

  const handleSortSelect = (item: DropdownItem) => {
    if (item.label in sortMap) {
      const sortId = sortMap[item.label as SortLabel];
      handleSort(sortId);
    }
  };

  const getSelectedSortLabel = computed(() => {
    if (!selectedSort.value) return '';
    return Object.entries(sortMap).find(([_, value]) => value === selectedSort.value)?.[0] || '';
  });

  const clearSort = () => {
    selectedSort.value = '';
    fundedProjectStore.$patch((state) => {
      state.filteredProjects = [...projects.value];
    });
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
  const selectedCurrency = ref(
    props.selectedCurrency || localStorage.getItem('selectedCurrency') || 'IQD'
  );

  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];

  const { showSuccess } = useToast();

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

    emit('currency-changed', newCurrency);
  };

  const applyFilters = (filters: {
    searchQuery?: string;
    budgetRange?: [number, number];
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
          (project.name && project.name.toLowerCase().includes(query)) ||
          (project.executingDepartment &&
            project.executingDepartment.toLowerCase().includes(query)) ||
          (project.projectStatus && project.projectStatus.toString().includes(query)) ||
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

    const statusMap = {
      completed: 2,
      inProgress: 1,
      delayed: 3,
      cancelled: 0,
    };

    if (filters.selectedStatus && !filters.selectedStatus.all) {
      result = result.filter((project) => {
        return (
          (filters.selectedStatus.completed && project.projectStatus === statusMap.completed) ||
          (filters.selectedStatus.inProgress && project.projectStatus === statusMap.inProgress) ||
          (filters.selectedStatus.delayed && project.projectStatus === statusMap.delayed) ||
          (filters.selectedStatus.cancelled && project.projectStatus === statusMap.cancelled)
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

    emit('filter-applied', filters);
  };

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProjects.value.slice(start, end);
  });

  watch(filteredProjects, () => {
    currentPage.value = 1;
  });

  const OpenPremiumModal = () => {
    showPremiumModal.value = true;
  };

  const fetchProjects = async () => {
    await fundedProjectStore.fetchAllProjects();
  };

  const initializeFilters = () => {
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
  };

  onMounted(async () => {
    try {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        selectedCurrency.value = savedCurrency;
      }

      await Promise.all([fetchProjects(), fetchBeneficiaries()]);
      initializeFilters();
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
    }
  );

  const viewProject = (projectId: string) => {
    router.push({
      name: 'funded-projects-details',
      params: { id: projectId },
    });
  };

  const getTotalComponents = computed(() => fundedProjectStore.totalComponents);
  const getTotalActivitiesAll = computed(() => fundedProjectStore.totalActivities);

  const formattedTotalCost = computed(() => {
    return formatTotalCost(projects.value, selectedCurrency.value);
  });
</script>
