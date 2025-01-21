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
      <div :class="`p-2 bg-${color}-100 dark:bg-${color}-500/20 rounded-full`">
        <component 
          :is="icon" 
          class="w-12 h-12" 
          :class="`text-${color}-600 dark:text-${color}-300`" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
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
    validator: (value) => ['blue', 'green', 'yellow', 'orange'].includes(value)
  },
  icon: {
    type: Object,
    required: true
  }
})
</script> 