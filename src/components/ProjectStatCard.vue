<template>
  <div class="p-8 transition-all duration-300 bg-white shadow hover:bg-gray-100 hover:shadow-md hover:scale-[1.01] rounded-xl cursor-pointer" @click="router.push('/projects')">
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2 text-right">
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold">{{ count }}</p>
      </div>
      <div :class="`p-2 bg-${color}-100 rounded-full`">
        <component 
          :is="icon" 
          class="w-12 h-12" 
          :class="`text-${color}-500`" 
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