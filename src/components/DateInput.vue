<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        class="justify-between w-full text-right dark:border-gray-700 dark:bg-gray-800"
        :class="[
          !modelValue && 'text-muted-foreground dark:text-gray-400',
          modelValue && 'dark:text-gray-100',
        ]"
      >
        <CalendarIcon class="w-4 h-4 dark:text-gray-400" />
        <span class="text-right text-white ">{{ modelValue ? formatDate(modelValue) : placeholder }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 dark:border-gray-700 dark:bg-gray-800" align="start">
      <Calendar
        mode="single"
        :value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        initialFocus
        class="dark:bg-gray-800 dark:text-gray-100"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import { Calendar } from '@/components/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { CalendarIcon } from 'lucide-vue-next';

  const props = defineProps({
    modelValue: {
      type: Date,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'اختر التاريخ',
    },
  });

  defineEmits(['update:modelValue']);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };
</script>
