<template>
  <Button
    class="px-8"
    :class="[
      buttonClass,
      'flex items-center gap-2',
      variant === 'link' && 'text-foreground-muted',
      variant === 'primary' &&
        'border border-border bg-primary hover:bg-primary-hover dark:text-foreground-heading',
      variant === 'outline' &&
        'border border-border bg-background-surface/90 hover:bg-background-hover',
      variant === 'destructive' && 'bg-destructive hover:bg-destructive/90',
      variant === 'secondary' && 'bg-secondary hover:bg-secondary/90',
      variant === 'ghost' && 'bg-transparent text-primary hover:bg-primary/10 hover:text-primary',
      variant === 'lock' &&
        'border border-destructive/50 bg-destructive/40 hover:bg-destructive/20',
    ]"
    :variant="variant === 'primary' ? 'default' : variant === 'lock' ? 'outline' : variant"
    :size="size"
    v-bind="$attrs"
  >
    <Icon
      v-if="variant === 'lock' || icon"
      :icon="variant === 'lock' ? 'lucide:lock' : icon"
      :class="iconClass"
    />
    <slot />
  </Button>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  withDefaults(
    defineProps<{
      variant?:
        | 'primary'
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'lock';
      size?: 'default' | 'icon' | 'xs' | 'sm' | 'lg';
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
