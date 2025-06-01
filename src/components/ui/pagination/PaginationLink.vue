<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      isActive
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : 'hover:bg-accent hover:text-accent-foreground',
      size === 'sm' ? 'h-8 px-3' : 'h-10 px-4',
      $attrs.class,
    ]"
    :aria-current="isActive ? 'page' : undefined"
    :aria-label="ariaLabel || `Page ${$slots.default?.()?.[0]?.children || ''}`"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  interface Props {
    isActive?: boolean;
    size?: 'sm' | 'default';
    ariaLabel?: string;
  }

  withDefaults(defineProps<Props>(), {
    isActive: false,
    size: 'default',
  });
</script>
