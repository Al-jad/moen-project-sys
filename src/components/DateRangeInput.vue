<template>
  <Popover>
    <PopoverTrigger>
      <PrimaryButton
        variant="primary"
        class="flex w-56 flex-row justify-start"
        :class="
          modelValue?.start
            ? 'text-foreground dark:text-gray-300'
            : 'text-muted-foreground dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:dark:bg-gray-700'
        "
      >
        <div class="flex items-center gap-2">
          <Icon icon="lucide:calendar" class="h-4 w-4 text-gray-400 dark:text-gray-400" />
          <span>{{ displayText }}</span>
        </div>
      </PrimaryButton>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 dark:border-gray-700 dark:bg-gray-800">
      <RangeCalendar
        v-model="dateRange"
        :number-of-months="2"
        class="dark:border-gray-700 dark:bg-gray-800"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { RangeCalendar } from '@/components/ui/range-calendar';
  import { Icon } from '@iconify/vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';

  const props = defineProps<{
    modelValue?: DateRange;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: DateRange | undefined): void;
  }>();

  const dateRange = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
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
