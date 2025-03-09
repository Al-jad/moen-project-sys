<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter />

      <div class="flex-1 p-6 bg-gray-200 dark:bg-darkmode">
        <!-- Projects Header -->
        <div class="flex items-center justify-between mb-6">
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
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-base font-medium text-right text-gray-900 dark:text-white">
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
                      <Icon :icon="option.icon" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                  <Icon icon="lucide:x" class="w-3 h-3" />
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

        <ProjectsList :projects="allProjects" />
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
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';

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
    {
      id: '4457822',
      title: 'مشروع تطوير نظام مراقبة جودة الهواء',
      department: 'مديرية بيئة النجف',
      startDate: '01.03.2025',
      endDate: '01.09.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 75,
      duration: '6',
    },
    {
      id: '4457823',
      title: 'مشروع معالجة النفايات الصلبة',
      department: 'مديرية بيئة البصرة',
      startDate: '10.02.2025',
      endDate: '10.08.2025',
      status: 'متلكئ',
      statusVariant: 'destructive',
      progress: 35,
      duration: '6',
    },
    {
      id: '4457824',
      title: 'مشروع تحسين جودة المياه في الانهار',
      department: 'مديرية بيئة بغداد',
      startDate: '01.04.2025',
      endDate: '01.04.2026',
      status: 'منجز',
      statusVariant: 'success',
      progress: 100,
      duration: '12',
    },
    {
      id: '4457825',
      title: 'مشروع مراقبة التلوث الصناعي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.03.2025',
      endDate: '15.09.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 60,
      duration: '6',
    },
    {
      id: '4457826',
      title: 'مشروع تطوير المساحات الخضراء',
      department: 'مديرية بيئة النجف',
      startDate: '01.05.2025',
      endDate: '01.11.2025',
      status: 'متلكئ',
      statusVariant: 'destructive',
      progress: 15,
      duration: '6',
    },
    {
      id: '4457827',
      title: 'مشروع ادارة النفايات الطبية',
      department: 'مديرية بيئة بغداد',
      startDate: '01.06.2025',
      endDate: '01.12.2025',
      status: 'منجز',
      statusVariant: 'success',
      progress: 92,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
    {
      id: '4457828',
      title: 'مشروع مراقبة الاشعاع البيئي',
      department: 'مديرية بيئة البصرة',
      startDate: '15.04.2025',
      endDate: '15.10.2025',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
      progress: 55,
      duration: '6',
    },
  ];

  const allProjects = ref(mockProjects);

  const totalProjects = computed(() => allProjects.value.length);
  const paginatedCount = computed(() => Math.min(10, totalProjects.value));

  const selectedSort = ref('');

  const handleSort = (sortId: string) => {
    selectedSort.value = sortId;
    // Add sorting logic here
  };

  const getSelectedSortLabel = computed(() => {
    const option = sortOptions.find((option) => option.id === selectedSort.value);
    return option?.label;
  });

  const clearSort = () => {
    selectedSort.value = '';
  };
</script>
