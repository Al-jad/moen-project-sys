<template>
  <DefaultLayout>
    <div class="flex min-h-screen">
      <div class="border-r border-border bg-background-surface">
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
      </div>
      <div class="flex-1 bg-background">
        <div class="p-6 lg:p-8">
          <div class="mx-auto w-full max-w-7xl space-y-8">
            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="rounded-lg bg-primary/10 p-3">
                    <Icon icon="lucide:folder" class="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 class="text-3xl font-bold text-foreground">قائمة المشاريع</h1>
                    <p class="text-foreground-muted">
                      {{
                        isLoading
                          ? 'جاري التحميل...'
                          : `النتائج: عرض ${paginatedProjects.length} مشروع من اصل ${totalProjects} مشروع`
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
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
              </div>
            </div>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <BaseStatsCard
                icon="lucide:folders"
                :value="filteredProjectsList.length"
                label="اجمالي المشاريع"
                color="blue"
              />
              <BaseStatsCard
                icon="lucide:check-circle"
                :value="getCompletedProjectsCount()"
                label="المشاريع المنجزة"
                color="green"
              />
              <BaseStatsCard
                icon="lucide:loader"
                :value="getInProgressProjectsCount()"
                label="المشاريع قيد التنفيذ"
                color="purple"
              />
              <BaseStatsCard
                icon="lucide:dollar-sign"
                :value="formattedTotalCost"
                label="اجمالي التمويل"
                color="amber"
              />
            </div>
            <div class="rounded-xl border border-border bg-background-surface shadow-sm">
              <div class="border-b border-border p-6">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-foreground">المشاريع</h2>
                    <Badge class="bg-primary/10 px-3 py-1 text-primary">
                      {{ paginatedProjects.length }} من {{ totalProjects }} مشروع
                    </Badge>
                  </div>
                  <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                      <PrimaryButton
                        @click="showPremiumModal"
                        variant="destructive"
                        icon="mdi:lock"
                      >
                        ترتيب
                      </PrimaryButton>
                    </div>
                    <CustomDrop
                      label="اضافة مشروع جديد"
                      icon="lucide:plus"
                      variant="primary"
                      :items="addProjectItems"
                      @select="handleAddProject"
                    />
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div v-if="!error" class="grid gap-6">
                  <template v-if="isLoading">
                    <GenericProjectCard
                      v-for="i in itemsPerPage"
                      :key="`skeleton-${i}`"
                      :project="{}"
                      :isLoading="true"
                      :selectedCurrency="selectedCurrency"
                    />
                  </template>
                  <template v-else-if="paginatedProjects.length > 0">
                    <GenericProjectCard
                      v-for="project in paginatedProjects"
                      :key="project.id"
                      :project="project"
                      :selectedCurrency="selectedCurrency"
                      :isLoading="false"
                    />
                  </template>
                </div>
                <div
                  v-else-if="error"
                  class="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-8 text-center"
                >
                  <Icon icon="lucide:alert-circle" class="mb-4 h-12 w-12 text-destructive" />
                  <h3 class="mb-2 text-lg font-medium text-destructive"
                    >حدث خطأ في تحميل المشاريع</h3
                  >
                  <p class="mb-4 text-sm text-destructive">{{ error }}</p>
                  <PrimaryButton
                    @click="fetchProjects"
                    variant="destructive"
                    icon="lucide:refresh-cw"
                  >
                    اعادة المحاولة
                  </PrimaryButton>
                </div>
                <div
                  v-else-if="!isLoading && !error && allProjects.length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                >
                  <Icon icon="lucide:folder-open" class="mb-4 h-12 w-12 text-foreground-muted" />
                  <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد مشاريع</h3>
                  <p class="mb-4 text-sm text-foreground-muted"
                    >لا توجد مشاريع في النظام حالياً. قم باضافة مشروع جديد.</p
                  >
                </div>
                <div
                  v-else-if="!isLoading && !error && filteredProjectsList.length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                >
                  <Icon icon="lucide:search-x" class="mb-4 h-12 w-12 text-foreground-muted" />
                  <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد نتائج مطابقة</h3>
                  <p class="mb-4 text-sm text-foreground-muted">
                    لم يتم العثور على اي مشاريع تطابق معايير البحث المحددة.
                  </p>
                  <PrimaryButton @click="clearFilters" variant="secondary" icon="lucide:x">
                    مسح الفلترة
                  </PrimaryButton>
                </div>
              </div>
              <!-- Pagination at bottom of container -->
              <div
                v-if="totalProjects > itemsPerPage"
                class="border-t border-border bg-background-surface px-6 py-4"
              >
                <div class="flex justify-center">
                  <CustomPagination
                    v-model="currentPage"
                    :total="totalProjects"
                    :per-page="itemsPerPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PremiumModal
      :open="showPremiumModalOpen"
      @update:open="(val) => (showPremiumModalOpen = val)"
      @close="handlePremiumModalClose"
    />
  </DefaultLayout>
</template>
<script setup>
  import CustomDrop from '@/components/CustomDrop.vue';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import CustomSelect from '../components/CustomSelect.vue';
  import PremiumModal from '../components/PremiumModal.vue';
  import PrimaryButton from '../components/PrimaryButton.vue';
  import ProjectsFilter from '../components/ProjectsFilter.vue';
  import { useToast } from '../composables/useToast';
  import { CURRENCY_CONVERSION, UNITS } from '../constants';
  import DefaultLayout from '../layouts/DefaultLayout.vue';
  import axiosInstance from '../plugins/axios';
  import { determineFundingType, ProjectType } from '../services/projectTypeService';
  import { useProjectStore } from '../stores/projectStore';
  import CustomPagination from '../components/CustomPagination.vue';
  import BaseStatsCard from '@/components/BaseStatsCard.vue';
  import { formatCost, formatTotalCost } from '@/utils/formatCost';
  const projectStore = useProjectStore();
  const allProjects = computed(() => projectStore.projects);
  const filteredProjects = computed(() => projectStore.filteredProjects);
  const isLoading = computed(() => projectStore.loading);
  const error = computed(() => projectStore.error);
  const beneficiaries = ref([]);
  const filteredProjectsList = ref([]);
  const convertArabicToEnglish = (str) => {
    if (!str) return '0';
    if (typeof str === 'number') return str.toString();
    return str
      .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - '٠'.charCodeAt(0))
      .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - '۰'.charCodeAt(0))
      .replace(/[,٬]/g, '')
      .replace(/د\.ع|IQD|USD|\s/g, '')
      .trim();
  };
  const normalizeCurrency = (currency) => {
    if (!currency) return 'IQD';
    if (currency === 1) return 'IQD';
    if (currency === 2) return 'USD';
    return currency;
  };
  const minMaxBudgetRange = computed(() => {
    if (!allProjects.value.length) return [0, 0];
    const costs = allProjects.value
      .map((project) => {
        const cost = project.cost || 0;
        return selectedCurrency.value === 'USD' ? Number(cost) / 1450 : Number(cost);
      })
      .filter((cost) => cost > 0);
    if (!costs.length) return [0, 0];
    return [Math.floor(Math.min(...costs)), Math.ceil(Math.max(...costs))];
  });
  const searchQuery = ref('');
  const selectedFunding = ref({
    all: true,
    fund: false,
    regional: false,
  });
  const budgetRange = ref([0, 0]);
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
  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];
  const selectedCurrency = ref(localStorage.getItem('selectedCurrency') || 'IQD');
  const route = useRoute();
  const router = useRouter();
  const showGovernmentProjects = ref(route.query.showGovernmentProjects === 'true');
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
  watch(
    [minMaxBudgetRange, selectedCurrency],
    ([newRange]) => {
      budgetRange.value = [newRange[0], newRange[1]];
    },
    { immediate: true }
  );
  const applyFilters = (filters) => {
    if (!allProjects.value.length) {
      filteredProjectsList.value = [];
      return;
    }
    let result = [...allProjects.value];
    if (filters.selectedFunding && !filters.selectedFunding.all) {
      result = result.filter((project) => {
        const projectType = determineFundingType(project);
        if (filters.selectedFunding.fund) {
          return projectType === ProjectType.FUNDED;
        }
        if (filters.selectedFunding.regional) {
          return projectType === ProjectType.REGIONAL;
        }
        return false;
      });
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        const projectName = project.name || project.title;
        const matches =
          (projectName && projectName.toLowerCase().includes(query)) ||
          (project.executingDepartment &&
            project.executingDepartment.toLowerCase().includes(query)) ||
          (project.implementingEntity &&
            project.implementingEntity.toLowerCase().includes(query)) ||
          (project.id && project.id.toString().includes(query)) ||
          (project.grantingEntity && project.grantingEntity.toLowerCase().includes(query)) ||
          (project.projectObjectives && project.projectObjectives.toLowerCase().includes(query)) ||
          (project.directorate && project.directorate.toLowerCase().includes(query)) ||
          (project.goals && project.goals.toLowerCase().includes(query)) ||
          (project.description && project.description.toLowerCase().includes(query));
        return matches;
      });
    }
    if (filters.isBudgetFilterEnabled && filters.budgetRange && filters.budgetRange.length === 2) {
      const [minBudget, maxBudget] = filters.budgetRange;
      result = result.filter((project) => {
        const cost = project.cost || 0;
        const convertedCost = selectedCurrency.value === 'USD' ? Number(cost) / 1450 : Number(cost);
        const isInRange = convertedCost >= minBudget && convertedCost <= maxBudget;
        return isInRange;
      });
    }
    if (filters.selectedStatus && !filters.selectedStatus.all) {
      result = result.filter((project) => {
        const statusMatches =
          (filters.selectedStatus.completed && project.projectStatus === 2) ||
          (filters.selectedStatus.inProgress && project.projectStatus === 1) ||
          (filters.selectedStatus.delayed && project.projectStatus === 3) ||
          (filters.selectedStatus.cancelled && project.projectStatus === 0);
        return statusMatches;
      });
    }
    if (filters.showGovernmentProjects) {
      result = result.filter((project) => {
        const isGovernment = Boolean(project.isGovernment);
        return isGovernment;
      });
    }
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
    filteredProjectsList.value = result;
    currentPage.value = 1;
  };
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
    const precision = CURRENCY_CONVERSION.PRECISION[toCurrency];
    return Number(convertedValue.toFixed(precision));
  };
  const handleCurrencyChange = (newCurrency) => {
    const oldCurrency = selectedCurrency.value;
    selectedCurrency.value = newCurrency;
    localStorage.setItem('selectedCurrency', newCurrency);
    if (isBudgetFilterEnabled.value && budgetRange.value) {
      if (newCurrency === 'USD' && oldCurrency === 'IQD') {
        budgetRange.value = budgetRange.value.map((value) => value / 1450);
      } else if (newCurrency === 'IQD' && oldCurrency === 'USD') {
        budgetRange.value = budgetRange.value.map((value) => value * 1450);
      }
    }
    showSuccess(
      'تم تغيير العملة',
      newCurrency === 'USD'
        ? 'تم تغيير العملة إلى الدولار الأمريكي'
        : 'تم تغيير العملة إلى الدينار العراقي'
    );
    applyFilters({
      searchQuery: searchQuery.value,
      budgetRange: budgetRange.value,
      selectedStatus: selectedStatus.value,
      selectedBeneficiaries: selectedBeneficiaries.value,
      showGovernmentProjects: showGovernmentProjects.value,
      isBudgetFilterEnabled: isBudgetFilterEnabled.value,
    });
  };
  const fetchProjects = async function () {
    await projectStore.fetchAllProjects();
  };
  const totalProjects = computed(() => filteredProjectsList.value.length);
  const paginatedCount = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return Math.min(itemsPerPage.value, filteredProjectsList.value.length - start);
  });
  const selectedSort = ref('');
  const showPremiumModalOpen = ref(false);
  const showPremiumModal = () => {
    showPremiumModalOpen.value = true;
  };
  const handlePremiumModalClose = () => {
    showPremiumModalOpen.value = false;
  };
  const fetchBeneficiaries = async () => {
    try {
      const response = await axiosInstance.get('/api/beneficiary');
      beneficiaries.value = response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
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
      } else {
        filteredProjectsList.value = [...allProjects.value];
      }
    } catch (error) {
      console.error('Error initializing component:', error);
      filteredProjectsList.value = [];
    }
  });
  watch(allProjects, (newProjects) => {
    filteredProjectsList.value = [...newProjects];
    currentPage.value = 1;
  });
  const getTableNameInArabic = (tableName) => {
    if (!tableName) return 'غير محدد';
    const tableNameMap = {
      Project: 'المشروع',
      Attachment: 'المرفقات',
      Activity: 'النشاط',
      Beneficiary: 'الجهة المستفيدة',
      Component: 'المكون',
      User: 'المستخدم',
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
    applyFilters(defaultFilters);
  };
  const { showSuccess } = useToast();
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProjectsList.value.slice(start, end);
  });
  const addProjectItems = [
    {
      label: 'مشروع ممول',
      icon: 'lucide:banknote',
      onClick: () => router.push('/add-funded-project'),
    },
    {
      label: 'مشروع تنمية الاقاليم',
      icon: 'lucide:landmark',
      onClick: () => router.push('/add-devlopment-project'),
    },
    {
      label: 'مشروع استثمارية',
      icon: 'lucide:trending-up',
      disabled: true,
      onClick: () => router.push('/add-project?type=investment'),
    },
    {
      label: 'مشروع تشغيلية',
      icon: 'lucide:settings',
      disabled: true,
      onClick: () => router.push('/add-project?type=operational'),
    },
  ];
  const handleAddProject = (item) => {
    if (item.onClick) {
      item.onClick();
    }
  };
  const getCompletedProjectsCount = () => {
    return allProjects.value.filter((project) => project.projectStatus === 2).length;
  };
  const getInProgressProjectsCount = () => {
    return allProjects.value.filter((project) => project.projectStatus === 1).length;
  };
  const formattedTotalCost = computed(() =>
    formatTotalCost(allProjects.value, selectedCurrency.value)
  );
</script>
