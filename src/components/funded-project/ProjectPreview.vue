<template>
  <FormSection title="معاينة المشروع">
    <div class="space-y-6 md:col-span-2">
      <!-- Stats Cards - Moved to top for better overview -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          class="relative overflow-hidden rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="relative z-10">
            <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">المدة الكلية</div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ totalPeriods }} {{ store.form.periodType === 1 ? 'اسبوع' : 'شهر' }}
            </div>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500/10 dark:bg-blue-400/10"></div>
        </div>
        <div
          class="relative overflow-hidden rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="relative z-10">
            <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد المكونات</div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ store.form.components.length }}
            </div>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-1 bg-green-500/10 dark:bg-green-400/10"></div>
        </div>
        <div
          class="relative overflow-hidden rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="relative z-10">
            <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد الفعاليات</div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ store.form.components.reduce((total, comp) => total + comp.activities.length, 0) }}
            </div>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-1 bg-purple-500/10 dark:bg-purple-400/10"></div>
        </div>
      </div>

      <!-- Project Details Preview - Enhanced with better spacing and icons -->
      <div class="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b p-4 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:clipboard-list" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المشروع</h4>
          </div>
        </div>
        <div class="divide-y dark:divide-gray-700">
          <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">اسم المشروع</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.name || 'لم يتم تحديد اسم المشروع' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">الدائرة المنفذة</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.executingDepartment || 'لم يتم تحديد الدائرة' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المنفذة</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.implementingEntity || 'لم يتم تحديد الجهة' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">الجهات المستفيدة</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.beneficiaryEntities || 'لم يتم تحديد الجهات المستفيدة' }}
              </div>
            </div>
          </div>
          <div class="p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">الهدف من المشروع</div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ store.form.projectObjectives || 'لم يتم تحديد الهدف' }}
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">نوع التمويل</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.fundingType === 1 ? 'مشروع ممول' : 'مشروع غير ممول' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">التمويل الدولي</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.cost ? `$${formatCost(store.form.cost)}` : 'لم يتم تحديد المبلغ' }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{
                  store.form.actualStartDate
                    ? formatDate(store.form.actualStartDate)
                    : 'لم يتم تحديد تاريخ البدء'
                }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ الانتهاء المتوقع</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{
                  store.form.actualStartDate && store.form.duration
                    ? calculateEndDate(
                        store.form.actualStartDate,
                        store.form.duration,
                        store.form.durationType
                      )
                    : 'لم يتم تحديد تاريخ الانتهاء'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Preview - Replaced with SheduleTimeLine component -->
      <ScheduleTimeLine
        :components="store.form.components"
        :duration="totalPeriods"
        :periodType="store.form.periodType"
      />

      <!-- Components and Activities Details - Enhanced with better visuals -->
      <ComponentsActivitiesDetails
        :components="reversedComponents"
        :periodType="store.form.periodType"
        :useExternalSorting="true"
      />

      <div class="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b p-4 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:clipboard-list" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="font-medium text-gray-900 dark:text-gray-100">الإنجازات </h4>
          </div>
        </div>
        <div class="divide-y dark:divide-gray-700">
          <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400"> الإنجاز المالي</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.financialAchievements || 'لم يتم تحديد الإنجاز المالي' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">الإنجاز الفني</div>
              <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.form.technicalAchievements || 'لم يتم تحديد الإنجاز الفني' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FormSection>
</template>

<script setup>
  import ComponentsActivitiesDetails from '@/components/ComponentsActivitiesDetails.vue';
  import FormSection from '@/components/FormSection.vue';
  import ScheduleTimeLine from '@/components/ScheduleTimeLine.vue';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Icon } from '@iconify/vue';

  const store = useFundedProjectStore();
  const totalPeriods = computed(() => store.totalPeriods);

  // Add sorting functions to match ComponentsActivitiesDetails.vue
  const reversedComponents = computed(() => {
    return [...store.form.components].reverse();
  });

  const sortedActivities = (activities) => {
    return [...activities].reverse();
  };

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

  const componentColors = [
    { base: '#3B82F6', light: 'rgba(59, 130, 246, 0.2)' },
    { base: '#10B981', light: 'rgba(16, 185, 129, 0.2)' },
    { base: '#F59E0B', light: 'rgba(245, 158, 11, 0.2)' },
    { base: '#EF4444', light: 'rgba(239, 68, 68, 0.2)' },
    { base: '#8B5CF6', light: 'rgba(139, 92, 246, 0.2)' },
    { base: '#EC4899', light: 'rgba(236, 72, 153, 0.2)' },
  ];

  const getComponentColor = (index, isLight = false) => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };

  const formatCost = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>

<style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
  }

  .custom-scrollbar::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 0.25rem;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 0.25rem;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }
</style>
