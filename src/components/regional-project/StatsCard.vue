<template>
  <div class="flex-1 rounded-xl border border-border bg-background-surface p-6">
    <div class="flex items-center gap-4">
      <div
        class="rounded-lg p-3"
        :class="[
          color === 'blue' && 'bg-blue-500/10 dark:bg-blue-500/20',
          color === 'green' && 'bg-green-500/10 dark:bg-green-500/20',
          color === 'purple' && 'bg-purple-500/10 dark:bg-purple-500/20',
          color === 'orange' && 'bg-orange-500/10 dark:bg-orange-500/20',
        ]"
      >
        <Icon
          :icon="icon"
          class="h-6 w-6"
          :class="[
            color === 'blue' && 'text-blue-600 dark:text-blue-400',
            color === 'green' && 'text-green-600 dark:text-green-400',
            color === 'purple' && 'text-purple-600 dark:text-purple-400',
            color === 'orange' && 'text-orange-600 dark:text-orange-400',
          ]"
        />
      </div>
      <div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ value }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  defineProps<{
    icon: string;
    value: string | number;
    label: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
  }>();
</script>
