<template>
  <div class="relative w-full">
    <button
      type="button"
      class="flex h-auto min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      @click="isOpen = !isOpen"
      :disabled="disabled"
    >
      <div class="flex w-full flex-row-reverse items-start gap-2">
        <slot name="icon"></slot>
        <div class="flex max-h-[80px] w-full flex-wrap justify-end gap-1 overflow-y-auto">
          <span v-if="!selectedLabels.length" class="text-muted-foreground dark:text-gray-400">{{
            placeholder
          }}</span>
          <div
            v-for="(label, index) in selectedLabels"
            :key="index"
            class="group inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-gray-700 dark:text-gray-100"
          >
            <span class="max-w-[150px] truncate">{{ label }}</span>
            <button
              @click.stop="removeOption(getValueByLabel(label))"
              class="transition-opacity group-hover:opacity-100"
            >
              <Icon icon="lucide:x" class="h-3 w-3 hover:text-red-500 dark:hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <Icon icon="lucide:chevron-down" class="h-4 w-4 shrink-0 opacity-50 dark:text-gray-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="max-h-[200px] overflow-y-auto p-1">
        <div v-for="option in options" :key="option.value" class="relative">
          <button
            type="button"
            class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            @click="toggleOption(option.value)"
          >
            <div class="flex w-full items-center gap-2">
              <Checkbox
                :checked="isSelected(option.value)"
                @update:checked="() => toggleOption(option.value)"
                class="dark:border-gray-600"
              />
              <span class="truncate">{{ option.label }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
      default: () => [],
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => options.every((option) => 'value' in option && 'label' in option),
    },
    placeholder: {
      required: true,
      type: String,
      default: 'اختر...',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    triggerClass: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue']);
  const isOpen = ref(false);

  const selectedLabels = computed(() => {
    return props.modelValue
      .map((value) => props.options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  });

  const isSelected = (value) => {
    return props.modelValue.includes(value);
  };

  const getValueByLabel = (label) => {
    return props.options.find((opt) => opt.label === label)?.value;
  };

  const toggleOption = (value) => {
    const newValue = [...props.modelValue];
    const index = newValue.indexOf(value);

    if (index === -1) {
      newValue.push(value);
    } else {
      newValue.splice(index, 1);
    }

    emit('update:modelValue', newValue);
  };

  const removeOption = (value) => {
    if (value) {
      const newValue = props.modelValue.filter((v) => v !== value);
      emit('update:modelValue', newValue);
    }
  };
</script>

<style scoped>
  .transform {
    transform: rotate(180deg);
  }

  /* Custom scrollbar styles */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }

  /* Dark mode scrollbar */
  .dark .overflow-y-auto {
    scrollbar-color: #4b5563 transparent;
  }

  .dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #4b5563;
  }
</style>
