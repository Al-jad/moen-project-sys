<template>
  <div class="relative">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="[
        'w-full resize-none rounded-lg px-4 py-2 transition-colors',
        'bg-background-surface',
        'border border-border',
        'text-foreground',
        'placeholder:text-foreground-muted',
        'focus:border-primary',
        'outline-none focus:ring-0',
        icon ? 'pr-10' : '',
      ]"
    />
    <div v-if="icon" class="absolute right-0 top-2 flex items-start pr-3">
      <Icon :icon="icon" class="h-5 w-5 text-foreground-muted" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';

  defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    rows: {
      type: Number,
      default: 3,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
  });

  defineEmits(['update:modelValue']);
</script>
