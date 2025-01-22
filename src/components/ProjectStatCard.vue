<template>
  <div 
    class="p-8 transition-all duration-300 bg-white dark:bg-gray-800/95 shadow dark:shadow-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:scale-[1.01] rounded-xl cursor-pointer border border-gray-100 dark:border-gray-700/50" 
    @click="router.push('/projects')"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2 text-right">
        <p class="text-sm text-gray-500 dark:text-gray-300">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ count }}</p>
      </div>
      <div :class="backgroundColorClass">
        <component 
          :is="icon" 
          class="w-8 h-8" 
          :class="iconColorClass" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: [Number, String],
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'yellow', 'red'].includes(value)
  },
  icon: {
    type: Object,
    required: true
  }
})

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400'
  }
}

const backgroundColorClass = computed(() => {
  return `p-3 rounded-full ${colorMap[props.color].bg}`
})

const iconColorClass = computed(() => {
  return colorMap[props.color].icon
})
</script> 