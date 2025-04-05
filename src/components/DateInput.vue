<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        class="w-full justify-between text-right dark:border-gray-700 dark:bg-gray-800"
        :class="[
          !modelValue && 'text-gray-500 dark:text-gray-400',
          modelValue && 'text-gray-900 dark:text-gray-100',
        ]"
      >
        <span class="text-right text-gray-900 dark:text-white">
          {{ modelValue ? formatDate(modelValue) : placeholder }}
        </span>
        <Icon icon="lucide:calendar" class="h-4 w-4 dark:text-gray-400" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 dark:border-gray-700 dark:bg-gray-800" align="start">
      <Calendar
        mode="single"
        :value="modelValue ? new Date(modelValue) : null"
        @update:model-value="
          (calendarObj) => {
            if (!calendarObj) {
              $emit('update:modelValue', null);
              return;
            }
            const dateStr = `${calendarObj.year}-${String(calendarObj.month).padStart(2, '0')}-${String(calendarObj.day).padStart(2, '0')}`;
            $emit('update:modelValue', dateStr);
          }
        "
        initialFocus
        class="dark:bg-gray-800 dark:text-gray-100"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup>
  import { Calendar } from '@/components/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'اختر التاريخ',
    },
  });

  defineEmits(['update:modelValue']);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>
