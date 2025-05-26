<template>
  <FormSection title="المدة والفترة الزمنية" full-width>
    <!-- Main container with 3 distinct sections -->
    <div class="space-y-6">
      <!-- Enhanced Duration Input Section -->
      <div
        class="p-6 transition-all duration-300 border shadow-sm group rounded-xl border-border bg-background-surface hover:border-primary/20 hover:shadow-md"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 rounded-lg bg-primary/10">
            <Icon icon="lucide:clock" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="text-lg font-medium text-foreground-heading">تحديد المدة</h3>
        </div>
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

      <!-- Enhanced Time Period Section -->
      <div
        class="p-6 transition-all duration-300 border shadow-sm group rounded-xl border-border bg-background-surface hover:border-accent/20 hover:shadow-md"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 rounded-lg bg-accent/10">
            <Icon icon="lucide:calendar-days" class="w-5 h-5 text-accent" />
          </div>
          <h3 class="text-lg font-medium text-foreground-heading">نوع الفترة الزمنية</h3>
        </div>
        <RadioGroup v-model="store.form.periodType" class="grid gap-4 md:grid-cols-2">
          <PeriodTypeCard
            :value="1"
            id="period-weekly"
            title="أسبوعي"
            description="سيتم تقسيم المدة إلى أسابيع"
            icon="lucide:calendar-week"
          />
          <PeriodTypeCard
            :value="2"
            id="period-monthly"
            title="شهري"
            description="سيتم تقسيم المدة إلى أشهر"
            icon="lucide:calendar-month"
          />
        </RadioGroup>
      </div>

      <!-- Enhanced Dates Section -->
      <div
        class="p-6 transition-all duration-300 border shadow-sm group rounded-xl border-border bg-background-surface hover:border-info/20 hover:shadow-md"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 rounded-lg bg-info/10">
            <Icon icon="lucide:calendar-range" class="w-5 h-5 text-info" />
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
                class="flex items-center w-full h-10 px-3 py-2 text-sm transition-colors border rounded-md border-border bg-background-card ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

  const DurationTypeOption = defineComponent({
    props: ['value', 'label'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            class:
              'flex items-center flex-row-reverse gap-2 p-2 rounded-lg border border-border bg-background-card hover:bg-background-hover transition-colors duration-200',
          },
          [
            h(RadioGroupItem, { value: props.value, id: `duration-${props.value}` }),
            h(
              Label,
              {
                for: `duration-${props.value}`,
                class: 'text-sm font-medium text-foreground-heading cursor-pointer',
              },
              () => props.label
            ),
          ]
        );
    },
  });

  const PeriodTypeCard = defineComponent({
    props: ['value', 'id', 'title', 'description', 'icon'],
    setup(props) {
      return () =>
        h(
          'div',
          {
            class: [
              'group/card flex items-center gap-4 rounded-lg border border-border p-4',
              'bg-background-card shadow-sm',
              'transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:bg-background-hover',
              'cursor-pointer',
            ],
            dir: 'rtl',
          },
          [
            h(
              'div',
              {
                class:
                  'rounded-lg bg-primary/10 p-2 transition-transform duration-200 group-hover/card:scale-105',
              },
              [h(Icon, { icon: props.icon || 'lucide:calendar', class: 'h-4 w-4 text-primary' })]
            ),
            h('div', { class: 'flex-1' }, [
              h(
                Label,
                {
                  for: props.id,
                  class: 'text-sm font-medium text-foreground-heading cursor-pointer',
                },
                () => props.title
              ),
              h('p', { class: 'mt-1 text-xs text-foreground-muted' }, props.description),
            ]),
            h(RadioGroupItem, { value: props.value, id: props.id }),
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
