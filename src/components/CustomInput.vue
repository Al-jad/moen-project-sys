<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :class="[
        'w-full rounded-lg px-4 py-2 transition-colors',
        'bg-background-surface',
        'border border-border',
        'text-foreground-heading',
        'placeholder:text-foreground-muted',
        'focus:border-primary',
        'outline-none focus:ring-0',
        icon ? 'pr-10' : '',
      ]"
    />
    <div v-if="icon" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <Icon :icon="icon" class="text-foreground-muted h-5 w-5" />
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
