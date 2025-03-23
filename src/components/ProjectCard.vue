<template>
  <div
    :class="[
      'cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50',
      containerClass,
    ]"
    @click="viewProject"
  >
    <div :class="['flex flex-col gap-4', contentClass]">
      <!-- Status Badge -->
      <div class="flex justify-end">
        <Badge :variant="statusVariant" class="px-3 py-1 text-sm">{{ status }}</Badge>
      </div>

      <!-- Project Name -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <h3
            :class="[
              'line-clamp-2 text-right text-lg font-medium text-gray-900 dark:text-white',
              titleClass,
            ]"
          >
            {{ title }}
          </h3>
          <div
            v-if="projectStatus !== undefined"
            :class="getStatusBadgeClass(projectStatus)"
            class="rounded-full px-3 py-1 text-xs font-medium dark:bg-opacity-20"
          >
            {{ getStatusText(projectStatus) }}
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-between gap-4">
        <div class="flex flex-col gap-1 text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">الجهة المستفيدة</p>
          <p class="text-sm text-gray-900 dark:text-white">{{ department }}</p>
        </div>

      <!-- Department -->
      <div class="flex items-center gap-2 text-right">
        <Icon icon="lucide:building-2" class="h-4 w-4 text-gray-400" />
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ department }}</p>
      </div>

      <!-- Dates -->
      <div class="flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:calendar-days" class="h-4 w-4 text-gray-400" />
            <span class="text-sm text-gray-600 dark:text-gray-300">تاريخ المباشرة</span>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ startDate }}</span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { useRouter } from 'vue-router';
  
  import { Icon } from '@iconify/vue';
  const router = useRouter();
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true,
    },
    title: String,
    department: String,
    startDate: String,
    endDate: String,
    status: String,
    statusVariant: {
      type: String,
      default: 'default',
    },
    projectStatus: {
      type: Number,
      default: undefined,
    },
    containerClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    titleClass: {
      type: String,
      default: '',
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  });

  function getStatusBadgeClass(status) {
    const statusClasses = {
      0: 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-red-100',
      1: 'bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-blue-100',
      2: 'bg-green-100 text-green-700 dark:bg-green-500 dark:text-green-100',
      3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500 dark:text-yellow-100',
    };
    return statusClasses[status] || '';
  }

  function getStatusText(status) {
    const statusMap = {
      0: 'ملغاة',
      1: 'قيد التنفيذ',
      2: 'منجزة',
      3: 'متلكئة',
    };
    return statusMap[status] || 'غير معروف';
  }

  const viewProject = () => {
    router.push({
      name: 'project-details',
      params: { id: props.id.toString() },
    });
  };
</script>
