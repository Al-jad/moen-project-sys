<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'

const switchState = ref(false)

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['update:modelValue'])

watch(switchState, (value) => {
  emit('update:modelValue', value)
})
</script>

<template>
  <div class="flex gap-2 items-center" :class="props.class">
    <label
      class="text-white text-[15px] leading-none pr-[15px] select-none"
      for="input"
    >
      {{ label }}
    </label>
    <SwitchRoot
      dir="rtl"
      id="input"
      v-model:checked="switchState"
      class="w-[42px] h-[25px] border border-black/100 focus-within:outline focus-within:outline-black flex bg-black/400 shadow-sm rounded-full relative data-[state=checked]:bg-black cursor-default"
    >
      <SwitchThumb
        class="block w-[21px] h-[21px] my-auto bg-white shadow-sm rounded-full transition-transform duration-100 -translate-x-0.5 will-change-transform data-[state=checked]:-translate-x-[19px]"
      />
    </SwitchRoot>
  </div>
</template>