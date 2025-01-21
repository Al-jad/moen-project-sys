<template>
  <Button 
    :class="[
      buttonClass,
      variant === 'link' && 'flex items-center text-blue-600 hover:text-blue-700',
      variant === 'primary' && 'bg-slate-800 text-white hover:bg-slate-900'
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

