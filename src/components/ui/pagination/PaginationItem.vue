<template>
  <li>
    <slot />
  </li>
</template>

<script setup lang="ts">
  interface Props {
    class?: string;
    size?: 'sm' | 'default';
  }

  withDefaults(defineProps<Props>(), {
    size: 'default',
  });
</script>
