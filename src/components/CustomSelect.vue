<template>
  <Select 
    :model-value="modelValue"  
    @update:model-value="$emit('update:modelValue', $event)"
    :disabled="disabled"
  >
    <SelectTrigger :class="triggerClass" class="bg-white border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700">
      <SelectValue :placeholder="placeholder">
        <div class="flex flex-row-reverse items-center gap-2">
          <slot name="icon"></slot>
          <template v-if="isStatusSelect && modelValue">
            <StatusBadge :status="modelValue" :label="selectedLabel" />
          </template>
          <template v-else>
            <span :class="{ 'text-muted-foreground': !modelValue }">
              {{ modelValue === 'all' ? placeholder : selectedLabel || placeholder }}
            </span>
          </template>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup class="bg-gray-800 dark:bg-gray-800">
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <SelectItem 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          class="flex items-center justify-end gap-2 hover:bg-gray-700 dark:hover:bg-gray-700"
        >
          <template v-if="isStatusSelect">
            <StatusBadge :status="option.value" :label="option.label" />
          </template>
          <span v-else>{{ option.label }}</span>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true,
    // Each option should have value and label
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

const selectedLabel = computed(() => 
  props.options.find(opt => opt.value === props.modelValue)?.label
)

// Check if this select is being used for status
const isStatusSelect = computed(() => {
  const statusValues = ['ongoing', 'completed', 'stopped']
  return props.options.some(opt => statusValues.includes(opt.value))
})

defineEmits(['update:modelValue'])
</script> 