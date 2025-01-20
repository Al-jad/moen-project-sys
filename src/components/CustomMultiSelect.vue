<template>
  <div class="relative w-full">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      @click="isOpen = !isOpen"
      :disabled="disabled"
    >
      <div class="flex flex-row-reverse items-center gap-2 w-full">
        <slot name="icon"></slot>
        <div class="flex flex-wrap gap-1 justify-end">
          <span v-if="!selectedLabels.length" class="text-muted-foreground">{{ placeholder }}</span>
          <div 
            v-for="label in selectedLabels" 
            :key="label"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 rounded"
          >
            {{ label }}
          </div>
        </div>
      </div>
      <ChevronDown class="h-4 w-4 opacity-50" :class="{ 'transform rotate-180': isOpen }" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
    >
      <div class="p-1">
        <div v-for="option in options" :key="option.value" class="relative">
          <button
            type="button"
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            @click="toggleOption(option.value)"
          >
            <div class="flex items-center gap-2 w-full">
              <Checkbox 
                :checked="isSelected(option.value)"
                @update:checked="() => toggleOption(option.value)"
              />
              {{ option.label }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(option => 
      'value' in option && 'label' in option
    )
  },
  placeholder: {
    required: true,
    type: String,
    default: 'اختر...'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  triggerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)

const selectedLabels = computed(() => {
  return props.modelValue.map(value => 
    props.options.find(opt => opt.value === value)?.label
  ).filter(Boolean)
})

const isSelected = (value) => {
  return props.modelValue.includes(value)
}

const toggleOption = (value) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.transform {
  transform: rotate(180deg);
}
</style> 