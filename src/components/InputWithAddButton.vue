<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <Input
        v-model="inputValue"
        :dir="dir"
        :placeholder="placeholder"
        class="flex-1"
        @keyup.enter="handleAdd"
      />
      <Button @click="handleAdd" type="button">{{ buttonText }}</Button>
    </div>
    <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2 p-2 mt-2 rounded-md bg-gray-50">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-md shadow-sm"
      >
        <span>{{ item }}</span>
        <button @click="handleRemove(index)" class="text-gray-500 hover:text-red-500">
          <X class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'اضافة'
  },
  dir: {
    type: String,
    default: 'rtl'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')

const handleAdd = () => {
  if (inputValue.value.trim()) {
    emit('update:modelValue', [...props.modelValue, inputValue.value.trim()])
    inputValue.value = ''
  }
}

const handleRemove = (index) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}
</script> 