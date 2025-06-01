<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'hover:bg-accent hover:text-accent-foreground',
      'h-10 px-4',
      $attrs.class,
    ]"
    :disabled="disabled"
  >
    <Icon icon="lucide:chevron-right" class="h-4 w-4" />
    <span class="sr-only">Previous page</span>
  </button>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  defineProps<{
    disabled?: boolean;
  }>();
</script>
