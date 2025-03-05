<template>
  <div class="relative">
    <Input
      :value="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      type="text"
      dir="rtl"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    />
    <span
      class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
      >{{ unit }}</span
    >
  </div>
</template>

<script setup>
  import { Input } from '@/components/ui/input';

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

  const displayValue = computed(() => {
    if (!props.modelValue) return '';
    return props.format ? props.format(props.modelValue) : formatNumber(props.modelValue);
  });

  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  };

  const handleInput = (event) => {
    const value = event.target.value;
    const unformattedValue = unformatNumber(value);

    // Only allow numbers
    if (!/^\d*$/.test(unformattedValue)) {
      event.preventDefault();
      return;
    }

    emit('update:modelValue', unformattedValue);
  };

  const handleBlur = (event) => {
    const value = event.target.value;
    const unformattedValue = unformatNumber(value);

    if (unformattedValue) {
      emit('update:modelValue', unformattedValue);
    }
  };
</script>
