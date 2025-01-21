<template>
  <span 
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" 
    :class="[bgColor, textColor]"
  >
    <span class="w-2 h-2 mr-1.5 rounded-full" :style="{ backgroundColor: dotColor }"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const statusColors = {
  ongoing: {
    dot: '#eab308',
    bg: 'bg-yellow-100',
    text: 'text-yellow-600'
  },
  completed: {
    dot: '#22c55e',
    bg: 'bg-green-100',
    text: 'text-green-600'
  },
  stopped: {
    dot: '#ef4444',
    bg: 'bg-red-100',
    text: 'text-red-600'
  }
}

const dotColor = computed(() => statusColors[props.status]?.dot || '#94a3b8')
const bgColor = computed(() => statusColors[props.status]?.bg || 'bg-gray-100')
const textColor = computed(() => statusColors[props.status]?.text || 'text-gray-600')
</script> 