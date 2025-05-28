<template>
  <div class="custom-radio-group" :class="[orientation, { 'is-disabled': disabled }]">
    <RadioGroup
      v-model="selectedValue"
      :disabled="disabled"
      class="w-full"
      :class="[
        orientation === 'horizontal' ? 'flex gap-4' : 'grid gap-4',
        orientation === 'grid' && `grid-cols-${columns}`,
        groupClass,
      ]"
    >
      <template v-if="variant === 'card'">
        <label
          v-for="option in options"
          :key="option.value"
          :for="option.id || `radio-${option.value}`"
          class="group/card flex cursor-pointer select-none items-center gap-4 rounded-lg border border-border bg-background-card p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-background-hover hover:shadow-md"
          :class="[
            option.value === modelValue ? 'border-primary/50 bg-primary/5' : '',
            option.class,
          ]"
          :dir="direction"
        >
          <div
            v-if="option.icon"
            class="rounded-lg bg-primary/10 p-2 transition-transform duration-200 group-hover/card:scale-105"
          >
            <Icon :icon="option.icon" class="h-4 w-4 text-primary" />
          </div>
          <div class="flex-1">
            <div class="cursor-pointer text-sm font-medium text-foreground-heading">
              {{ option.label }}
            </div>
            <p v-if="option.description" class="mt-1 text-xs text-foreground-muted">
              {{ option.description }}
            </p>
          </div>
          <RadioGroupItem
            :value="option.value"
            :id="option.id || `radio-${option.value}`"
            class="relative h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :class="[
              option.value === modelValue ? 'border-primary bg-primary' : 'border-border',
              props.variant === 'card' ? 'mt-0.5' : '',
            ]"
          >
            <!-- The internal Check of RadioGroupItem will be used and styled via CSS -->
          </RadioGroupItem>
        </label>
      </template>

      <template v-else>
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center"
          :class="[
            variant === 'button'
              ? 'flex-row-reverse gap-2 rounded-lg border border-border bg-background-card p-2 transition-colors duration-200 hover:bg-background-hover'
              : 'gap-3',
            option.class,
          ]"
        >
          <RadioGroupItem
            :value="option.value"
            :id="option.id || `radio-${option.value}`"
            class="relative h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :class="[
              option.value === modelValue ? 'border-primary bg-primary' : 'border-border',
              props.variant === 'card' ? 'mt-0.5' : '',
            ]"
          >
            <!-- The internal Check of RadioGroupItem will be used and styled via CSS -->
          </RadioGroupItem>
          <Label
            :for="option.id || `radio-${option.value}`"
            class="cursor-pointer select-none text-sm font-medium"
            :class="[
              option.value === modelValue ? 'text-primary' : 'text-foreground-heading',
              { 'hover:text-foreground': !disabled },
            ]"
          >
            {{ option.label }}
          </Label>
        </div>
      </template>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
  import { Label } from '@/components/ui/label';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';

  interface RadioOption {
    value: string | number;
    label: string;
    description?: string;
    icon?: string;
    id?: string;
    class?: string;
  }

  const props = defineProps<{
    modelValue: string | number;
    options: RadioOption[];
    variant?: 'default' | 'button' | 'card';
    orientation?: 'vertical' | 'horizontal' | 'grid';
    columns?: number;
    disabled?: boolean;
    direction?: 'rtl' | 'ltr';
    groupClass?: string;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: string | number];
  }>();

  const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
</script>

<style scoped>
  .custom-radio-group {
    width: 100%;
  }

  .custom-radio-group.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .custom-radio-group.is-disabled :deep(*) {
    cursor: not-allowed !important;
  }

  /*
    Target the Check icon within a selected RadioGroupItem.
    The RadioGroupItem (button) gets 'bg-primary' when selected in CustomRadioGroup.vue.
    The Check icon inside (from ui/radio-group/RadioGroupItem.vue) has the class 'text-primary'.
    We need to make this 'text-primary' icon white when its parent has 'bg-primary'.
  */
  :deep(button.bg-primary .text-primary) {
    color: white !important;
  }

  /*
    As an additional safeguard, also target using data-state="checked"
    which is a common pattern for Radix-UI based components (reka-ui is based on Radix).
  */
  :deep(button[data-state='checked'].bg-primary .text-primary) {
    color: white !important;
  }
</style>
