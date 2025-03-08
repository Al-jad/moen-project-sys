<template>
  <Button
    :class="[
      buttonClass,
      'flex items-center gap-2',
      variant === 'link' && 'text-blue-600 dark:text-blue-400',
      variant === 'primary' &&
        'border border-gray-200 bg-white text-black hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white hover:dark:bg-gray-900',
    ]"
    :variant="variant === 'primary' ? 'default' : variant"
    :size="size"
    v-bind="$attrs"
  >
    <Icon v-if="icon" :icon="icon" :class="iconClass" />
    <slot />
  </Button>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  withDefaults(
    defineProps<{
      variant?: 'primary' | 'link' | string;
      size?: string;
      buttonClass?: string;
      icon?: string;
      iconClass?: string;
    }>(),
    {
      variant: 'primary',
      size: 'default',
      buttonClass: '',
      icon: '',
      iconClass: 'h-5 w-5',
    }
  );
</script>
