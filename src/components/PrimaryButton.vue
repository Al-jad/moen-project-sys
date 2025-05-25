<template>
  <Button
    :class="[
      buttonClass,
      'flex items-center gap-2',
      variant === 'link' && 'text-foreground-muted',
      variant === 'primary' &&
        'border border-border bg-primary hover:bg-primary-hover dark:text-foreground-heading',
      variant === 'outline' &&
        'border border-border bg-background-surface hover:bg-background-hover',
      variant === 'destructive' && 'bg-destructive hover:bg-destructive/90',
      variant === 'warning' && 'bg-warning hover:bg-warning/90',
      variant === 'accent' && 'bg-accent hover:bg-accent/90',
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
