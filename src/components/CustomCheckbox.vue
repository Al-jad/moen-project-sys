<template>
  <div class="flex items-center gap-2">
    <div
      class="relative flex items-center"
      @click="toggle"
      @keydown.space.prevent="toggle"
      tabindex="0"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
      :class="[disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80']"
    >
      <div
        :class="[
          'relative h-4 w-4 rounded border transition-all duration-200',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          modelValue
            ? '!border-primary !bg-primary !text-primary-foreground ring-2 ring-primary/10'
            : 'border-border bg-background-surface hover:bg-background-hover',
          !disabled && !modelValue && 'hover:border-primary hover:ring-1 hover:ring-primary/20',
        ]"
      >
        <Icon
          v-if="modelValue"
          icon="lucide:check"
          class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-200"
          :class="[modelValue ? 'scale-100 text-primary-foreground' : 'scale-0 text-transparent']"
        />
      </div>
    </div>
    <slot></slot>
    <div v-if="label || $slots.default" class="flex items-center gap-2">
      <Icon v-if="icon" :icon="icon" :class="[iconClass || 'h-4 w-4 text-foreground-muted']" />
      <label
        v-if="label"
        :for="id"
        class="select-none text-sm text-foreground transition-colors"
        :class="[
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:text-foreground-heading',
        ]"
        @click="toggle"
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
    if (props.disabled) return;
    emit('update:modelValue', !props.modelValue);
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
