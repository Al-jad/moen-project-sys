<template>
  <div
    @click="!disabled && router.push(`/funded-projects/${project.id}`)"
    class="group relative overflow-hidden rounded-lg border border-primary/20 bg-background-card transition-all duration-300"
    :class="[
      disabled
        ? 'cursor-not-allowed opacity-70'
        : 'hover:cursor-pointer hover:border-primary/50 hover:shadow-lg',
    ]"
  >
    <div class="border-b border-border p-6">
      <div class="mb-4 flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <h3
                class="text-lg font-medium text-foreground transition-colors"
                :class="[
                  disabled ? '' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
                ]"
              >
                {{ project.name || 'لا يوجد اسم' }}
              </h3>

              <div
                v-if="project.isGovernment"
                class="rounded-full bg-info px-3 py-1 text-xs font-medium text-white"
              >
                ضمن البرنامج الحكومي
              </div>
              <div
                v-if="project.projectStatus !== undefined"
                :class="getStatusBadgeClass(project.projectStatus)"
                class="rounded-full px-3 py-1 text-xs font-medium dark:bg-opacity-20"
              >
                {{ getStatusText(project.projectStatus) }}
              </div>
            </div>
          </div>
        </div>
        <h3
          class="rounded-full bg-info px-4 py-1 text-lg font-medium text-white shadow-sm transition-all"
          :class="{ 'opacity-70': disabled }"
        >
          {{ formatCost(project.cost) }}
        </h3>
      </div>
      <hr class="mb-6 w-full border-primary/20" />
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(section, index) in cardSections"
          :key="index"
          class="flex flex-col space-y-4 rounded-lg bg-background-surface p-4 transition-all"
        >
          <div
            v-for="(item, itemIndex) in section.items"
            :key="itemIndex"
            class="flex items-center justify-between"
            :class="{ 'opacity-50 hover:cursor-not-allowed': item.disabled }"
          >
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon :icon="item.icon" class="h-4 w-4 text-gray-600 dark:text-gray-100" />
              </div>
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</h3>
            </div>
            <template v-if="item.type === 'progress'">
              <div class="flex items-center gap-2">
                <div
                  class="relative h-2.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                >
                  <div
                    class="absolute inset-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out dark:from-blue-400 dark:to-blue-500"
                    :style="{ width: `${item.value || 0}%` }"
                  ></div>
                  <div
                    class="absolute inset-0 h-full animate-pulse bg-gradient-to-r from-blue-200/50 to-blue-300/50 dark:from-blue-500/20 dark:to-blue-600/20"
                    :style="{ width: `${item.value || 0}%` }"
                  ></div>
                </div>
                <div class="flex items-center gap-1">
                  <h3 class="font-semibold text-gray-600 dark:text-gray-100">
                    {{ item.value || 0 }}
                  </h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            </template>
            <template v-else>
              <h3 class="font-semibold text-gray-600 dark:text-gray-100">
                {{ item.value }}
              </h3>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { CURRENCY_CONVERSION, UNITS } from '@/constants';
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedCurrency: {
      type: String,
      default: 'IQD',
    },
  });

  const cardSections = [
    {
      items: [
        {
          title: 'المكونات',
          icon: 'lucide:layers',
          value: computed(() => props.project.components?.length || 0),
        },
        {
          title: 'الفعاليات',
          icon: 'lucide:list-todo',
          value: computed(() => getTotalActivities(props.project)),
        },
      ],
    },
    {
      items: [
        {
          title: 'فترة التنفيذ',
          icon: 'formkit:datetime',
          value: computed(
            () =>
              `${props.project.duration} ${props.project.periodType ? (props.project.periodType === 1 ? 'أسبوع' : 'شهر') : ''}`
          ),
        },
        {
          title: 'تاريخ البدء',
          icon: 'lucide:calendar-days',
          value: computed(() => formatDate(props.project.actualStartDate)),
        },
      ],
    },
    {
      items: [
        {
          title: 'الانجاز المالي',
          icon: 'fluent:money-calculator-24-regular',
          type: 'progress',
          value: computed(() => props.project.financialAchievement || 0),
        },
        {
          title: 'الإنجاز الفني',
          icon: 'hugeicons:percent-square',
          type: 'progress',
          value: computed(() => props.project.actualProgress || 0),
          disabled: true,
        },
      ],
    },
  ];

  const getTotalActivities = (project) => {
    return (
      project.components?.reduce((total, comp) => total + (comp.activities?.length || 0), 0) || 0
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const convertCurrency = (value, fromCurrency, toCurrency) => {
    if (!value) return 0;
    const numValue = Number(value);
    if (fromCurrency === toCurrency) return numValue;

    let convertedValue;
    if (fromCurrency === 'USD') {
      convertedValue = numValue * CURRENCY_CONVERSION.USD_TO_IQD;
    } else {
      convertedValue = numValue * CURRENCY_CONVERSION.IQD_TO_USD;
    }

    // Round to appropriate precision
    const precision = CURRENCY_CONVERSION.PRECISION[toCurrency];
    return Number(convertedValue.toFixed(precision));
  };
  const formatCost = (value) => {
    if (!value) return '0';
    const numValue = Number(value);
    const convertedValue = convertCurrency(numValue, 'IQD', props.selectedCurrency);

    // Format with appropriate precision
    const precision = CURRENCY_CONVERSION.PRECISION[props.selectedCurrency];
    const formattedValue = convertedValue.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    return `${formattedValue} ${props.selectedCurrency === 'USD' ? UNITS.CURRENCY.USD : UNITS.CURRENCY.IQD}`;
  };

  function getStatusBadgeClass(status) {
    const statusClasses = {
      0: 'bg-gray-500/10 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
      1: 'bg-yellow-500/30 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
      2: 'bg-green-500/30 text-green-800 dark:bg-green-500/20 dark:text-green-300',
      3: 'bg-red-500/30 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    };
    return statusClasses[status] || '';
  }

  function getStatusText(status) {
    const statusMap = {
      0: 'ملغاة',
      1: 'قيد التنفيذ',
      2: 'منجزة',
      3: 'متلكئة',
    };
    return statusMap[status] || 'غير معروف';
  }
</script>
