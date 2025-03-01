<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BackToMainButton />
          <h1 class="text-xl font-bold dark:text-white">قائمة المهام</h1>
        </div>
        <div class="flex items-center gap-4">
          <CustomSelect
            v-model="selectedProject"
            :options="projectOptions"
            placeholder="اختر المشروع"
            :TriggerIcon="'lucide:folder'"
            :trigger-class="'w-[200px]'"
          />
        </div>
      </div>

      <!-- Tasks Grid -->
      <div class="space-y-8">
        <!-- This Week's Tasks -->
        <div>
          <h2 class="mb-4 text-right font-semibold dark:text-white">هذا الأسبوع</h2>
          <div class="grid gap-4">
            <div
              v-for="task in thisWeekTasks"
              :key="task.id"
              class="relative rounded-lg border bg-white p-4 transition-colors dark:border-gray-700 dark:bg-gray-800"
              :class="{
                'border-2 border-green-500 dark:border-green-500/50': task.status === 'مكتملة',
              }"
            >
              <TaskCard :task="task" @update:task="updateTask" />
            </div>
          </div>
        </div>

        <!-- Older Tasks -->
        <div>
          <h2 class="mb-4 text-right text-lg font-semibold dark:text-white">السابقة</h2>
          <div class="grid gap-4">
            <div
              v-for="task in olderThanWeekTasks"
              :key="task.id"
              class="relative rounded-lg border bg-white p-4 transition-colors dark:border-gray-700 dark:bg-gray-800"
              :class="{
                'border-2 border-green-500 dark:border-green-500/50': task.status === 'مكتملة',
              }"
            >
              <TaskCard :task="task" @update:task="updateTask" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import TaskCard from '@/components/TaskCard.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { computed, ref } from 'vue';

  const selectedProject = ref('all');

  // Project options with icons
  const projectOptions = [
    { value: 'all', label: 'الكل', icon: 'lucide:layout-grid' },
    { value: '1', label: 'مشروع A', icon: 'lucide:folder' },
    { value: '2', label: 'مشروع B', icon: 'lucide:folder' },
  ];

  const tasks = ref([
    {
      id: 1,
      projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
      type: 'اجتماع طارئ',
      notes: 'للتنسيق لحضور اجتماع في اسرع فرصة',
      date: new Date().toLocaleDateString('en-US'),
      time: '10:22',
      sender: 'وكيل الوزير',
      status: 'مكتملة',
      description: 'تم تحديد الاجتماع مع السادة موظفي القسم بتاريخ .....',
    },
    {
      id: 2,
      projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
      type: 'متابعة',
      notes: 'متابعة تقدم العمل في المشروع',
      date: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toLocaleDateString('en-US');
      })(),
      time: '11:00',
      sender: 'مدير المشروع',
      status: 'قيد الانتظار',
      description: 'اجتماع متابعة لمناقشة التقدم في تنفيذ المشروع والتحديات',
    },
    {
      id: 3,
      projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
      type: 'تقرير',
      notes: 'تقديم تقرير الأداء الأسبوعي',
      date: (() => {
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        return dayAfterTomorrow.toLocaleDateString('en-US');
      })(),
      time: '14:30',
      sender: 'رئيس القسم',
      status: 'قيد الاجراء',
      description: 'إعداد وتقديم تقرير الأداء الأسبوعي للمشروع',
    },
    {
      id: 4,
      projectName: 'مشروع تجهيز محطات التحسس الاني لمراقبة المياه في محطة اسالة المياه في السيدية',
      type: 'اجتماع سابق',
      notes: 'اجتماع من الأسبوع الماضي',
      date: '12.08.2024',
      time: '10:22',
      sender: 'وكيل الوزير',
      status: 'مكتملة',
      description: 'تم عقد الاجتماع وتوثيق النتائج',
    },
  ]);

  const thisWeekTasks = computed(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)

    return tasks.value.filter((task) => {
      const taskDate = new Date(task.date.split('.').reverse().join('-'));
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  });

  const olderThanWeekTasks = computed(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week

    return tasks.value.filter((task) => {
      const taskDate = new Date(task.date.split('.').reverse().join('-'));
      return taskDate < startOfWeek;
    });
  });

  const updateTask = (updatedTask) => {
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  };
</script>
