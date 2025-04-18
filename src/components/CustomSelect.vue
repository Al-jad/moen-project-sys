<template>
  <Select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :disabled="disabled"
  >
    <SelectTrigger
      :class="triggerClass"
      class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    >
      <Icon :icon="TriggerIcon" class="h-4 w-4" />
      <SelectValue :placeholder="placeholder">
        <div class="flex gap-2">
          <span :class="{ 'text-muted-foreground': !modelValue }">
            {{ modelValue === 'all' ? placeholder : selectedLabel || placeholder }}
          </span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent
      class="flex items-center justify-end border-gray-200 bg-white text-right dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    >
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="flex items-center justify-end gap-2 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <template v-if="isStatusSelect">
            <StatusBadge :status="option.value" :label="option.label" />
          </template>
          <template v-else>
            <div class="flex w-full items-center justify-end gap-2">
              <span>{{ option.label }}</span>
              <Icon
                v-if="option.icon"
                :icon="option.icon"
                class="h-4 w-4 text-gray-400 dark:text-gray-500"
              />
            </div>
          </template>
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
  } from '@/components/ui/select';
  import { Icon } from '@iconify/vue';

  import StatusBadge from './StatusBadge.vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
      // Each option should have value and label, icon is optional
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
    icon: {
      type: String,
      default: null,
    },
    TriggerIcon: {
      type: String,
      default: null,
    },
  });

  const selectedLabel = computed(() => {
    const label = props.options.find((opt) => opt.value === props.modelValue)?.label;
    return label;
  });

  const selectedOption = computed(() =>
    props.options.find((opt) => opt.value === props.modelValue)
  );

  // Check if this select is being used for status
  const isStatusSelect = computed(() => {
    const statusValues = ['ongoing', 'completed', 'stopped'];
    return props.options.some((opt) => statusValues.includes(opt.value));
  });

  defineEmits(['update:modelValue']);
</script>
