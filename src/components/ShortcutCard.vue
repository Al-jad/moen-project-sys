<template>
  <div 
    class="flex items-center justify-between p-8 bg-white dark:bg-gray-800/95 shadow dark:shadow-gray-900/50 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:scale-[1.01] border border-gray-100 dark:border-gray-700/50"
    :class="{ 'cursor-pointer': to }"
    @click="handleClick"
  >
    <span class="text-sm font-medium text-gray-700 dark:text-gray-100">{{ title }}</span>
    <div class="p-2">
      <component 
        :is="icon" 
        class="w-12 h-12 p-2 rounded-full"
        :class="[
          `bg-${color}-100 dark:bg-${color}-500/20`, 
          `text-${color}-600 dark:text-${color}-300`
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  to: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'sky'
  }
});

const handleClick = () => {
  if (props.to) {
    router.push(props.to);
  }
};
</script> 