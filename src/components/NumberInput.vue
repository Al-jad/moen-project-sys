<template>
  <div class="relative">
    <Input
      v-model="inputValue"
      type="text"
      dir="rtl"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      @input="handleInput"
      @keypress="onlyNumbers"
    />
    <span
      class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
      >{{ unit }}</span
    >
  </div>
</template>

<script setup>
  import { Input } from '@/components/ui/input';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    format: {
      type: Function,
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue']);
  const inputValue = ref('');

  // Define utility functions first
  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  };

  // Only allow numbers and basic keyboard controls
  const onlyNumbers = (e) => {
    const char = String.fromCharCode(e.keyCode);
    const regex = /[0-9]|\./;
    if (!regex.test(char)) {
      e.preventDefault();
    }
  };

  // Handle input changes
  const handleInput = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters except commas
    const cleanValue = value.replace(/[^\d,]/g, '');
    inputValue.value = cleanValue;
    const unformattedValue = unformatNumber(cleanValue);
    emit('update:modelValue', unformattedValue ? Number(unformattedValue) : 0);
  };

  // Watch for external value changes
  watch(
    () => props.modelValue,
    (newValue) => {
      inputValue.value = formatNumber(newValue);
    },
    { immediate: true }
  );
</script>
