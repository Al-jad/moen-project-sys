<template>
  <FormSection title="المدة والفترة الزمنية" full-width>
    <div class="space-y-6">
      <div
        class="group rounded-xl border border-border bg-background-surface p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
      >
        <div class="mb-6 flex items-center gap-3">
          <div class="rounded-lg bg-primary/10 p-2">
            <Icon icon="lucide:clock" class="h-5 w-5 text-primary" />
          </div>
          <h3 class="text-lg font-medium text-foreground-heading">تحديد المدة</h3>
        </div>
        <div class="flex flex-wrap items-end gap-8">
          <FormField label="مدة التنفيذ" class="w-full">
            <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div class="flex w-full min-w-[12rem] flex-row items-start gap-2 sm:w-auto">
                <NumberInput
                  v-model="store.form.duration"
                  placeholder="ادخل المدة"
                  class="w-full"
                />
                <CustomRadioGroup
                  v-model="store.form.durationType"
                  :options="[
                    { value: 'weeks', label: 'أسابيع', icon: 'lucide:clock' },
                    { value: 'months', label: 'أشهر', icon: 'lucide:calendar' },
                  ]"
                  variant="button"
                  orientation="horizontal"
                  direction="rtl"
                  groupClass="flex-shrink-0"
                />
              </div>
            </div>
          </FormField>
        </div>
      </div>
      <div
        class="group rounded-xl border border-border bg-background-surface p-6 shadow-sm transition-all duration-300 hover:border-accent/20 hover:shadow-md"
      >
        <div class="mb-6 flex items-center gap-3">
          <div class="rounded-lg bg-accent/10 p-2">
            <Icon icon="lucide:calendar-days" class="h-5 w-5 text-accent" />
          </div>
          <h3 class="text-lg font-medium text-foreground-heading">نوع الفترة الزمنية</h3>
        </div>
        <CustomRadioGroup
          v-model="store.form.periodType"
          :options="[
            {
              value: 1,
              label: 'أسبوعي',
              description: 'سيتم تقسيم المدة إلى أسابيع',
              icon: 'lucide:clock',
            },
            {
              value: 2,
              label: 'شهري',
              description: 'سيتم تقسيم المدة إلى أشهر',
              icon: 'lucide:calendar',
            },
          ]"
          variant="card"
          orientation="grid"
          :columns="2"
          direction="rtl"
        />
      </div>
      <div
        class="group rounded-xl border border-border bg-background-surface p-6 shadow-sm transition-all duration-300 hover:border-info/20 hover:shadow-md"
      >
        <div class="mb-6 flex items-center gap-3">
          <div class="rounded-lg bg-info/10 p-2">
            <Icon icon="lucide:calendar-range" class="h-5 w-5 text-info" />
          </div>
          <h3 class="text-lg font-medium text-foreground-heading">التواريخ</h3>
        </div>
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="تاريخ البدء">
            <DateInput
              v-model="store.form.actualStartDate"
              class="w-full"
              type="datetime-local"
              :min="new Date().toISOString().split('T')[0]"
            />
          </FormField>
          <FormField label="تاريخ الانتهاء المتوقع">
            <div class="flex h-[2.5rem] items-center">
              <div
                class="flex h-10 w-full items-center rounded-md border border-border bg-background-card px-3 py-2 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DateDisplay
                  :show-date="!!(store.form.actualStartDate && store.form.duration)"
                  :date="
                    calculateEndDate(
                      store.form.actualStartDate,
                      store.form.duration,
                      store.form.durationType
                    )
                  "
                  empty-text="سيظهر بعد تحديد تاريخ البدء والمدة"
                  prefix="تاريخ الانتهاء:"
                />
              </div>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </FormSection>
</template>
<script setup>
  import CustomRadioGroup from '@/components/CustomRadioGroup.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import { Icon } from '@iconify/vue';
  import { defineComponent, h } from 'vue';
  const store = useFundedProjectStore();
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const calculateEndDate = (startDateString, duration, durationType) => {
    if (!startDateString || !duration) return '';
    const start = new Date(startDateString);
    const durationNum = parseInt(duration);
    if (durationType === 'weeks') {
      start.setDate(start.getDate() + durationNum * 7);
    } else if (durationType === 'months') {
      start.setMonth(start.getMonth() + durationNum);
    }
    return start.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const DateDisplay = defineComponent({
    props: ['date', 'formatFn', 'emptyText', 'prefix', 'showDate'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            class: ['w-full text-sm flex items-center gap-2', 'text-foreground-heading'],
          },
          [
            h(Icon, {
              icon: 'lucide:calendar',
              class: 'h-4 w-4 text-muted-foreground',
            }),
            h(
              'span',
              {
                class:
                  props.showDate !== false && props.date
                    ? 'text-foreground-heading'
                    : 'text-foreground-muted',
              },
              props.showDate !== false && props.date
                ? `${props.prefix} ${props.formatFn ? props.formatFn(props.date) : props.date}`
                : props.emptyText
            ),
          ]
        );
    },
  });
</script>
<style scoped>
  input[type='date']::-webkit-calendar-picker-indicator {
    @apply dark:invert;
  }
</style>
