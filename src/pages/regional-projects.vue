<template>
  <DefaultLayout>
    <div class="flex flex-1">
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
      <div class="min-h-screen flex-1 bg-gray-100 p-6 dark:bg-gray-900">
        <div class="mx-auto w-full max-w-7xl space-y-8">
          <div class="mb-4 flex justify-end">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300">العملة:</span>
              <CustomSelect
                v-model="selectedCurrency"
                :options="currencyOptions"
                placeholder="اختر العملة"
                :triggerClass="'w-[120px]'"
                icon="lucide:currency-dollar"
                @update:model-value="handleCurrencyChange"
              />
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-4">
            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-blue-500/10 p-3 dark:bg-blue-500/20">
                  <Icon icon="lucide:folders" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ filteredProjects.length }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي المشاريع</div>
                </div>
              </div>
            </div>
            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-green-500/10 p-3 dark:bg-green-500/20">
                  <Icon icon="lucide:file" class="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ getTotalComponents() }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي العقود</div>
                </div>
              </div>
            </div>
            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-purple-500/10 p-3 dark:bg-purple-500/20">
                  <Icon
                    icon="lucide:check-circle"
                    class="h-6 w-6 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ getTotalActivitiesAll() }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي الإجراءات</div>
                </div>
              </div>
            </div>
            <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20">
                  <Icon
                    icon="lucide:dollar-sign"
                    class="h-6 w-6 text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ formatTotalCost() }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي التمويل</div>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b p-6 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100"
                    >مشاريع تنمية الاقاليم</h1
                  >
                  <Badge variant="outline" class="px-3">
                    {{ filteredProjects.length }} من {{ projects.length }} مشروع
                  </Badge>
                </div>
                <div class="flex flex-row items-center gap-6">
                  <div class="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <PrimaryButton variant="outline" icon="lucide:align-left">
                          ترتيب
                        </PrimaryButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        class="w-[250px] border-gray-100 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
                        align="end"
                      >
                        <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                          <h3
                            class="text-right text-base font-medium text-gray-900 dark:text-white"
                          >
                            ترتيب
                          </h3>
                        </div>
                        <div class="flex flex-col">
                          <DropdownMenuItem
                            v-for="option in sortOptions"
                            :key="option.id"
                            class="flex w-full items-center justify-between border-b px-4 py-2.5 text-right text-sm transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50"
                            :class="{
                              'bg-gray-50 dark:bg-gray-700/50': selectedSort === option.id,
                            }"
                            @click="handleSort(option.id)"
                          >
                            <Icon
                              :icon="option.icon"
                              class="h-4 w-4 text-gray-500 dark:text-gray-400"
                            />
                            <span class="text-gray-700 dark:text-gray-200">{{ option.label }}</span>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                      v-if="selectedSort"
                      class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <span>{{ getSelectedSortLabel }}</span>
                      <button
                        class="rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                        @click="clearSort"
                      >
                        <Icon icon="lucide:x" class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <PrimaryButton @click="OpenPremiumModal">
                    <Icon icon="lucide:lock" />
                    طباعة
                  </PrimaryButton>
                  <RouterLink to="/add-devlopment-project">
                    <Button
                      class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Icon
                        icon="lucide:plus"
                        class="ml-2 h-4 w-4 text-gray-900 dark:text-gray-100"
                      />
                      <span class="text-gray-900 dark:text-gray-100">اضافة مشروع جديد</span>
                    </Button>
                  </RouterLink>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Loading Skeleton -->
              <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="h-[280px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                />
              </div>

              <!-- Content Area (after loading) -->
              <div v-else>
                <!-- Case 1: No Projects Initially -->
                <div
                  v-if="projects.length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
                >
                  <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <Icon
                      icon="lucide:folder-open"
                      class="h-8 w-8 text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100"
                    >لا توجد مشاريع</h3
                  >
                  <p class="mb-4 text-sm text-gray-500 dark:text-gray-400"
                    >قم بإضافة مشروع جديد للبدء</p
                  >
                  <RouterLink to="/add-devlopment-project">
                    <Button variant="outline" size="sm">
                      <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                      اضافة مشروع
                    </Button>
                  </RouterLink>
                </div>

                <!-- Case 2: Projects exist, but filter yields no results -->
                <div
                  v-else-if="filteredProjects.length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
                >
                  <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <Icon icon="lucide:search-x" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">
                    لا توجد نتائج تطابق الفلتر
                  </h3>
                  <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    حاول تعديل معايير الفلتر أو قم بإلغاء الفلتر لعرض جميع المشاريع.
                  </p>
                </div>

                <!-- Case 3: Projects exist and filters yield results -->
                <div v-else class="grid grid-cols-1 gap-6">
                  <RegionalProjectCard
                    v-for="project in paginatedProjects"
                    :key="project.id"
                    :project="project"
                    :selectedCurrency="selectedCurrency"
                    @attachment-added="fetchProjects"
                  />

                  <div class="mt-4 flex justify-center">
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
  import axiosInstance from '@/plugins/axios';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

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
          (filters.selectedStatus.cancelled && project.projectStatus === 0)
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
      const response = await axiosInstance.get('/api/beneficiary');
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

  const formatTotalCost = () => {
    const total = projects.value.reduce((sum, project) => {
      return sum + (Number(project.cost) || 0);
    }, 0);
    return formatCost(total);
  };

  const formatCost = (value) => {
    if (!value) return '0';
    const numValue = Number(value);
    const convertedValue = convertCurrency(numValue, 'IQD', selectedCurrency.value);

    const precision = CURRENCY_CONVERSION.PRECISION[selectedCurrency.value];
    const formattedValue = convertedValue.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    return `${formattedValue} ${selectedCurrency.value === 'USD' ? UNITS.CURRENCY.USD : UNITS.CURRENCY.IQD}`;
  };

  const convertCurrency = (value, fromCurrency, toCurrency) => {
    if (!value) return 0;
    const numValue = Number(value);
    if (fromCurrency === toCurrency) return numValue;

    let convertedValue;
    if (fromCurrency === 'USD') {
      convertedValue = numValue * CURRENCY_CONVERSION.USD_TO_IQD;
    } else {
      convertedValue = numValue * CURRENCY_CONVERSION.IQD_TO_USD;
    }

    const precision = CURRENCY_CONVERSION.PRECISION[toCurrency];
    return Number(convertedValue.toFixed(precision));
  };

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
