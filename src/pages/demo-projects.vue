<template>
  <DefaultLayout>
    <div class="flex min-h-screen">
      <div class="w-[25%] border-r border-border bg-background-surface">
        <ProjectsFilter disabled />
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
                    <BackToMainButton />
                    <h1 class="text-3xl font-bold text-foreground">{{ getProjectTitle }}</h1>
                    <p class="text-foreground-muted">
                      النتائج: عرض {{ paginatedCount }} مشروع من اصل {{ totalProjects }} مشروع
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
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
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-border bg-background-surface shadow-sm">
              <div class="border-b border-border p-6">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-foreground">المشاريع</h2>
                    <Badge class="bg-primary/10 px-3 py-1 text-primary">
                      {{ paginatedCount }} من {{ totalProjects }} مشروع
                    </Badge>
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
                    v-if="error"
                    class="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-8 text-center"
                  >
                    <Icon icon="lucide:alert-circle" class="mb-4 h-12 w-12 text-destructive" />
                    <h3 class="mb-2 text-lg font-medium text-destructive"
                      >حدث خطأ في تحميل المشاريع</h3
                    >
                    <p class="mb-4 text-sm text-destructive">{{ error }}</p>
                  </div>
                  <div
                    v-else-if="filteredProjects.length === 0"
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
                  >
                    <Icon icon="lucide:search-x" class="mb-4 h-12 w-12 text-foreground-muted" />
                    <h3 class="mb-2 text-lg font-semibold text-foreground">لا توجد نتائج مطابقة</h3>
                    <p class="mb-4 text-sm text-foreground-muted">
                      لم يتم العثور على اي مشاريع تطابق معايير البحث المحددة.
                    </p>
                  </div>
                  <div v-else class="space-y-6">
                    <div class="grid grid-cols-1 gap-6">
                      <FundedProjectCard
                        disabled
                        v-for="project in filteredProjects"
                        :key="project.id"
                        :project="{
                          id: project.id,
                          name: project.title,
                          cost: formatCost(project.cost, 'IQD'),
                          duration: project.duration,
                          actualStartDate: project.startDate,
                          components: [],
                          financialProgress: project.progress,
                          actualProgress: project.progress,
                        }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { formatCost } from '@/utils/formatCost';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  interface Project {
    id: string;
    title: string;
    department: string;
    startDate: string;
    endDate: string;
    status: string;
    statusVariant: string;
    progress: number;
    duration: string;
    cost: number;
    type: 'investment' | 'operational' | 'regional';
  }

  interface DropdownItem {
    label: string;
    icon?: string;
    disabled?: boolean;
    class?: string;
    onClick?: () => void;
  }

  const route = useRoute();
  const router = useRouter();
  const allProjects = ref<Project[]>([
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
  const error = ref<string | null>(null);

  // Sort Options Configuration
  const sortMap: Record<string, string> = {
    'من السعر الادنى': 'price-low',
    'من السعر الاعلى': 'price-high',
    'من الفترة الاعلى': 'period-high',
    'من الفترة الادنى': 'period-low',
    'نسبة الانجاز الاعلى': 'progress-high',
    'نسبة الانجاز الاقل': 'progress-low',
  };

  const sortOptions: DropdownItem[] = [
    { label: 'من السعر الادنى', icon: 'lucide:arrow-down-0-1' },
    { label: 'من السعر الاعلى', icon: 'lucide:arrow-up-0-1' },
    { label: 'من الفترة الاعلى', icon: 'lucide:arrow-down-narrow-wide' },
    { label: 'من الفترة الادنى', icon: 'lucide:arrow-up-narrow-wide' },
    { label: 'نسبة الانجاز الاعلى', icon: 'lucide:arrow-down-0-1' },
    { label: 'نسبة الانجاز الاقل', icon: 'lucide:arrow-up-0-1' },
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

  const handleSort = (item: DropdownItem) => {
    const sortId = sortMap[item.label];
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
    return sortOptions.find((opt) => sortMap[opt.label] === selectedSort.value)?.label || '';
  });

  const clearSort = () => {
    selectedSort.value = '';
  };
</script>
