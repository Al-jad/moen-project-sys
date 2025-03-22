<template>
  <div class="flex items-center gap-2">
    <div
      class="relative flex items-center"
      @click="!disabled && toggle"
      @keydown.space.prevent="!disabled && toggle"
      tabindex="0"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
    >
      <div
        :class="[
          'h-4 w-4 rounded border transition-colors',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          modelValue
            ? 'border-primary bg-primary dark:border-primary dark:bg-primary'
            : 'border-gray-300 dark:border-gray-600',
          !disabled && 'hover:border-primary dark:hover:border-primary',
        ]"
      >
        <Icon
          v-if="modelValue"
          icon="lucide:check"
          class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform text-white"
        />
      </div>
    </div>
    <slot></slot>
    <div v-if="label || $slots.default" class="flex items-center gap-2">
      <Icon
        v-if="icon"
        :icon="icon"
        :class="[iconClass || 'h-4 w-4 text-gray-400 dark:text-gray-500']"
      />
      <label
        v-if="label"
        :for="id"
        class="select-none text-sm text-gray-800 dark:text-gray-200"
        :class="{ 'cursor-not-allowed opacity-50': disabled }"
        @click="!disabled && toggle"
      >
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const toggle = () => {
    if (!props.disabled) {
      emit('update:modelValue', !props.modelValue);
    }
  };
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
