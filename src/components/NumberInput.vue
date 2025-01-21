<template>
  <div class="relative">
    <Input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="number"
      dir="rtl"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="w-full"
    />
    <span class="absolute text-sm text-gray-500 -translate-y-1/2 left-2 top-1/2">{{ unit }}</span>
  </div>
</template>

<script setup>
import { Input } from '@/components/ui/input';

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script> 