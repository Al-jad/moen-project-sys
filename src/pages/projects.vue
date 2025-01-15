<template>
  <DefaultLayout>
    <div class="flex flex-1">
      <ProjectsFilter />
      
      <div class="flex-1 p-6">
        <!-- Projects Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="space-y-1">
            <h1 class="text-2xl font-bold">قائمة المشاريع</h1>
            <p class="text-sm text-gray-500">
              النتائج: عرض {{ paginatedCount }} مشروع من اصل {{ totalProjects }} مشروع
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" class="flex items-center gap-2">
                    <AlignLeft class="w-4 h-4" />
                    ترتيب
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[250px] p-0" align="end">
                  <div class="px-4 py-3 border-b">
                    <h3 class="text-base font-medium text-right">ترتيب</h3>
                  </div>
                  <div class="flex flex-col">
                    <DropdownMenuItem
                      v-for="option in sortOptions"
                      :key="option.id"
                      class="flex items-center justify-between w-full px-4 py-2.5 text-sm text-right transition-colors hover:bg-gray-50 border-b last:border-b-0 focus:bg-gray-50"
                      :class="{ 'bg-gray-50': selectedSort === option.id }"
                      @click="handleSort(option.id)"
                    >
                      <component 
                        :is="option.icon" 
                        class="w-4 h-4 text-gray-500"
                      />
                      {{ option.label }}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div 
                v-if="selectedSort" 
                class="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 rounded-lg text-gray-700"
              >
                <span>{{ getSelectedSortLabel }}</span>
                <button 
                  class="p-0.5 hover:bg-gray-200 rounded-full"
                  @click="clearSort"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
            <Button
              variant="default"
              class="flex items-center gap-2 p-4 bg-slate-700 hover:bg-slate-700/90"
            >
              <Plus class="w-4 h-4" />
              اضافة مشروع جديد
            </Button>
          </div>
        </div>

        <ProjectsList :projects="allProjects" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { Plus, AlignLeft, ArrowDown01, ArrowUp01, X, ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-vue-next';
  import ProjectsList from '@/components/ProjectsList.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';

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
  ];

  const allProjects = ref(mockProjects);

  const totalProjects = computed(() => allProjects.value.length);
  const paginatedCount = computed(() => Math.min(5, totalProjects.value));

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
    const option = sortOptions.find(option => option.id === selectedSort.value);
    return option?.label;
  });

  const clearSort = () => {
    selectedSort.value = '';
  };
</script>
