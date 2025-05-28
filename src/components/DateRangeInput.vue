<template>
  <div class="relative">
    <Popover>
      <PopoverTrigger>
        <PrimaryButton
          class="flex w-auto min-w-56 flex-row justify-start bg-background-surface hover:bg-background-hover"
          :class="[
            modelValue?.start
              ? 'text-foreground'
              : 'text-foreground-muted hover:bg-background-hover',
            isPremium ? 'bg-red-500/10 opacity-80' : '',
          ]"
          :disabled="isPremium"
        >
          <div class="flex w-full flex-wrap items-center gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:calendar" class="h-4 w-4 text-foreground-muted" />
              <span>{{ displayText }}</span>
            </div>
            <div v-if="isPremium" class="flex items-center gap-1 text-xs text-destructive">
              <span> – هذه الميزة غير متوفرة حاليا</span>
              <Icon icon="lucide:lock" class="h-4 w-4" />
            </div>
          </div>
        </PrimaryButton>
      </PopoverTrigger>
      <PopoverContent v-if="!isPremium" class="w-auto p-0">
        <RangeCalendar v-model="dateRange" :number-of-months="2" class="bg-background-surface" />
      </PopoverContent>
    </Popover>

    <!-- Premium feature notice overlay -->
    <div
      v-if="isPremium"
      class="absolute inset-0 z-10 cursor-pointer"
      @click="OpenPremiumModal"
    ></div>
  </div>

  <!-- Premium Modal -->
  <PremiumModal
    v-if="isPremium"
    v-model:open="showPremiumModal"
    @close="showPremiumModal = false"
  />
</template>

<script setup lang="ts">
  import PremiumModal from '@/components/PremiumModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { RangeCalendar } from '@/components/ui/range-calendar';
  import { Icon } from '@iconify/vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';
  import { computed, ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: DateRange;
      placeholder?: string;
      isPremium?: boolean;
    }>(),
    {
      isPremium: false, // Make sure to provide a default value
    }
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: DateRange | undefined): void;
  }>();

  const dateRange = computed({
    get: () => props.modelValue,
    set: (value) => {
      if (!props.isPremium) {
        emit('update:modelValue', value);
      }
    },
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

  // Premium modal handling
  const showPremiumModal = ref(false);
  const OpenPremiumModal = () => {
    if (props.isPremium) {
      showPremiumModal.value = true;
    }
  };
</script>
