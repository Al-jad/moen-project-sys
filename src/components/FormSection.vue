<template>
  <div class="mt-4 flex flex-col gap-6 rounded-lg bg-background-card p-6 shadow">
    <h2 class="text-right text-xl font-semibold text-foreground">{{ title }}</h2>
    <div
      :class="['grid grid-cols-1 gap-x-6 gap-y-4', fullWidth ? 'md:grid-cols-1' : 'md:grid-cols-2']"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  });
</script>
