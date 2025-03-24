<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter 
        :isFundedProjects="false"
        @filter-applied="applyFilters"
        @update:searchQuery="searchQuery = $event"
        @update:budgetRange="budgetRange = $event"
        @update:selectedYear="selectedYear = $event"
        @update:selectedStatus="selectedStatus = $event"
        @update:selectedFunding="selectedFunding = $event"
        @update:selectedBeneficiaries="selectedBeneficiaries = $event"
        :searchQuery="searchQuery"
        :budgetRange="budgetRange"
        :selectedYear="selectedYear"
        :selectedStatus="selectedStatus"
        :selectedFunding="selectedFunding"
        :selectedBeneficiaries="selectedBeneficiaries"
        :beneficiaries="beneficiaries"
      />

      <div class="flex-1 bg-gray-200 p-6 dark:bg-darkmode">
        <!-- Projects Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="space-y-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">قائمة المشاريع</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              النتائج: عرض {{ paginatedCount }} مشروع من اصل {{ totalProjects }} مشروع
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PrimaryButton variant="outline" icon="lucide:align-left"> ترتيب </PrimaryButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-[250px] border-gray-100 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
                  align="end"
                >
                  <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                    <h3 class="text-right text-base font-medium text-gray-900 dark:text-white">
                      ترتيب
                    </h3>
                  </div>
                  <div class="flex flex-col">
                    <DropdownMenuItem
                      v-for="option in sortOptions"
                      :key="option.id"
                      class="flex w-full items-center justify-between border-b px-4 py-2.5 text-right text-sm transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50"
                      :class="{ 'bg-gray-50 dark:bg-gray-700/50': selectedSort === option.id }"
                      @click="handleSort(option.id)"
                    >
                      <Icon :icon="option.icon" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
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

        <ProjectsList :projects="filteredProjects" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
  import ProjectsList from '@/components/ProjectsList.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import projectService from '@/services/projectService';
  import projectUtils from '@/utils/projectUtils';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import axiosInstance from '@/plugins/axios';

  interface SortOption {
    id: string;
    label: string;
    icon: string;
  }

  // Sort Options Configuration
  const sortOptions: SortOption[] = [
    { id: 'price-low', label: 'من السعر الادنى', icon: 'lucide:arrow-down-0-1' },
    { id: 'price-high', label: 'من السعر الاعلى', icon: 'lucide:arrow-up-0-1' },
    { id: 'period-high', label: 'من الفترة الاعلى', icon: 'lucide:arrow-down-narrow-wide' },
    { id: 'period-low', label: 'من الفترة الادنى', icon: 'lucide:arrow-up-narrow-wide' },
    { id: 'progress-high', label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-down-0-1' },
    { id: 'progress-low', label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-up-0-1' },
  ];

  const allProjects = ref([]);
  const filteredProjects = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const beneficiaries = ref([]);

  // Filter states
  const searchQuery = ref('');
  const selectedFunding = ref({
    all: true,
    government: false,
    investment: false,
    operational: false,
    environment: false,
    fund: false,
  });
  const budgetRange = ref([100000, 9000000]);
  const selectedYear = ref('all');
  const selectedStatus = ref({
    all: true,
    completed: false,
    inProgress: false,
    delayed: false,
  });
  const selectedBeneficiaries = ref({ all: true });

  const applyFilters = (filters) => {
    console.log("Applying filters:", filters);
    if (!allProjects.value.length) {
      filteredProjects.value = [];
      return;
    }

    let result = [...allProjects.value];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.id?.toString().includes(query)
      );
    }
    
    // Apply budget range filter
    if (filters.budgetRange && filters.budgetRange.length === 2) {
      const [maxBudget, minBudget] = filters.budgetRange;
      result = result.filter(
        (project) => project.cost >= minBudget && project.cost <= maxBudget
      );
    }
    
    // Apply funding type filter
    if (filters.selectedFunding && !filters.selectedFunding.all) {
      result = result.filter(project => {
        if (filters.selectedFunding.government && project.fundingType === 'government') return true;
        if (filters.selectedFunding.investment && project.fundingType === 'investment') return true;
        if (filters.selectedFunding.operational && project.fundingType === 'operational') return true;
        if (filters.selectedFunding.environment && project.fundingType === 'environment') return true;
        if (filters.selectedFunding.fund && project.fundingType === 'fund') return true;
        return false;
      });
    }
    
    // Apply year filter
    if (filters.selectedYear && filters.selectedYear !== 'all') {
      result = result.filter(project => {
        const year = new Date(project.startDate).getFullYear().toString();
        return year === filters.selectedYear;
      });
    }
    
    // Apply status filter
    if (filters.selectedStatus && !filters.selectedStatus.all) {
      result = result.filter(project => {
        if (filters.selectedStatus.completed && project.status === 'completed') return true;
        if (filters.selectedStatus.inProgress && project.status === 'in-progress') return true;
        if (filters.selectedStatus.delayed && project.status === 'delayed') return true;
        return false;
      });
    }
    
    // Apply beneficiary filter
    if (filters.selectedBeneficiaries && !filters.selectedBeneficiaries.all) {
      result = result.filter(project => {
        return project.beneficiaryId && filters.selectedBeneficiaries[project.beneficiaryId];
      });
    }
    
    filteredProjects.value = result;
  };

  // Fetch projects from API
  const fetchProjects = function () {
    isLoading.value = true;
    error.value = null;

    projectService
      .getAllProjects()
      .then(function (response) {
        const apiProjects = response.data;
        allProjects.value = Array.isArray(apiProjects)
          ? apiProjects.map(projectUtils.transformProject)
          : [];
        filteredProjects.value = [...allProjects.value]; // Initialize filtered projects with all projects
        isLoading.value = false;
      })
      .catch(function (err) {
        console.error('Error fetching projects:', err);
        error.value = err.message || 'Failed to fetch projects';
        allProjects.value = mockProjects;
        filteredProjects.value = [...mockProjects];
        isLoading.value = false;
      });
  };

  // Mock projects for fallback
  const mockProjects = [
    {
      id: '4457821',
      title: 'مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد',
      department: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      startDate: '15.01.2025',
      endDate: '22.12.2025',
      status: 'قيد التنفيذ',
      statusVariant: 'warning',
      progress: 75,
      duration: '12',
    },
    // ... other mock projects
  ];

  const totalProjects = computed(() => allProjects.value.length);
  const paginatedCount = computed(() => Math.min(10, filteredProjects.value.length));

  const selectedSort = ref('');

  const handleSort = function (sortId) {
    selectedSort.value = sortId;

    // Implement sorting logic
    const sortedProjects = [...filteredProjects.value];

    switch (sortId) {
      case 'price-low':
        sortedProjects.sort(function (a, b) {
          return a.cost - b.cost;
        });
        break;
      case 'price-high':
        sortedProjects.sort(function (a, b) {
          return b.cost - a.cost;
        });
        break;
      case 'period-high':
        sortedProjects.sort(function (a, b) {
          return b.duration - a.duration;
        });
        break;
      case 'period-low':
        sortedProjects.sort(function (a, b) {
          return a.duration - b.duration;
        });
        break;
      case 'progress-high':
        sortedProjects.sort(function (a, b) {
          return b.progress - a.progress;
        });
        break;
      case 'progress-low':
        sortedProjects.sort(function (a, b) {
          return a.progress - b.progress;
        });
        break;
      default:
        break;
    }

    filteredProjects.value = sortedProjects;
  };

  const getSelectedSortLabel = computed(() => {
    let selectedLabel = '';
    for (let i = 0; i < sortOptions.length; i++) {
      if (sortOptions[i].id === selectedSort.value) {
        selectedLabel = sortOptions[i].label;
        break;
      }
    }
    return selectedLabel;
  });

  const clearSort = function () {
    selectedSort.value = '';
    // Reset to original order by refetching
    fetchProjects();
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
  onMounted(function () {
    Promise.all([fetchProjects(), fetchBeneficiaries()]);
  });

  // Add this mapping function somewhere in your script setup
  const getTableNameInArabic = (tableName) => {
    if (!tableName) return 'غير محدد'; // "Not specified" for null values
    
    const tableNameMap = {
      'Project': 'المشروع',
      'Attachment': 'المرفقات',
      'Activity': 'النشاط',
      'Beneficiary': 'الجهة المستفيدة',
      'Component': 'المكون',
      'User': 'المستخدم',
      // Add any other table names that might appear in your system
    };
    
    return tableNameMap[tableName] || tableName;
  };
</script>
