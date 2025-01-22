<template>
  <div class="flex flex-col gap-6 p-6 mt-4 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-gray-900/10">
    <h2 class="text-xl font-semibold text-right text-gray-900 dark:text-gray-100">{{ title }}</h2>
    <div :class="['grid grid-cols-1 gap-x-6 gap-y-4', fullWidth ? 'md:grid-cols-1' : 'md:grid-cols-2']">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
});
</script> 