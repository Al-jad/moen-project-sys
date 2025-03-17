<template>
  <div
    @click="router.push(`/funded-projects/${project.id}`)"
    class="relative overflow-hidden transition-all duration-300 bg-white border rounded-lg group hover:cursor-pointer hover:border-blue-500/20 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-4">
          <div class="flex">
            <h3
              class="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
            >
              {{ project.name || 'لا يوجد اسم' }}
            </h3>
          </div>
        </div>
        <h3
          class="px-4 py-1 text-lg font-medium text-white transition-all bg-blue-500 rounded-full shadow-sm dark:bg-blue-600"
        >
          {{ formatCost(project.cost) || 0 }} $
        </h3>
      </div>
      <hr class="w-full mb-6 border-gray-200 dark:border-gray-700" />
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(section, index) in cardSections"
          :key="index"
          class="flex flex-col p-2 space-y-4 transition-all bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <div
            v-for="(item, itemIndex) in section.items"
            :key="itemIndex"
            class="flex items-center justify-between"
            :class="{ 'opacity-50 hover:cursor-not-allowed': item.disabled }"
          >
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-full bg-gray-50 dark:bg-gray-500/10">
                <Icon :icon="item.icon" class="w-4 h-4 text-gray-600 dark:text-gray-100" />
              </div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</h3>
            </div>
            <template v-if="item.type === 'progress'">
              <div class="flex items-center gap-2">
                <div class="h-2.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    class="h-full transition-all bg-gray-600 dark:bg-gray-100"
                    :style="{ width: `${item.value || 0}%` }"
                  ></div>
                </div>
                <h3 class="font-semibold text-gray-600 dark:text-gray-100">
                  {{ item.value || 0 }}%
                </h3>
              </div>
            </template>
            <template v-else>
              <h3 class="font-semibold text-gray-600 dark:text-gray-100">
                {{ item.value }}
              </h3>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { Icon } from '@iconify/vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
  });

  const cardSections = [
    {
      items: [
        {
          title: 'المكونات',
          icon: 'lucide:layers',
          value: computed(() => props.project.components?.length || 0),
        },
        {
          title: 'الفعاليات',
          icon: 'lucide:list-todo',
          value: computed(() => getTotalActivities(props.project)),
        },
      ],
    },
    {
      items: [
        {
          title: 'فترة التنفيذ',
          icon: 'formkit:datetime',
          value: computed(
            () =>
              `${props.project.duration} ${props.project.periodType ? (props.project.periodType === 1 ? 'أسبوع' : 'شهر') : ''}`
          ),
        },
        {
          title: 'تاريخ البدء',
          icon: 'lucide:calendar-days',
          value: computed(() => formatDate(props.project.actualStartDate)),
        },
      ],
    },
    {
      items: [
        {
          title: 'الانجاز المالي',
          icon: 'fluent:money-calculator-24-regular',
          type: 'progress',
          value: computed(() => props.project.financialProgress || 0),
        },
        {
          title: 'الإنجاز الفني',
          icon: 'hugeicons:percent-square',
          type: 'progress',
          value: computed(() => props.project.actualProgress || 0),
          disabled: true,
        },
      ],
    },
  ];

  const getTotalActivities = (project) => {
    return (
      project.components?.reduce((total, comp) => total + (comp.activities?.length || 0), 0) || 0
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>
