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
                  :value="getTotalComponents()"
                  label="اجمالي المكونات"
                  color="green"
                />
                <BaseStatsCard
                  icon="lucide:list-todo"
                  :value="getTotalActivitiesAll()"
                  label="اجمالي الفعاليات"
                  color="purple"
                />
                <BaseStatsCard
                  icon="lucide:dollar-sign"
                  :value="formatTotalCost()"
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
<script setup>
  import BaseStatsCard from '@/components/BaseStatsCard.vue';
  import CustomDrop from '@/components/CustomDrop.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import { useToast } from '@/composables/useToast';
  import { CURRENCY_CONVERSION, UNITS } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import beneficiaryService from '@/services/beneficiaryService';
  import fundedProjectService from '@/services/fundedProjectService';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  const projects = ref([]);
  const filteredProjects = ref([]);
  const isLoading = ref(true);
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
    filteredProjects.value = sortedProjects;
  };
  const handleSortSelect = (item) => {
    handleSort(item.id);
  };
  const getSelectedSortLabel = computed(() => {
    const option = sortOptions.find((opt) => opt.id === selectedSort.value);
    return option ? option.label : '';
  });
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
  const searchQuery = ref('');
  const selectedFunding = ref({
    all: true,
    government: false,
    investment: false,
    operational: false,
    environment: false,
    fund: false,
  });
  const budgetRange = ref(minMaxBudgetRange);
  const selectedYear = ref('all');
  const selectedBeneficiaries = ref({ all: true });
  const isBudgetFilterEnabled = ref(false);
  const selectedCurrency = ref(localStorage.getItem('selectedCurrency') || 'IQD');
  const currencyOptions = [
    { value: 'IQD', label: UNITS.CURRENCY.IQD },
    { value: 'USD', label: UNITS.CURRENCY.USD },
  ];
  const { showSuccess } = useToast();
  const applyFilters = (filters) => {
    console.log('Applying filters:', filters);
    if (!projects.value.length) {
      filteredProjects.value = [];
      return;
    }
    console.log('Total projects before filtering:', projects.value.length);
    let result = [...projects.value];
    const isAnyFilterActive =
      (filters.searchQuery && filters.searchQuery.trim() !== '') ||
      !filters.selectedStatus.all ||
      !filters.selectedBeneficiaries.all ||
      filters.showGovernmentProjects ||
      filters.isBudgetFilterEnabled;
    if (!isAnyFilterActive) {
      console.log('No active filters, showing all projects');
      filteredProjects.value = result;
      return;
    }
    console.log(
      'Sample projects before filtering:',
      result.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.projectStatus,
        cost: p.cost,
        isGovernment: p.isGovernment,
      }))
    );
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      console.log('Searching for:', query);
      const beforeCount = result.length;
      result = result.filter((project) => {
        const matches =
          (project.name && project.name.toLowerCase().includes(query)) ||
          (project.executingDepartment &&
            project.executingDepartment.toLowerCase().includes(query)) ||
          (project.implementingEntity &&
            project.implementingEntity.toLowerCase().includes(query)) ||
          (project.grantingEntity && project.grantingEntity.toLowerCase().includes(query)) ||
          (project.projectObjectives && project.projectObjectives.toLowerCase().includes(query)) ||
          (project.id && project.id.toString().includes(query));
        if (matches) {
          console.log('Match found:', {
            id: project.id,
            name: project.name,
            dept: project.executingDepartment,
          });
        }
        return matches;
      });
      console.log(`Search filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }
    if (filters.isBudgetFilterEnabled && filters.budgetRange && filters.budgetRange.length === 2) {
      const [minBudget, maxBudget] = filters.budgetRange;
      console.log(`Budget filter (enabled): Min=${minBudget}, Max=${maxBudget}`);
      const beforeCount = result.length;
      result = result.filter((project) => {
        const cost = parseFloat(project.cost) || 0;
        const isInRange = cost >= minBudget && cost <= maxBudget;
        if (project.id < 5) {
          console.log(
            `Project ${project.id} cost: ${cost}, Range: ${minBudget}-${maxBudget}, In range: ${isInRange}`
          );
        }
        return isInRange;
      });
      console.log(`Budget filter applied. Before: ${beforeCount}, After: ${result.length}`);
    } else {
      console.log('Budget filter not enabled or values not set');
    }
    if (filters.selectedStatus && !filters.selectedStatus.all) {
      console.log('Status filter:', filters.selectedStatus);
      const beforeCount = result.length;
      result = result.filter((project) => {
        const statusMatches =
          (filters.selectedStatus.completed && project.projectStatus === 2) ||
          (filters.selectedStatus.inProgress && project.projectStatus === 1) ||
          (filters.selectedStatus.delayed && project.projectStatus === 3) ||
          (filters.selectedStatus.cancelled && project.projectStatus === 0);
        if (project.id < 90) {
          console.log(
            `Status check: Project ${project.id}, Status=${project.projectStatus}, Matches=${statusMatches}`
          );
        }
        return statusMatches;
      });
      console.log(`Status filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }
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
    if (filters.selectedBeneficiaries && !filters.selectedBeneficiaries.all) {
      console.log('Beneficiary filter:', filters.selectedBeneficiaries);
      const beforeCount = result.length;
      result = result.filter((project) => {
        if (!project.beneficiaries || project.beneficiaries.length === 0) {
          return false;
        }
        const beneficiaryMatches = project.beneficiaries.some(
          (beneficiary) => filters.selectedBeneficiaries[beneficiary.id]
        );
        return beneficiaryMatches;
      });
      console.log(`Beneficiary filter applied. Before: ${beforeCount}, After: ${result.length}`);
    }
    filteredProjects.value = result;
    currentPage.value = 1;
    console.log('Final filtered projects count:', filteredProjects.value.length);
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
    try {
      isLoading.value = true;
      const response = await fundedProjectService.getAllFundedProjects();
      const fetchedProjects = response.data || [];
      projects.value = fetchedProjects;
      filteredProjects.value = [...fetchedProjects];
    } catch (error) {
      console.error('Error fetching projects:', error);
      projects.value = [];
      filteredProjects.value = [];
    } finally {
      isLoading.value = false;
    }
  };
  const fetchBeneficiaries = async () => {
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
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
          selectedStatus: {
            all: !route.query.status,
            completed: route.query.status === '2',
            inProgress: route.query.status === '1',
            delayed: route.query.status === '3',
            cancelled: route.query.status === '0',
          },
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
  const viewProject = (projectId) => {
    router.push({
      name: 'funded-projects-details',
      params: { id: projectId },
    });
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
  const formatTotalCost = () => {
    const total = projects.value.reduce((sum, project) => {
      return sum + (Number(project.cost) || 0);
    }, 0);
    return formatCost(total);
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const getStatusDisplay = (projectStatus) => {
    switch (projectStatus) {
      case 1:
        return 'completed';
      case 2:
        return 'in-progress';
      case 3:
        return 'delayed';
      default:
        return 'in-progress';
    }
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
    if (budgetRange.value) {
      budgetRange.value = budgetRange.value.map((value) => {
        if (newCurrency === 'USD') {
          return value * 1450;
        } else {
          return value / 1450;
        }
      });
    }
  };
</script>
