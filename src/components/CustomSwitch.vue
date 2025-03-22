<template>
  <div class="flex items-center justify-between gap-4">
    <span v-if="label" class="text-sm text-gray-700 dark:text-gray-200">{{ label }}</span>
    <SwitchRoot
      dir="rtl"
      v-model:checked="switchState"
      class="relative flex h-[25px] w-[42px] cursor-default rounded-full border border-gray-200 bg-gray-100 shadow-sm focus-within:outline focus-within:outline-gray-500 data-[state=checked]:bg-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:data-[state=checked]:bg-gray-950"
    >
      <SwitchThumb
        class="my-auto block h-[21px] w-[21px] -translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:-translate-x-[19px]"
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
  });

  const switchState = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (value) => {
      switchState.value = value;
    }
  );

  watch(switchState, (value) => {
    emit('update:modelValue', value);
  });

  const emit = defineEmits(['update:modelValue']);
</script>
