<template>
  <div :class="['card-base', containerClass]" @click="viewProject">
    <div :class="['flex flex-col gap-4', contentClass]">
      <!-- Status Badge -->
      <div class="flex justify-end">
        <Badge :variant="statusVariant" class="px-3 py-1 text-sm">{{ status }}</Badge>
      </div>

      <!-- Project Info -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <h3
            :class="[
              'line-clamp-2 text-right text-lg font-medium text-gray-900 dark:text-white',
              titleClass,
            ]"
          >
            {{ title }}
          </h3>
        </div>

        <!-- Department -->
        <div class="flex items-center gap-2 text-right">
          <Icon icon="lucide:building-2" class="h-4 w-4 text-gray-400" />
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ department }}</p>
        </div>
      </div>

      <!-- Date Section -->
      <div class="date-section">
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
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Icon } from '@iconify/vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true,
    },
    title: String,
    department: String,
    startDate: String,
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
  });

  const statusConfig = {
    0: { class: 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-red-100', text: 'ملغاة' },
    1: {
      class: 'bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-blue-100',
      text: 'قيد التنفيذ',
    },
    2: {
      class: 'bg-green-100 text-green-700 dark:bg-green-500 dark:text-green-100',
      text: 'منجزة',
    },
    3: {
      class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500 dark:text-yellow-100',
      text: 'متلكئة',
    },
  };

  const getStatusBadgeClass = (status) => statusConfig[status]?.class || '';
  const getStatusText = (status) => statusConfig[status]?.text || 'غير معروف';

  const viewProject = () => {
    router.push({
      name: 'project-details',
      params: { id: props.id.toString() },
    });
  };
</script>

<style scoped>
  .card-base {
    @apply cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50;
  }

  .status-badge {
    @apply rounded-full px-3 py-1 text-xs font-medium dark:bg-opacity-20;
  }

  .date-section {
    @apply flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-700;
  }
</style>
