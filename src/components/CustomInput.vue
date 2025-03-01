<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :class="[
        'w-full rounded-lg px-4 py-2 transition-colors',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'text-gray-900 dark:text-white',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:border-gray-300 dark:focus:border-gray-600',
        'outline-none focus:ring-0',
        icon ? 'pr-10' : '',
      ]"
    />
    <div v-if="icon" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <Icon :icon="icon" class="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    icon: {
      type: String,
      default: '',
    },
  });

  defineEmits(['update:modelValue']);
</script>
