<template>
  <div 
    :class="[
      'rounded-xl bg-white dark:bg-gray-800/95 p-6 shadow-sm dark:shadow-gray-900/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700/50', 
      containerClass
    ]" 
    @click="viewProject"
  >
    <div :class="['flex flex-col gap-4', contentClass]">
      <div class="flex flex-col gap-2">
        <h3 :class="['line-clamp-2 text-right text-lg font-medium text-gray-900 dark:text-white', titleClass]">
          {{ title }}
        </h3>
      </div>
      <div class="flex flex-row justify-between gap-4">
        <div class="flex flex-col gap-1 text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">الجهة المستفيدة</p>
          <p class="text-sm text-gray-900 dark:text-white">{{ department }}</p>
        </div>

        <div class="flex flex-col items-start gap-2 mb-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">حالة المشروع</p>
          <Badge :variant="statusVariant" class="px-3 py-1">{{ status }}</Badge>
        </div>
      </div>

      <div class="flex flex-row-reverse items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500 dark:text-gray-400">تاريخ الانجاز</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ endDate }}</span>
        </div>
        <div>
          <span class="flex items-center text-gray-400 dark:text-gray-500"> - </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500 dark:text-gray-400">تاريخ المباشرة</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ startDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
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
