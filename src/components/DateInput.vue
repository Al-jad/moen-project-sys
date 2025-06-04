<template>
  <Popover>
    <PopoverTrigger asChild>
      <PrimaryButton
        variant="outline"
        class="w-full justify-between text-right"
        :class="[!modelValue && 'text-foreground-muted', modelValue && 'text-foreground-heading']"
      >
        <span class="text-right text-foreground-heading">
          {{ modelValue ? formatDate(modelValue) : placeholder }}
        </span>
        <Icon icon="lucide:calendar" class="h-4 w-4 text-foreground-muted" />
      </PrimaryButton>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
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
    return date.toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>
