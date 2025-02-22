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
            <ClipboardList class="h-5 w-5 text-gray-500 dark:text-gray-400" />
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

      <!-- Timeline Preview -->
      <div class="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b p-4 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Calendar class="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h4 class="font-medium text-gray-900 dark:text-gray-100">المخطط الزمني للمشروع</h4>
            </div>
            <div
              class="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              <Clock class="h-4 w-4" />
              {{ store.form.periodType === 1 ? 'عرض بالأسابيع' : 'عرض بالأشهر' }}
            </div>
          </div>
        </div>
        <div class="relative p-4">
          <div
            v-if="totalPeriods > 0"
            class="relative isolate overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex">
              <!-- Fixed Left Column -->
              <div
                class="sticky left-0 z-[15] w-48 shrink-0 border-l bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  class="sticky top-0 z-[15] h-[4rem] border-b bg-white p-4 font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  المكون / الفعالية
                </div>
                <div class="divide-y dark:divide-gray-700">
                  <template
                    v-for="(component, componentIndex) in store.form.components"
                    :key="componentIndex"
                  >
                    <div
                      class="h-[4rem] border-b p-4 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          class="h-3 w-3 shrink-0 rounded-full"
                          :style="{ backgroundColor: getComponentColor(componentIndex) }"
                        ></div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div class="truncate">{{
                                component.name || `المكون ${componentIndex + 1}`
                              }}</div>
                            </TooltipTrigger>
                            <TooltipContent class="bg-gray-900 text-white dark:bg-gray-800">
                              <p>{{ component.name || `المكون ${componentIndex + 1}` }}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div
                      v-for="(activity, activityIndex) in component.activities"
                      :key="activityIndex"
                      class="h-[4rem] border-b bg-gray-50/50 p-4 pr-8 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-300"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          class="h-2 w-2 shrink-0 rounded-full"
                          :style="{ backgroundColor: getComponentColor(componentIndex) }"
                        ></div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div class="truncate">{{
                                activity.name || `الفعالية ${activityIndex + 1}`
                              }}</div>
                            </TooltipTrigger>
                            <TooltipContent class="bg-gray-900 text-white dark:bg-gray-800">
                              <p>{{ activity.name || `الفعالية ${activityIndex + 1}` }}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Scrollable Timeline Grid -->
              <div class="custom-scrollbar relative overflow-x-auto">
                <div class="inline-block min-w-[800px]">
                  <div
                    class="sticky top-0 z-[10] flex h-[4rem] border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div
                      v-for="period in totalPeriods"
                      :key="period"
                      class="flex h-full w-16 shrink-0 items-center justify-center border-l p-4 text-center text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
                    >
                      {{ store.form.periodType === 1 ? `${period}` : `${period}` }}
                    </div>
                  </div>
                  <div class="divide-y dark:divide-gray-700">
                    <template
                      v-for="(component, componentIndex) in store.form.components"
                      :key="componentIndex"
                    >
                      <div
                        class="flex h-[4rem] border-b transition-colors duration-150 hover:bg-gray-50/80 dark:border-gray-700 dark:hover:bg-gray-800/50"
                      >
                        <div
                          v-for="period in totalPeriods"
                          :key="period"
                          class="w-16 shrink-0 border-l dark:border-gray-700"
                        ></div>
                      </div>
                      <div
                        v-for="(activity, activityIndex) in component.activities"
                        :key="activityIndex"
                        class="flex h-[4rem] border-b bg-gray-50/50 transition-colors duration-150 hover:bg-gray-100/80 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
                      >
                        <div
                          v-for="period in totalPeriods"
                          :key="period"
                          class="relative w-16 shrink-0 border-l dark:border-gray-700"
                        >
                          <div
                            v-if="activity.weeks?.includes(period)"
                            class="absolute inset-0 m-1 rounded-md transition-colors duration-150"
                            :style="{ backgroundColor: getComponentColor(componentIndex, true) }"
                          >
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            <div class="space-y-2">
              <div class="text-sm font-medium">لا يمكن عرض المخطط الزمني</div>
              <div class="text-xs">يرجى تحديد مدة المشروع ونوع الفترة الزمنية أولاً</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Components and Activities Details - Enhanced with better visuals -->
      <div class="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b p-4 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <Layers class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المكونات والفعاليات</h4>
          </div>
        </div>
        <div class="divide-y dark:divide-gray-700">
          <template
            v-for="(component, componentIndex) in store.form.components"
            :key="componentIndex"
          >
            <div
              class="p-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="h-3 w-3 rounded-full"
                    :style="{ backgroundColor: getComponentColor(componentIndex) }"
                  ></div>
                  <h5 class="font-medium text-gray-900 dark:text-gray-100">
                    {{ component.name || `المكون ${componentIndex + 1}` }}
                  </h5>
                </div>
                <div
                  class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  المستهدف: {{ component.totalTarget || 0 }}%
                </div>
              </div>
              <div class="space-y-3 pl-6">
                <template
                  v-for="(activity, activityIndex) in component.activities"
                  :key="activityIndex"
                >
                  <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                    <div class="mb-2 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="h-2 w-2 rounded-full"
                          :style="{ backgroundColor: getComponentColor(componentIndex) }"
                        ></div>
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {{ activity.name || `الفعالية ${activityIndex + 1}` }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        المستهدف: {{ activity.totalTarget || 0 }}%
                      </span>
                    </div>
                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">الفترات المحددة</div>
                        <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {{ activity.weeks?.length || 0 }}
                          {{ store.form.periodType === 1 ? 'اسبوع' : 'شهر' }}
                          <span class="text-xs text-gray-500">
                            ({{ activity.weeks?.join(', ') || 'لم يتم التحديد' }})
                          </span>
                        </div>
                      </div>
                      <div v-if="activity.notes">
                        <div class="text-xs text-gray-500 dark:text-gray-400">ملاحظات</div>
                        <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {{ activity.notes }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div
                  v-if="component.activities.length === 0"
                  class="rounded-lg border border-dashed border-gray-200 p-3 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
                >
                  لا توجد فعاليات لهذا المكون
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </FormSection>
</template>

<script setup>
  import FormSection from '@/components/FormSection.vue';
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Calendar, ClipboardList, Clock, Layers } from 'lucide-vue-next';
  import { computed } from 'vue';

  const store = useFundedProjectStore();
  const totalPeriods = computed(() => store.totalPeriods);

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
