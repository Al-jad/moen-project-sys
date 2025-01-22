<template>
  <div class="flex items-center gap-2">
    <div 
      class="relative flex items-center"
      @click="toggle"
      @keydown.space.prevent="toggle"
      tabindex="0"
      role="checkbox"
      :aria-checked="modelValue"
    >
      <div 
        :class="[
          'w-4 h-4 rounded border transition-colors cursor-pointer',
          modelValue 
            ? 'bg-primary border-primary dark:bg-primary dark:border-primary' 
            : 'border-gray-300 dark:border-gray-600',
          'hover:border-primary dark:hover:border-primary'
        ]"
      >
        <Check 
          v-if="modelValue" 
          class="absolute w-3 h-3 text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
        />
      </div>
    </div>
    <slot></slot>
    <div v-if="label || $slots.default" class="flex items-center gap-2">
      <component 
        v-if="icon" 
        :is="icon" 
        :class="[iconClass || 'w-4 h-4 text-gray-400 dark:text-gray-500']"
      />
      <label 
        v-if="label"
        :for="id"
        class="text-sm text-gray-800 cursor-pointer select-none dark:text-gray-200"
        @click="toggle"
      >
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  iconClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.bg-primary {
  @apply bg-blue-600;
}
.border-primary {
  @apply border-blue-600;
}
.hover\:border-primary:hover {
  @apply border-blue-600;
}
</style> 