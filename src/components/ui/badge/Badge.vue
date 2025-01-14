<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
});

const variants = {
  default: 'bg-primary/80 text-primary-foreground hover:bg-primary/60',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-red-100 text-red-700 hover:bg-red-100/80',
  outline: 'text-foreground',
  success: 'bg-green-100 text-green-700 hover:bg-green-100/80',
  warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80'
};
</script>

<template>
  <div
    :class="cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variants[variant]
    )"
  >
    <slot />
  </div>
</template>
