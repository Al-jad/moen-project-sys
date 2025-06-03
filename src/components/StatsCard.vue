<template>
  <div
    class="relative overflow-hidden rounded-xl border bg-background-surface p-4 transition-all duration-300 hover:shadow-md"
  >
    <div class="relative z-10 flex flex-col">
      <div class="text-foreground-subheading mb-1 text-sm">{{ label }}</div>
      <div class="text-2xl font-semibold text-foreground-heading">
        {{ value }}
        <span v-if="unit" class="ml-1 text-sm text-foreground-muted">{{ unit }}</span>
      </div>
      <div v-if="description" class="mt-1 text-xs text-foreground-muted">
        {{ description }}
      </div>
    </div>
    <div
      class="absolute inset-x-0 bottom-0 h-1 opacity-50"
      :style="{ backgroundColor: color }"
    ></div>
  </div>
</template>

<script setup>
  defineProps({
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    unit: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#3B82F6', // Default blue color
    },
  });
</script>
