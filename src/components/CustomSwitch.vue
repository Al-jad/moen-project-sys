<template>
  <div class="group flex items-center justify-between gap-4">
    <span
      v-if="label"
      class="select-none text-sm font-medium text-foreground-heading transition-colors duration-200 group-hover:text-foreground"
      :class="{
        'opacity-50': disabled,
        'cursor-default': !disabled,
        'cursor-not-allowed': disabled,
      }"
    >
      {{ label }}
    </span>
    <SwitchRoot
      dir="rtl"
      v-model:checked="switchState"
      :disabled="disabled"
      class="relative flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent bg-background-hover shadow-sm outline-none ring-offset-2 ring-offset-background transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary/90"
      :class="{
        'hover:bg-background-hover/50': !disabled && !switchState,
        'cursor-not-allowed': disabled,
      }"
    >
      <SwitchThumb
        class="pointer-events-none my-auto block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 will-change-transform data-[state=checked]:-translate-x-5 data-[state=checked]:bg-white"
      />
    </SwitchRoot>
  </div>
</template>

<script setup lang="ts">
  import { SwitchRoot, SwitchThumb } from 'radix-vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const switchState = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (value) => {
      switchState.value = value;
    }
  );

  watch(switchState, (value) => {
    if (!props.disabled) {
      emit('update:modelValue', value);
    }
  });

  const emit = defineEmits(['update:modelValue']);
</script>
