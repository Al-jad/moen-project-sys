<template>
  <Select 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    :disabled="disabled"
  >
    <SelectTrigger :class="triggerClass">
      <SelectValue>
        <div class="flex flex-row-reverse items-center gap-2">
          <slot name="icon"></slot>
          <span>{{ 
            modelValue === 'all' ? placeholder : 
            options.find(opt => opt.value === modelValue)?.label || placeholder 
          }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <SelectItem 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
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

defineEmits(['update:modelValue'])
</script> 