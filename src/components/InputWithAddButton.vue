<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <Input
        v-model="inputValue"
        :dir="dir"
        :placeholder="placeholder"
        class="flex-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        @keyup.enter="handleAdd"
      />
      <Button
        @click="handleAdd"
        type="button"
        class="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        {{ buttonText }}
      </Button>
    </div>
    <div
      v-if="modelValue.length > 0"
      class="mt-2 flex flex-wrap gap-2 rounded-md bg-gray-50 p-2 dark:bg-gray-800/50"
    >
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-sm shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:shadow-gray-900/10"
      >
        <span>{{ item }}</span>
        <button
          @click="handleRemove(index)"
          class="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <Icon icon="lucide:x" class="h-3 w-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Input } from '@/components/ui/input';
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'اضافة',
    },
    dir: {
      type: String,
      default: 'rtl',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const inputValue = ref('');

  const handleAdd = () => {
    if (inputValue.value.trim()) {
      emit('update:modelValue', [...props.modelValue, inputValue.value.trim()]);
      inputValue.value = '';
    }
  };

  const handleRemove = (index) => {
    const newValue = [...props.modelValue];
    newValue.splice(index, 1);
    emit('update:modelValue', newValue);
  };
</script>
