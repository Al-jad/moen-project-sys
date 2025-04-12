<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter
        :isFundedProjects="false"
        :showFundingTypeFilter="true"
        @filter-applied="applyFilters"
        :searchQuery="searchQuery"
        :budgetRange="budgetRange"
        :isBudgetFilterEnabled="isBudgetFilterEnabled"
        :selectedStatus="selectedStatus"
        :selectedBeneficiaries="selectedBeneficiaries"
        :showGovernmentProjects="showGovernmentProjects"
        :beneficiaries="beneficiaries"
        :selectedCurrency="selectedCurrency"
        @currency-changed="handleCurrencyChange"
      />
      <PremiumModal v-model:open="showPremiumModalOpen" />
      <div class="flex-1 bg-gray-200 p-6 dark:bg-darkmode">
        <!-- Projects Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="space-y-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">قائمة المشاريع</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                isLoading
                  ? 'جاري التحميل...'
                  : `النتائج: عرض ${paginatedCount} مشروع من اصل ${totalProjects} مشروع`
              }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Currency Selector -->
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

            <div class="flex items-center gap-2">
              <PrimaryButton @click="showPremiumModal" variant="destructive" icon="mdi:lock">
                ترتيب
              </PrimaryButton>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PrimaryButton variant="primary" icon="lucide:plus">
                  اضافة مشروع جديد
                </PrimaryButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[200px] border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <DropdownMenuItem
                  class="dark:focus:bg-gray-700/50"
                  @click="$router.push('/add-funded-project')"
                >
                  مشروع ممول
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="dark:focus:bg-gray-700/50"
                  @click="$router.push('/add-devlopment-project')"
                >
                  مشروع تنمية الاقاليم
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="dark:focus:bg-gray-700/50"
                  @click="$router.push('/add-project?type=investment')"
                >
                  مشروع استثمارية
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="dark:focus:bg-gray-700/50"
                  @click="$router.push('/add-project?type=operational')"
                >
                  مشروع تشغيلية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <!-- Projects List -->
        <div v-if="!isLoading && !error" class="grid grid-cols-1 gap-6">
          <GenericProjectCard
            v-for="project in paginatedProjects"
            :key="project.id"
            :project="project"
            :selectedCurrency="selectedCurrency"
          />
          <div v-if="filteredProjects.length > itemsPerPage" class="mt-4 flex justify-center">
            <CustomPagination
              v-model="currentPage"
              :total="filteredProjects.length"
              :per-page="itemsPerPage"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GenericProjectCard
            v-for="i in 4"
            :key="i"
            :project="{}"
            :isLoading="true"
            :selectedCurrency="selectedCurrency"
          />
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800/30 dark:bg-red-900/20"
        >
          <Icon icon="lucide:alert-circle" class="mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
          <h3 class="mb-2 text-lg font-medium text-red-800 dark:text-red-200"
            >حدث خطأ في تحميل المشاريع</h3
          >
          <p class="mb-4 text-sm text-red-600 dark:text-red-300">{{ error }}</p>
          <PrimaryButton @click="fetchProjects" icon="lucide:refresh-cw">
            اعادة المحاولة
          </PrimaryButton>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!filteredProjects.length"
          class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50"
        >
          <Icon icon="lucide:folder" class="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">لا توجد مشاريع</h3>
          <p class="mb-4 text-sm text-gray-500 dark:text-gray-400"
            >لم يتم العثور على اي مشاريع تطابق معايير البحث</p
          >
          <PrimaryButton @click="clearFilters" icon="lucide:x"> مسح الفلترة </PrimaryButton>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import CustomSelect from '@/components/CustomSelect.vue';
  import PremiumModal from '@/components/PremiumModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
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
  import { determineFundingType, ProjectType } from '@/services/projectTypeService';
  import { useProjectStore } from '@/stores/projectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const projectStore = useProjectStore();
  const allProjects = computed(() => projectStore.projects);
  const filteredProjects = computed(() => projectStore.filteredProjects);
  const isLoading = computed(() => projectStore.loading);
  const error = computed(() => projectStore.error);
  const beneficiaries = ref([]);

  // Add this helper function to convert Arabic numerals to English
  const convertArabicToEnglish = (str) => {
    if (!str) return '0';
    // If it's already a number, return it as string
    if (typeof str === 'number') return str.toString();

    return str
      .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - '٠'.charCodeAt(0))
      .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - '۰'.charCodeAt(0))
      .replace(/[,٬]/g, '')
      .replace(/د\.ع|IQD|USD|\s/g, '')
      .trim();
  };

  // Add this helper function to normalize currency codes
  const normalizeCurrency = (currency) => {
    if (!currency) return 'IQD';
    // If currency is a number, convert to string code
    if (currency === 1) return 'IQD';
    if (currency === 2) return 'USD';
    return currency;
  };

  // Update minMaxBudgetRange computed
  const minMaxBudgetRange = computed(() => {
    if (!allProjects.value.length) return [0, 0];

    const costs = allProjects.value
      .map((project) => {
        const cost = project.cost || 0;
        // Convert to current selected currency if needed
        return selectedCurrency.value === 'USD' ? Number(cost) / 1450 : Number(cost);
      })
      .filter((cost) => cost > 0);

    if (!costs.length) return [0, 0];

    return [Math.floor(Math.min(...costs)), Math.ceil(Math.max(...costs))];
  });

  // Filter states
  const searchQuery = ref('');
  const selectedFunding = ref({
    all: true,
    fund: false,
    regional: false,
  });
  const budgetRange = ref([0, 0]); // Initialize with zeros
  const isBudgetFilterEnabled = ref(false);
  const selectedYear = ref('all');
  const selectedStatus = ref({
    all: true,
    completed: false,
    inProgress: false,
    delayed: false,
    cancelled: false,
  });
  const selectedBeneficiaries = ref({ all: true });

  // Add currency options
  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];

  // Add currency selection state with localStorage initialization
  const selectedCurrency = ref(localStorage.getItem('selectedCurrency') || 'IQD');

  const route = useRoute();
  const router = useRouter();

  // Initialize showGovernmentProjects from route query
  const showGovernmentProjects = ref(route.query.showGovernmentProjects === 'true');

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

      if (newQuery.status || newQuery.showGovernmentProjects) {
        applyFilters({
          searchQuery: '',
          budgetRange: budgetRange.value,
          selectedStatus: selectedStatus.value,
          selectedBeneficiaries: { all: true },
          showGovernmentProjects: newQuery.showGovernmentProjects === 'true',
          isBudgetFilterEnabled: false,
        });
      }
    },
    { deep: true }
  );

  // Watch for changes in budget range and currency
  watch(
    [minMaxBudgetRange, selectedCurrency],
    ([newRange]) => {
      budgetRange.value = [newRange[0], newRange[1]];
    },
    { immediate: true }
  );

  const applyFilters = (filters) => {
    console.log('Applying filters:', filters);

    if (!allProjects.value.length) {
      filteredProjects.value = [];
      return;
    }

    let result = [...allProjects.value];

    // Apply funding type filter
    if (filters.selectedFunding && !filters.selectedFunding.all) {
      console.log('Applying funding type filter:', filters.selectedFunding);
      result = result.filter((project) => {
        const projectType = determineFundingType(project);

        // For funded projects
        if (filters.selectedFunding.fund) {
          return projectType === ProjectType.FUNDED;
        }
        // For regional projects
        if (filters.selectedFunding.regional) {
          return projectType === ProjectType.REGIONAL;
        }
        return false;
      });
    }

    // Apply search filter if exists
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        return (
          (project.title && project.title.toLowerCase().includes(query)) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          (project.executingDepartment &&
            project.executingDepartment.toLowerCase().includes(query)) ||
          (project.implementingEntity &&
            project.implementingEntity.toLowerCase().includes(query)) ||
          (project.id && project.id.toString().includes(query))
        );
      });
    }

    // Apply budget range filter only if it's enabled
    if (filters.isBudgetFilterEnabled && filters.budgetRange && filters.budgetRange.length === 2) {
      const [minBudget, maxBudget] = filters.budgetRange;
      console.log(`Budget filter (enabled): Min=${minBudget}, Max=${maxBudget}`);

      result = result.filter((project) => {
        const cost = project.cost || 0;
        // Convert cost to match current selected currency
        const convertedCost = selectedCurrency.value === 'USD' ? Number(cost) / 1450 : Number(cost);

        console.log(
          'Project cost:',
          cost,
          'Converted:',
          convertedCost,
          'Currency:',
          selectedCurrency.value
        );

        const isInRange = convertedCost >= minBudget && convertedCost <= maxBudget;
        return isInRange;
      });
    }

    // Apply status filter - match to projectStatus value
    if (filters.selectedStatus && !filters.selectedStatus.all) {
      console.log('Status filter:', filters.selectedStatus);

      const beforeCount = result.length;
      result = result.filter((project) => {
        const statusMatches =
          (filters.selectedStatus.completed && project.projectStatus === 2) ||
          (filters.selectedStatus.inProgress && project.projectStatus === 1) ||
          (filters.selectedStatus.delayed && project.projectStatus === 3) ||
          (filters.selectedStatus.cancelled && project.projectStatus === 0);

        if (project.id < 5) {
          console.log(
            `Status check: Project ${project.id}, Status=${project.projectStatus}, Matches=${statusMatches}`
          );
        }

        return statusMatches;
      });
      console.log(`Status filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }

    // Apply government projects filter
    if (filters.showGovernmentProjects) {
      console.log('Filtering for government projects only');
      const beforeCount = result.length;
      result = result.filter((project) => {
        const isGovernment = Boolean(project.isGovernment);
        if (project.id < 5) {
          console.log(`Project ${project.id}: isGovernment = ${isGovernment}`);
        }
        return isGovernment;
      });
      console.log(`Government filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }

    // Apply beneficiary filter
    if (filters.selectedBeneficiaries && !filters.selectedBeneficiaries.all) {
      console.log('Beneficiary filter:', filters.selectedBeneficiaries);

      const beforeCount = result.length;
      result = result.filter((project) => {
        if (!project.beneficiaries || project.beneficiaries.length === 0) {
          return false;
        }

        return project.beneficiaries.some(
          (beneficiary) => filters.selectedBeneficiaries[beneficiary.id]
        );
      });
      console.log(`Beneficiary filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }

    // Update filtered projects through store
    projectStore.applyFilters(result);
    console.log('Final filtered projects count:', result.length);
  };

  // Add currency conversion function
  const convertCurrency = (value, fromCurrency, toCurrency) => {
    if (!value || isNaN(value)) return 0;
    const numValue = Number(value);
    if (fromCurrency === toCurrency) return numValue;

    let convertedValue;
    if (fromCurrency === 'USD') {
      convertedValue = numValue * CURRENCY_CONVERSION.USD_TO_IQD;
    } else {
      convertedValue = numValue * CURRENCY_CONVERSION.IQD_TO_USD;
    }

    // Round to appropriate precision
    const precision = CURRENCY_CONVERSION.PRECISION[toCurrency];
    return Number(convertedValue.toFixed(precision));
  };

  const handleCurrencyChange = (newCurrency) => {
    const oldCurrency = selectedCurrency.value;
    selectedCurrency.value = newCurrency;
    localStorage.setItem('selectedCurrency', newCurrency);

    // Convert budget range if it's enabled
    if (isBudgetFilterEnabled.value && budgetRange.value) {
      if (newCurrency === 'USD' && oldCurrency === 'IQD') {
        budgetRange.value = budgetRange.value.map((value) => value / 1450);
      } else if (newCurrency === 'IQD' && oldCurrency === 'USD') {
        budgetRange.value = budgetRange.value.map((value) => value * 1450);
      }
    }

    // Show success message
    showSuccess(
      'تم تغيير العملة',
      newCurrency === 'USD'
        ? 'تم تغيير العملة إلى الدولار الأمريكي'
        : 'تم تغيير العملة إلى الدينار العراقي'
    );

    // Reapply filters with new currency
    applyFilters({
      searchQuery: searchQuery.value,
      budgetRange: budgetRange.value,
      selectedStatus: selectedStatus.value,
      selectedBeneficiaries: selectedBeneficiaries.value,
      showGovernmentProjects: showGovernmentProjects.value,
      isBudgetFilterEnabled: isBudgetFilterEnabled.value,
    });
  };

  // Fetch projects from API
  const fetchProjects = async function () {
    await projectStore.fetchAllProjects();
  };

  const totalProjects = computed(() => filteredProjects.value.length);
  const paginatedCount = computed(() =>
    Math.min(itemsPerPage.value, filteredProjects.value.length)
  );

  const selectedSort = ref('');

  const showPremiumModalOpen = ref(false);

  const showPremiumModal = () => {
    showPremiumModalOpen.value = true;
  };

  const fetchBeneficiaries = async () => {
    try {
      const response = await axiosInstance.get('/api/beneficiary');
      beneficiaries.value = response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  // Fetch projects and beneficiaries when component is mounted
  onMounted(async () => {
    try {
      // Get saved currency from localStorage
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        selectedCurrency.value = savedCurrency;
      }

      // Fetch data
      await Promise.all([fetchProjects(), fetchBeneficiaries()]);

      // Auto apply filters based on route query
      if (route.query.status || route.query.showGovernmentProjects) {
        // Get status message based on query
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

        // Show government projects filter message
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

  // Add this mapping function somewhere in your script setup
  const getTableNameInArabic = (tableName) => {
    if (!tableName) return 'غير محدد'; // "Not specified" for null values

    const tableNameMap = {
      Project: 'المشروع',
      Attachment: 'المرفقات',
      Activity: 'النشاط',
      Beneficiary: 'الجهة المستفيدة',
      Component: 'المكون',
      User: 'المستخدم',
      // Add any other table names that might appear in your system
    };

    return tableNameMap[tableName] || tableName;
  };

  const clearFilters = () => {
    const defaultFilters = {
      searchQuery: '',
      selectedFunding: {
        all: true,
        fund: false,
        regional: false,
      },
      budgetRange: [100000, 9000000],
      selectedYear: 'all',
      selectedStatus: {
        all: true,
        completed: false,
        inProgress: false,
        delayed: false,
        cancelled: false,
      },
      selectedBeneficiaries: { all: true },
      isBudgetFilterEnabled: false,
      showGovernmentProjects: false,
    };

    // Apply default filters
    applyFilters(defaultFilters);
  };

  const { showSuccess } = useToast();

  // Update these near the top of the script section where other refs are defined
  const currentPage = ref(1);
  const itemsPerPage = ref(5); // Changed from 10 to 5

  // Update the paginatedProjects computed property
  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProjects.value.slice(start, end);
  });
</script>
