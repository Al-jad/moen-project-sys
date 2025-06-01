<template>
  <span class="flex h-10 w-10 items-center justify-center" :class="$attrs.class">
    <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
    <span class="sr-only">More pages</span>
  </span>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
</script>
