<template>
  <Select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :disabled="disabled"
  >
    <SelectTrigger
      :class="[
        'flex flex-row-reverse items-center gap-2 !border-border !bg-background-surface transition-all duration-200',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:!bg-background-hover hover:shadow-sm',
        triggerClass,
      ]"
    >
      <Icon v-if="icon" :icon="icon" class="h-4 w-4 text-foreground-muted" />
      <SelectValue :placeholder="placeholder">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'transition-colors duration-200',
              modelValue ? 'font-medium text-foreground' : 'text-foreground-muted',
            ]"
          >
            {{ modelValue === 'all' ? placeholder : selectedLabel || placeholder }}
          </span>
        </div>
      </SelectValue>
    </SelectTrigger>

    <SelectContent
      class="border-border bg-background-surface"
      :class="[
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      ]"
    >
      <SelectGroup>
        <SelectLabel
          v-if="label"
          class="px-2 pb-1.5 pt-1 text-sm font-medium text-foreground-muted"
        >
          {{ label }}
        </SelectLabel>

        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
          class="relative flex items-center justify-end gap-2 border-border transition-all duration-200"
          :class="[
            'hover:scale-[1.01] hover:!bg-background-hover hover:shadow-sm',
            'data-[state=checked]:!bg-primary/10 data-[state=checked]:shadow-sm',
            'data-[state=checked]:after:absolute data-[state=checked]:after:right-0 data-[state=checked]:after:h-full data-[state=checked]:after:w-0.5 data-[state=checked]:after:bg-primary',
            option.disabled && 'cursor-not-allowed opacity-50 hover:scale-100 hover:shadow-none',
          ]"
        >
          <template v-if="isStatusSelect">
            <StatusBadge :status="option.value" :label="option.label" />
          </template>
          <template v-else>
            <div class="flex w-full items-center justify-end gap-2">
              <span
                :class="[
                  'transition-all duration-200',
                  option.value === modelValue
                    ? 'scale-[1.01] font-medium text-primary'
                    : 'text-foreground hover:text-foreground-heading',
                ]"
              >
                {{ option.label }}
              </span>
              <Icon
                v-if="option.icon"
                :icon="option.icon"
                class="h-4 w-4 transition-all duration-200"
                :class="[
                  option.value === modelValue
                    ? 'scale-110 !text-primary'
                    : '!text-foreground-muted',
                  'group-hover:scale-105',
                ]"
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
  import { computed } from 'vue';
  import StatusBadge from './StatusBadge.vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => options.every((option) => 'value' in option && 'label' in option),
    },
    placeholder: {
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
      default: '',
    },
  });

  const selectedLabel = computed(() => {
    const selected = props.options.find((opt) => opt.value === props.modelValue);
    return selected?.label;
  });

  const isStatusSelect = computed(() => {
    const statusValues = ['ongoing', 'completed', 'stopped'];
    return props.options.some((opt) => statusValues.includes(opt.value));
  });

  defineEmits(['update:modelValue']);
</script>
