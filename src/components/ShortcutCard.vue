<template>
  <div 
    class="flex items-center justify-between p-8 bg-white shadow rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:scale-[1.01]"
    :class="{ 'cursor-pointer': to }"
    @click="handleClick"
  >
    <span class="text-sm font-medium">{{ title }}</span>
    <div class="p-2">
      <component 
        :is="icon" 
        class="w-12 h-12 p-2 rounded-full"
        :class="[`bg-${color}-100`, `text-${color}-500`]"
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