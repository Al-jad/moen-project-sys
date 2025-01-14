<template>
  <div class="flex" dir="rtl">
    <Sidebar />

    <div class="mr-[60px] mt-[92px] flex flex-1">
      <ProjectsFilter />

      <main class="flex-1 bg-gray-200">
        <Header />

        <div class="p-6">
          <!-- Projects Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="space-y-1">
              <h1 class="text-2xl font-bold">قائمة المشاريع</h1>
              <p class="text-sm text-gray-500">
                النتائج: عرض {{ paginatedCount }} مشروع من اصل {{ totalProjects }} مشروع
              </p>
            </div>

            <div class="flex items-center gap-3">
              <Button variant="outline" class="flex items-center gap-2">
                <AlignLeft class="w-4 h-4" />
                ترتيب
              </Button>
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
      </main>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { Plus, AlignLeft } from 'lucide-vue-next';
  import Header from '@/components/Header.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import ProjectsList from '@/components/ProjectsList.vue';
  import ProjectsFilter from '@/components/ProjectsFilter.vue';
  import { Button } from '@/components/ui/button';

  const mockProjects = [
    {
      id: 1,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 2,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
    {
      id: 3,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'متلكئ',
      statusVariant: 'destructive',
    },
    {
      id: 4,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 5,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
    {
      id: 6,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'متلكئ',
      statusVariant: 'destructive',
    },
    {
      id: 7,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'منجز',
      statusVariant: 'success',
    },
    {
      id: 8,
      title: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه',
      department: 'مديرية بيئة بغداد',
      startDate: '15.01.2025',
      endDate: '22.12.205',
      status: 'قيد الانجاز',
      statusVariant: 'warning',
    },
  ];

  const allProjects = ref(mockProjects);

  const totalProjects = computed(() => allProjects.value.length);
  const paginatedCount = computed(() => Math.min(5, totalProjects.value));
</script>
