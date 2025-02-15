<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter />

      <div class="flex-1 bg-gray-50 p-6 dark:bg-darkmode">
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
                  <PrimaryButton variant="outline" buttonClass="flex items-center gap-2">
                    <AlignLeft class="h-4 w-4" />
                    ترتيب
                  </PrimaryButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-[250px] border-gray-100 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
                  align="end"
                >
                  <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                    <h3 class="text-right text-base font-medium text-gray-900 dark:text-white"
                      >ترتيب</h3
                    >
                  </div>
                  <div class="flex flex-col">
                    <DropdownMenuItem
                      v-for="option in sortOptions"
                      :key="option.id"
                      class="flex w-full items-center justify-between border-b px-4 py-2.5 text-right text-sm transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50"
                      :class="{ 'bg-gray-50 dark:bg-gray-700/50': selectedSort === option.id }"
                      @click="handleSort(option.id)"
                    >
                      <component
                        :is="option.icon"
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
                  <X class="h-3 w-3" />
                </button>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PrimaryButton variant="primary" buttonClass="flex items-center gap-2 p-4">
                  <Plus class="h-4 w-4" />
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

<script setup>
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
  import {
    AlignLeft,
    ArrowDown01,
    ArrowDownNarrowWide,
    ArrowUp01,
    ArrowUpNarrowWide,
    Plus,
    X,
  } from 'lucide-vue-next';
  import { computed, ref } from 'vue';

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

  const sortOptions = [
    { id: 'price-low', label: 'من السعر الادنى', icon: ArrowDown01 },
    { id: 'price-high', label: 'من السعر الاعلى', icon: ArrowUp01 },
    { id: 'period-high', label: 'من الفترة الاعلى', icon: ArrowDownNarrowWide },
    { id: 'period-low', label: 'من الفترة الادنى', icon: ArrowUpNarrowWide },
    { id: 'progress-high', label: 'نسبة الانجاز الاعلى', icon: ArrowDown01 },
    { id: 'progress-low', label: 'نسبة الانجاز الاقل', icon: ArrowUp01 },
  ];

  const selectedSort = ref('');

  const handleSort = (sortId) => {
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
