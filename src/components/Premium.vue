<template>
  <div class="mb-6 flex items-center justify-between">
    <div class="px-2 text-red-500">
      <slot name="message"> الميزة غير متاحة، والبيانات الظاهرة للتوضيح فقط </slot>
    </div>
    <div
      class="mx-2 flex items-center rounded-md border border-red-500 bg-white p-2 dark:bg-gray-700"
    >
      <Icon icon="lucide:lock" class="ml-1 h-5 w-5 text-red-500" />
      <span class="text-red-500">
        <slot>هذه الميزة غير متوفرة حاليا</slot>
      </span>
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
