<template>
  <Button
    :class="[
      buttonClass,
      'flex items-center gap-2',
      variant === 'link' && 'text-foreground-muted',
      variant === 'primary' && 'hover:bg-primary-hover dark:text-foreground-heading border border-border bg-primary',
      variant === 'outline' &&
        'hover:bg-background-hover bg-background-surface border border-border',
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
