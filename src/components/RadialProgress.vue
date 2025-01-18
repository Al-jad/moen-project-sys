<template>
  <div class="relative w-full h-full">
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke-width="8"
        :class="[
          'fill-none',
          variant === 'success' ? 'stroke-green-100' : 
          variant === 'warning' ? 'stroke-yellow-100' : 
          variant === 'destructive' ? 'stroke-red-100' : 
          'stroke-blue-100'
        ]"
      />
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke-width="8"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="fill-none transition-all duration-500 ease-in-out"
        :class="[
          variant === 'success' ? 'stroke-green-500' : 
          variant === 'warning' ? 'stroke-yellow-500' : 
          variant === 'destructive' ? 'stroke-red-500' : 
          'stroke-blue-500'
        ]"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span :class="[
        'text-sm font-medium',
        variant === 'success' ? 'text-green-600' : 
        variant === 'warning' ? 'text-yellow-600' : 
        variant === 'destructive' ? 'text-red-600' : 
        'text-blue-600'
      ]">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'destructive'].includes(value)
  }
})

const radius = 28
const circumference = computed(() => 2 * Math.PI * radius)
const dashOffset = computed(() => circumference.value - (props.progress / 100) * circumference.value)
</script> 