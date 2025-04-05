<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <Input
        v-model="inputValue"
        :dir="dir"
        :placeholder="placeholder"
        class="flex-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        @input="handleInput"
        @keypress.enter="handleAdd"
      />
      <Button
        @click="handleAdd"
        type="button"
        class="bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
      >
        {{ buttonText }}
      </Button>
    </div>
    <div
      v-if="items.length > 0"
      class="mt-2 flex flex-wrap gap-2 rounded-md bg-gray-50 p-2 dark:bg-gray-800/50"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm shadow-sm transition-colors dark:bg-gray-800 dark:text-gray-100 dark:shadow-gray-900/10"
      >
        <span>{{ item }}</span>
        <button
          @click="handleRemove(index)"
          class="text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          aria-label="Remove item"
        >
          <Icon icon="lucide:x" class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Input } from '@/components/ui/input';
  import { Icon } from '@iconify/vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    items: {
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

  const emit = defineEmits(['update:modelValue', 'update:items']);
  const inputRef = ref(null);
  const inputValue = ref('');

  const handleInput = (e) => {
    const value = e.target.value;
    inputValue.value = value;
    emit('update:modelValue', value);
  };

  const handleAdd = () => {
    if (inputValue.value?.trim()) {
      emit('update:items', [...props.items, inputValue.value.trim()]);
      inputValue.value = '';
      emit('update:modelValue', '');
      inputRef.value?.focus();
    }
  };

  const handleRemove = (index) => {
    const newItems = [...props.items];
    newItems.splice(index, 1);
    emit('update:items', newItems);
  };

  // Watch for external value changes
  watch(
    () => props.modelValue,
    (newValue) => {
      inputValue.value = newValue;
    },
    { immediate: true }
  );
</script>
