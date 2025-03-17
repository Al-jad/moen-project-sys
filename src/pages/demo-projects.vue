<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter />

      <main class="flex-1 bg-gray-200 p-6 dark:bg-darkmode">
        <div class="mb-6 flex items-center justify-between">
          <div class="space-y-1">
            <BackToMainButton />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ getProjectTitle }}
            </h1>
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
          </div>
        </div>
        <Premium />
        <div class="grid grid-cols-1 gap-6">
          <FundedProjectCard
            disabled
            v-for="project in filteredProjects"
            :key="project.id"
            :project="{
              id: project.id,
              name: project.title,
              cost: formatCost(project.cost),
              duration: project.duration,
              actualStartDate: project.startDate,
              components: [],
              financialProgress: project.progress,
              actualProgress: project.progress,
            }"
          />
        </div>
      </main>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import FundedProjectCard from '@/components/FundedProjectCard.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const allProjects = ref([
    // Investment Projects
    {
      id: 'INV001',
      title: 'مشروع تجهيز مضخات لمحطة اسالة المياه في الرشيد',
      department: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      startDate: '15.01.2025',
      endDate: '22.12.2025',
      status: 'قيد التنفيذ',
      statusVariant: 'warning',
      progress: 75,
      duration: '12',
      cost: 1500000,
      type: 'investment',
    },
    {
      id: 'INV002',
      title: 'مشروع تطوير محطة الطاقة الشمسية',
      department: 'دائرة الطاقة المتجددة',
      startDate: '01.03.2025',
      endDate: '01.03.2026',
      status: 'جديد',
      statusVariant: 'info',
      progress: 0,
      duration: '12',
      cost: 2500000,
      type: 'investment',
    },
    {
      id: 'INV003',
      title: 'مشروع بناء مجمع صناعي',
      department: 'دائرة التنمية الصناعية',
      startDate: '01.06.2025',
      endDate: '01.12.2026',
      status: 'متوقف',
      statusVariant: 'error',
      progress: 35,
      duration: '18',
      cost: 3500000,
      type: 'investment',
    },

    // Operational Projects
    {
      id: 'OPR001',
      title: 'مشروع تطوير شبكة الصرف الصحي',
      department: 'دائرة المشاريع العامة',
      startDate: '01.03.2025',
      endDate: '30.09.2025',
      status: 'جديد',
      statusVariant: 'info',
      progress: 0,
      duration: '6',
      cost: 800000,
      type: 'operational',
    },
    {
      id: 'OPR002',
      title: 'مشروع صيانة الطرق السريعة',
      department: 'دائرة الطرق والجسور',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد التنفيذ',
      statusVariant: 'warning',
      progress: 45,
      duration: '6',
      cost: 1200000,
      type: 'operational',
    },
    {
      id: 'OPR003',
      title: 'مشروع تحديث شبكة الكهرباء',
      department: 'دائرة الكهرباء',
      startDate: '01.05.2025',
      endDate: '01.11.2025',
      status: 'مكتمل',
      statusVariant: 'success',
      progress: 100,
      duration: '6',
      cost: 950000,
      type: 'operational',
    },

    // Regional Projects
    {
      id: 'REG001',
      title: 'مشروع تنمية المناطق الريفية',
      department: 'دائرة التنمية الإقليمية',
      startDate: '01.06.2025',
      endDate: '01.06.2026',
      status: 'مكتمل',
      statusVariant: 'success',
      progress: 100,
      duration: '12',
      cost: 2000000,
      type: 'regional',
    },
    {
      id: 'REG002',
      title: 'مشروع تطوير المدارس في المناطق النائية',
      department: 'دائرة التربية والتعليم',
      startDate: '01.07.2025',
      endDate: '01.01.2026',
      status: 'قيد التنفيذ',
      statusVariant: 'warning',
      progress: 60,
      duration: '6',
      cost: 1500000,
      type: 'regional',
    },
    {
      id: 'REG003',
      title: 'مشروع إنشاء مراكز صحية في القرى',
      department: 'دائرة الصحة',
      startDate: '15.08.2025',
      endDate: '15.08.2026',
      status: 'جديد',
      statusVariant: 'info',
      progress: 0,
      duration: '12',
      cost: 2500000,
      type: 'regional',
    },
  ]);

  const isLoading = ref(false);
  const error = ref(null);

  // Sort Options Configuration
  const sortOptions = [
    { id: 'price-low', label: 'من السعر الادنى', icon: 'lucide:arrow-down-0-1' },
    { id: 'price-high', label: 'من السعر الاعلى', icon: 'lucide:arrow-up-0-1' },
    { id: 'period-high', label: 'من الفترة الاعلى', icon: 'lucide:arrow-down-narrow-wide' },
    { id: 'period-low', label: 'من الفترة الادنى', icon: 'lucide:arrow-up-narrow-wide' },
    { id: 'progress-high', label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-down-0-1' },
    { id: 'progress-low', label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-up-0-1' },
  ];

  const selectedSort = ref('');

  const getProjectTitle = computed(() => {
    const type = route.params.type as string;
    switch (type) {
      case 'investment':
        return 'المشاريع الإستثمارية';
      case 'operational':
        return 'المشاريع التشغيلية';
      case 'regional':
        return 'مشاريع تنمية الأقاليم';
      default:
        return 'المشاريع';
    }
  });

  // Filter projects based on route type
  const filteredProjects = computed(() => {
    const type = route.params.type as string;
    return allProjects.value.filter((project) => project.type === type);
  });

  const totalProjects = computed(() => filteredProjects.value.length);
  const paginatedCount = computed(() => Math.min(10, totalProjects.value));

  const handleSort = (sortId) => {
    selectedSort.value = sortId;
    const sortedProjects = [...allProjects.value];

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
        sortedProjects.sort((a, b) => b.progress - a.progress);
        break;
      case 'progress-low':
        sortedProjects.sort((a, b) => a.progress - b.progress);
        break;
    }

    allProjects.value = sortedProjects;
  };

  const getSelectedSortLabel = computed(() => {
    const option = sortOptions.find((opt) => opt.id === selectedSort.value);
    return option ? option.label : '';
  });

  const clearSort = () => {
    selectedSort.value = '';
  };

  const formatCost = (value: number) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>
