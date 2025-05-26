<template>
  <DefaultLayout>
    <div class="flex min-h-screen">
      <div class="border-r border-border bg-background-surface">
        <ProjectsFilter
          :isFundedProjects="false"
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
                    <h1 class="text-3xl font-bold text-foreground">مشاريع تنمية الاقاليم</h1>
                    <p class="text-foreground-muted">إدارة ومتابعة جميع مشاريع تنمية الاقاليم</p>
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
                  icon="lucide:file"
                  :value="contractsCount"
                  label="اجمالي العقود"
                  color="green"
                />
                <BaseStatsCard
                  icon="lucide:check-circle"
                  :value="proceduresCount"
                  label="اجمالي الإجراءات"
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
                        @select="handleSort"
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
                    <PrimaryButton
                      @click="OpenPremiumModal"
                      variant="destructive"
                      icon="lucide:lock"
                    >
                      طباعة
                    </PrimaryButton>
                    <RouterLink to="/add-devlopment-project">
                      <PrimaryButton variant="primary" icon="lucide:plus">
                        اضافة مشروع جديد
                      </PrimaryButton>
                    </RouterLink>
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
                    <Icon icon="lucide:folder-open" class="mb-4 h-12 w-12 text-foreground-muted" />
                    <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد مشاريع</h3>
                    <p class="mb-4 text-sm text-foreground-muted">
                      قم بإضافة مشروع جديد للبدء في إدارة المشاريع
                    </p>
                    <RouterLink to="/add-devlopment-project">
                      <PrimaryButton variant="primary" size="sm" icon="lucide:plus">
                        اضافة مشروع
                      </PrimaryButton>
                    </RouterLink>
                  </div>
                  <div
                    v-else-if="filteredProjects.length === 0"
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                  >
                    <Icon icon="lucide:search-x" class="mb-4 h-12 w-12 text-foreground-muted" />
                    <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد نتائج مطابقة</h3>
                    <p class="mb-4 text-sm text-foreground-muted">
                      حاول تعديل معايير الفلتر أو قم بإلغاء الفلتر لعرض جميع المشاريع.
                    </p>
                  </div>
                  <div v-else class="space-y-6">
                    <div class="grid grid-cols-1 gap-6">
                      <RegionalProjectCard
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

<script setup>
  import CustomSelect from '@/components/CustomSelect.vue';
  import RegionalProjectCard from '@/components/RegionalProjectCard.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { useToast } from '@/composables/useToast';
  import { CURRENCY_CONVERSION, UNITS } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { formatCost, formatTotalCost } from '@/utils/formatCost';

  const regionalProjectStore = useRegionalProjectStore();
  const projects = computed(() => regionalProjectStore.projects);
  const filteredProjects = computed(() => regionalProjectStore.filteredProjects);
  const isLoading = computed(() => regionalProjectStore.loading);
  const error = computed(() => regionalProjectStore.error);
  const router = useRouter();
  const route = useRoute();
  const showPremiumModal = ref(false);
  const currentPage = ref(1);
  const itemsPerPage = ref(6);
  const beneficiaries = ref([]);

  const contractsCount = computed(() => regionalProjectStore.contractsCount);
  const proceduresCount = computed(() => regionalProjectStore.proceduresCount);

  const sortOptions = [
    { id: 'price-low', label: 'من السعر الادنى', icon: 'lucide:arrow-down-to-line' },
    { id: 'price-high', label: 'من السعر الاعلى', icon: 'lucide:arrow-up-to-line' },
    { id: 'period-high', label: 'من الفترة الاعلى', icon: 'lucide:arrow-up-wide-narrow' },
    { id: 'period-low', label: 'من الفترة الادنى', icon: 'lucide:arrow-down-narrow-wide' },
    { id: 'progress-high', label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-up-circle' },
    { id: 'progress-low', label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-down-circle' },
  ];

  const selectedSort = ref('');

  const handleSort = (sortId) => {
    selectedSort.value = sortId;

    // Implement sorting logic
    const sortedProjects = [...filteredProjects.value];

    switch (sortId) {
      case 'price-low':
        sortedProjects.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
        break;
      case 'price-high':
        sortedProjects.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
        break;
      case 'period-high':
        sortedProjects.sort((a, b) => b.duration - a.duration);
        break;
      case 'period-low':
        sortedProjects.sort((a, b) => a.duration - b.duration);
        break;
      case 'progress-high':
        sortedProjects.sort((a, b) => b.progress - a.progress);
        break;
      case 'progress-low':
        sortedProjects.sort((a, b) => a.progress - b.progress);
        break;
      default:
        break;
    }

    regionalProjectStore.applyFilters(sortedProjects);
  };

  const getSelectedSortLabel = computed(() => {
    const option = sortOptions.find((opt) => opt.id === selectedSort.value);
    return option ? option.label : '';
  });

  const clearSort = () => {
    selectedSort.value = '';
    // Reset to original order
    regionalProjectStore.applyFilters([]);
  };

  // Initialize showGovernmentProjects from route query
  const showGovernmentProjects = ref(route.query.showGovernmentProjects === 'true');

  // Initialize status from route query
  const selectedStatus = ref({
    all: !route.query.status,
    completed: route.query.status === '2',
    inProgress: route.query.status === '1',
    delayed: route.query.status === '3',
    cancelled: route.query.status === '0',
    proposed: route.query.status === '4',
  });

  // Watch for route changes to update the filters
  watch(
    () => route.query,
    (newQuery) => {
      showGovernmentProjects.value = newQuery.showGovernmentProjects === 'true';
      selectedStatus.value = {
        all: !newQuery.status,
        completed: newQuery.status === '2',
        inProgress: newQuery.status === '1',
        delayed: newQuery.status === '3',
        cancelled: newQuery.status === '0',
        proposed: newQuery.status === '4',
      };
    },
    { deep: true }
  );

  // Computed properties for budget range
  const minMaxBudgetRange = computed(() => {
    if (!projects.value.length) return [0, 0];

    const costs = projects.value
      .map((project) => parseFloat(project.cost) || 0)
      .filter((cost) => cost > 0);

    if (!costs.length) return [0, 0];

    const min = Math.floor(Math.min(...costs));
    const max = Math.ceil(Math.max(...costs));

    return [min, max];
  });

  // Filter states
  const searchQuery = ref('');
  const budgetRange = ref(minMaxBudgetRange);
  const selectedYear = ref('all');
  const selectedBeneficiaries = ref({ all: true });
  const isBudgetFilterEnabled = ref(false);

  // Add currency selection state with localStorage initialization
  const selectedCurrency = ref(localStorage.getItem('selectedCurrency') || 'IQD');

  // Add currency options
  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];

  const { showSuccess } = useToast();

  const applyFilters = (filters) => {
    if (!projects.value.length) {
      regionalProjectStore.applyFilters([]);
      return;
    }

    let result = [...projects.value];

    // Apply search filter
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        return (
          (project.name && project.name.toLowerCase().includes(query)) ||
          (project.directorate && project.directorate.toLowerCase().includes(query)) ||
          (project.goals && project.goals.toLowerCase().includes(query)) ||
          (project.id && project.id.toString().includes(query))
        );
      });
    }

    // Apply budget range filter
    if (filters.isBudgetFilterEnabled && filters.budgetRange && filters.budgetRange.length === 2) {
      const [minBudget, maxBudget] = filters.budgetRange;
      result = result.filter((project) => {
        const cost = parseFloat(project.cost) || 0;
        return cost >= minBudget && cost <= maxBudget;
      });
    }

    // Apply status filter
    if (filters.selectedStatus && !filters.selectedStatus.all) {
      result = result.filter((project) => {
        return (
          (filters.selectedStatus.completed && project.projectStatus === 2) ||
          (filters.selectedStatus.inProgress && project.projectStatus === 1) ||
          (filters.selectedStatus.delayed && project.projectStatus === 3) ||
          (filters.selectedStatus.cancelled && project.projectStatus === 0) ||
          (filters.selectedStatus.proposed && project.projectStatus === 4)
        );
      });
    }

    // Apply government projects filter
    if (filters.showGovernmentProjects) {
      result = result.filter((project) => project.isGovernment);
    }

    // Apply beneficiary filter
    if (filters.selectedBeneficiaries && !filters.selectedBeneficiaries.all) {
      result = result.filter((project) => {
        if (!project.beneficiaries || project.beneficiaries.length === 0) {
          return false;
        }
        return project.beneficiaries.some(
          (beneficiary) => filters.selectedBeneficiaries[beneficiary.id]
        );
      });
    }

    regionalProjectStore.applyFilters(result);
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
    await regionalProjectStore.fetchAllProjects();
  };

  const fetchBeneficiaries = async () => {
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      beneficiaries.value = response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  const getTotalComponents = () => {
    return projects.value.reduce((total, project) => {
      return total + (project.components?.length || 0);
    }, 0);
  };

  const getTotalActivitiesAll = () => {
    return projects.value.reduce((total, project) => {
      return total + getTotalActivities(project);
    }, 0);
  };

  const getTotalActivities = (project) => {
    if (!project.components) return 0;
    return project.components.reduce((total, comp) => {
      return total + (comp.activities?.length || 0);
    }, 0);
  };

  const formattedTotalCost = computed(() =>
    formatTotalCost(projects.value, selectedCurrency.value)
  );

  const handleCurrencyChange = (newCurrency) => {
    selectedCurrency.value = newCurrency;
    localStorage.setItem('selectedCurrency', newCurrency);

    showSuccess(
      'تم تغيير العملة',
      newCurrency === 'USD'
        ? 'تم تغيير العملة إلى الدولار الأمريكي'
        : 'تم تغيير العملة إلى الدينار العراقي'
    );
  };

  onMounted(async () => {
    try {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        selectedCurrency.value = savedCurrency;
      }

      await Promise.all([
        fetchProjects(),
        fetchBeneficiaries(),
        regionalProjectStore.fetchAllContracts(),
        regionalProjectStore.fetchAllProcedures(),
      ]);

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
          selectedStatus: selectedStatus.value,
          selectedBeneficiaries: { all: true },
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
            proposed: newQuery.status === '4',
          },
          selectedBeneficiaries: { all: true },
          showGovernmentProjects: newQuery.showGovernmentProjects === 'true',
          isBudgetFilterEnabled: false,
        });
      }
    },
    { immediate: true }
  );
</script>
