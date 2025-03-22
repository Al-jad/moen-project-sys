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
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
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

  const viewProject = () => {
    router.push({
      name: 'project-details',
      params: { id: props.id.toString() },
    });
  };
</script>
