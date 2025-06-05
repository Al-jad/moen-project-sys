<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <CustomInput
        v-model="localValue"
        dir="rtl"
        :placeholder="placeholder"
        class="flex-1"
        @keydown.enter.prevent="addItem"
      />
      <PrimaryButton @click="addItem" variant="primary" icon="lucide:plus">
        {{ buttonText || 'اضافة' }}
      </PrimaryButton>
    </div>
    <div v-if="items?.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-1 rounded-lg border bg-background-hover px-3 py-1 text-sm"
      >
        <span class="text-foreground-heading">{{ item }}</span>
        <PrimaryButton
          variant="delete"
          class="bg-transparent p-0 hover:bg-transparent hover:underline"
          @click="removeItem(index)"
        >
          <Icon icon="lucide:x" class="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue', 'update:items']);

  const localValue = ref('');

  const addItem = () => {
    if (localValue.value.trim()) {
      const newItems = [...props.items];
      newItems.push(localValue.value.trim());
      emit('update:items', newItems);
      localValue.value = '';
    }
  };

  const removeItem = (index) => {
    const newItems = [...props.items];
    newItems.splice(index, 1);
    emit('update:items', newItems);
  };
</script>
