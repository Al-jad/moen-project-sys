<template>
  <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
    <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <Icon icon="lucide:calendar" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h4 class="font-medium text-gray-900 dark:text-gray-100">المخطط الزمني للمشروع</h4>
      </div>
      <div
        class="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      >
        <Icon icon="lucide:calendar" class="h-4 w-4" />
        {{ periodType === 1 ? 'عرض بالأسابيع' : 'عرض بالأشهر' }}
      </div>
    </div>

    <div class="p-4">
      <div v-if="duration && periodType" class="space-y-6">
        <div
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
                  v-for="(component, componentIndex) in reversedComponents"
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
                            <div class="truncate">{{ component.name }}</div>
                          </TooltipTrigger>
                          <TooltipContent class="bg-gray-900 text-white dark:bg-gray-800">
                            <p>{{ component.name }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div
                    v-for="(activity, activityIndex) in sortedActivities(component.activities)"
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
                            <div class="truncate">{{ activity.name }}</div>
                          </TooltipTrigger>
                          <TooltipContent class="bg-gray-900 text-white dark:bg-gray-800">
                            <p>{{ activity.name }}</p>
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
                    {{ periodType === 1 ? `${period}` : `${period}` }}
                  </div>
                </div>
                <div class="divide-y dark:divide-gray-700">
                  <template
                    v-for="(component, componentIndex) in reversedComponents"
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
                      v-for="(activity, activityIndex) in sortedActivities(component.activities)"
                      :key="activityIndex"
                      class="flex h-[4rem] border-b bg-gray-50/50 transition-colors duration-150 hover:bg-gray-100/80 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
                    >
                      <div
                        v-for="period in totalPeriods"
                        :key="period"
                        class="relative w-16 shrink-0 border-l dark:border-gray-700"
                      >
                        <div
                          v-if="activity.selectedPeriods?.includes(period)"
                          class="absolute inset-0 m-1 rounded-md transition-colors duration-150"
                          :style="{
                            backgroundColor: getComponentColor(componentIndex, true),
                          }"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Timeline Data State -->
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
</template>

<script setup>
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    components: {
      type: Array,
      required: true,
      default: () => [],
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    periodType: {
      type: Number,
      required: true,
      default: 1, // 1 for weeks, 2 for months
    },
    title: {
      type: String,
      default: 'المخطط الزمني للمشروع',
    },
  });

  const totalPeriods = computed(() => {
    if (!props.duration) return 0;
    return props.duration;
  });

  const reversedComponents = computed(() => {
    return [...props.components].reverse();
  });

  const sortedActivities = (activities) => {
    // Return activities in reverse order to match ComponentsActivitiesDetails
    return [...activities].reverse();
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
