<template>
  <div class="rounded-xl border border-border bg-background-surface p-6">
    <div class="flex items-center gap-4">
      <div class="rounded-lg p-3" :class="iconBackgroundClass">
        <Icon :icon="icon" class="h-6 w-6" :class="iconClass" />
      </div>
      <div class="flex-1">
        <div class="text-2xl font-bold text-foreground">
          {{ value }}
        </div>
        <div class="text-sm text-foreground-muted">
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';

  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'blue',
      validator: (value) =>
        ['blue', 'green', 'purple', 'amber', 'red', 'indigo', 'pink', 'cyan'].includes(value),
    },
  });

  const iconBackgroundClass = computed(() => {
    const colorMap = {
      blue: 'bg-blue-500/10 dark:bg-blue-500/20',
      green: 'bg-green-500/10 dark:bg-green-500/20',
      purple: 'bg-purple-500/10 dark:bg-purple-500/20',
      amber: 'bg-amber-500/10 dark:bg-amber-500/20',
      red: 'bg-red-500/10 dark:bg-red-500/20',
      indigo: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      pink: 'bg-pink-500/10 dark:bg-pink-500/20',
      cyan: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    };
    return colorMap[props.color];
  });

  const iconClass = computed(() => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      amber: 'text-amber-600 dark:text-amber-400',
      red: 'text-red-600 dark:text-red-400',
      indigo: 'text-indigo-600 dark:text-indigo-400',
      pink: 'text-pink-600 dark:text-pink-400',
      cyan: 'text-cyan-600 dark:text-cyan-400',
    };
    return colorMap[props.color];
  });
</script>
