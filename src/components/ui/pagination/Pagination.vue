<template>
  <nav
    role="navigation"
    :aria-label="label"
    class="mx-auto flex w-full justify-center"
    :class="$attrs.class"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
  defineProps<{
    label?: string;
  }>();
</script>
