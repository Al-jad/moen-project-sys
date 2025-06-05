<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
    :class="[bgColor, textColor]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
  import { projectStatusColors } from '@/utils/statusBadge';
  import { computed } from 'vue';

  const props = defineProps<{
    status: string;
    label: string;
  }>();

  const bgColor = computed(
    () => projectStatusColors[props.status]?.bg || 'bg-gray-100 dark:bg-gray-800'
  );
  const textColor = computed(
    () => projectStatusColors[props.status]?.text || 'text-gray-700 dark:text-gray-400'
  );
</script>
