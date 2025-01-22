<template>
  <Popover>
    <PopoverTrigger>
      <PrimaryButton 
        variant="primary" 
        class="flex flex-row-reverse justify-start w-56"
        :class="modelValue?.start ? 'text-foreground dark:text-gray-300' : 'text-muted-foreground dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:dark:bg-gray-700'"
      >
        <div class="flex items-center gap-2">
          <CalendarIcon class="w-4 h-4 text-gray-400 dark:text-gray-400" />
          <span>{{ displayText }}</span>
        </div>
      </PrimaryButton>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
      <RangeCalendar 
        v-model="dateRange"
        :number-of-months="2"
        class="dark:border-gray-700 dark:bg-gray-800"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DateRange } from 'radix-vue';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import PrimaryButton from '@/components/PrimaryButton.vue';

const props = defineProps<{
  modelValue?: DateRange;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange | undefined): void;
}>();

const dateRange = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const df = new DateFormatter('ar', { dateStyle: 'medium' });

const displayText = computed(() => {
  if (!dateRange.value?.start) {
    return props.placeholder || 'من تاريخ الى';
  }

  if (!dateRange.value?.end) {
    return df.format(dateRange.value.start.toDate(getLocalTimeZone()));
  }

  return `${df.format(dateRange.value.start.toDate(getLocalTimeZone()))} - ${df.format(dateRange.value.end.toDate(getLocalTimeZone()))}`;
});
</script>
