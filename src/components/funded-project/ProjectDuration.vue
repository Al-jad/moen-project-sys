<template>
  <FormSection title="المدة والفترة الزمنية" full-width>
    <!-- Main container with 3 distinct sections -->
    <div class="space-y-8">
      <!-- Duration Input Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">تحديد المدة</h3>
        <div class="flex flex-wrap items-end gap-8">
          <FormField label="مدة التنفيذ" class="flex-grow">
            <div class="flex items-center gap-4">
              <NumberInput
                v-model="store.form.duration"
                placeholder="ادخل المدة"
                class="w-full max-w-[12rem]"
              />
              <RadioGroup v-model="store.form.durationType" class="flex gap-4">
                <DurationTypeOption value="weeks" label="أسابيع" />
                <DurationTypeOption value="months" label="أشهر" />
              </RadioGroup>
            </div>
          </FormField>
        </div>
      </div>

      <!-- Time Period Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">نوع الفترة الزمنية</h3>
        <RadioGroup v-model="store.form.periodType" class="grid gap-4 md:grid-cols-2">
          <PeriodTypeCard
            :value="1"
            id="period-weekly"
            title="أسبوعي"
            description="سيتم تقسيم المدة إلى أسابيع"
          />
          <PeriodTypeCard
            :value="2"
            id="period-monthly"
            title="شهري"
            description="سيتم تقسيم المدة إلى أشهر"
          />
        </RadioGroup>
      </div>

      <!-- Dates Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">التواريخ</h3>
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
                class="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
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
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Label } from '@/components/ui/label';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { useFundedProjectStore } from '@/stores/fundedProject';
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
  const DurationTypeOption = defineComponent({
    props: ['value', 'label'],
    setup(props) {
      return () =>
        h('div', { class: 'flex items-center flex-row-reverse gap-2' }, [
          h(RadioGroupItem, { value: props.value, id: `duration-${props.value}` }),
          h(Label, { for: `duration-${props.value}`, class: 'text-sm' }, () => props.label),
        ]);
    },
  });
  const PeriodTypeCard = defineComponent({
    props: ['value', 'id', 'title', 'description'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            class: [
              'flex items-center gap-4 rounded-lg border p-4',
              'bg-white dark:border-gray-600 dark:bg-gray-700/50',
              'transition-colors hover:border-gray-300 dark:hover:border-gray-500',
            ],
            dir: 'rtl',
          },
          [
            h(RadioGroupItem, { value: props.value, id: props.id }),
            h('div', {}, [
              h(Label, { for: props.id, class: 'text-sm font-medium' }, () => props.title),
              h(
                'p',
                { class: 'mt-1.5 text-xs text-gray-500 dark:text-gray-400' },
                props.description
              ),
            ]),
          ]
        );
    },
  });
  const DateDisplay = defineComponent({
    props: ['date', 'formatFn', 'emptyText', 'prefix', 'showDate'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            class: [
              'w-full text-sm flex items-center gap-2',
              'text-gray-900 disabled:text-gray-500 opacity-90 dark:text-gray-100',
            ],
          },
          [
            h(Icon, {
              icon: 'lucide:calendar',
              class: 'h-4 w-4 text-gray-500 dark:text-gray-400',
            }),
            h(
              'span',
              {},
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
