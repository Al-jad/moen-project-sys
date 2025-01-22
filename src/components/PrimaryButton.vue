<template>
  <Button 
    :class="[
      buttonClass,
      variant === 'link' && 'flex items-center text-blue-600 dark:text-blue-400',
      variant === 'primary' && 'dark:bg-gray-800 dark:text-white text-black dark:border-gray-700 border hover:dark:bg-gray-900 bg-white border-gray-200'
    ]"
    :variant="variant === 'primary' ? 'default' : variant"
    :size="size"
    v-bind="$attrs"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';

withDefaults(defineProps<{
  variant?: 'primary' | 'link' | string;
  size?: string;
  buttonClass?: string;
}>(), {
  variant: 'primary',
  size: 'default',
  buttonClass: ''
});
</script>

