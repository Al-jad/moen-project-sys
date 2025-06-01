<template>
  <ul class="flex flex-row items-center gap-1" :class="$attrs.class">
    <slot />
  </ul>
</template>

<script setup lang="ts">
  interface Props {
    class?: string;
  }

  defineProps<Props>();
</script>
