<template>
  <div class="rounded-xl border border-border bg-background-surface">
    <div class="flex items-center justify-between border-b p-4">
      <div class="flex items-center gap-2">
        <Icon icon="lucide:calendar" class="h-5 w-5 text-foreground-muted" />
        <h4 class="font-medium text-foreground">المخطط الزمني للمشروع</h4>
      </div>
      <div
        class="flex items-center gap-2 rounded-full bg-background-hover px-3 py-1 text-sm text-foreground-muted"
      >
        <Icon icon="lucide:calendar" class="h-4 w-4" />
        {{ periodType === 1 ? 'عرض بالأسابيع' : 'عرض بالأشهر' }}
      </div>
    </div>

    <div class="p-4">
      <div v-if="duration && periodType" class="space-y-6">
        <div
          class="relative isolate overflow-hidden rounded-lg border border-border bg-background-card"
        >
          <div class="flex">
            <!-- Fixed Left Column -->
            <div class="sticky left-0 z-[15] w-48 shrink-0 border-l bg-background-card">
              <div
                class="sticky top-0 z-[15] h-[4rem] border-b bg-background-card p-4 font-medium text-foreground"
              >
                المكون / الفعالية
              </div>
              <div class="divide-y">
                <template
                  v-for="(component, componentIndex) in reversedComponents"
                  :key="componentIndex"
                >
                  <div class="h-[4rem] border-b p-4 font-medium text-foreground">
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
                          <TooltipContent class="bg-background-card text-foreground">
                            <p>{{ component.name }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div
                    v-for="(activity, activityIndex) in sortedActivities(component.activities)"
                    :key="activityIndex"
                    class="h-[4rem] border-b bg-background-card p-4 pr-8 text-sm text-foreground-muted"
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
                          <TooltipContent class="bg-background-card text-foreground">
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
                <div class="sticky top-0 z-[10] flex h-[4rem] border-b bg-background-card">
                  <div
                    v-for="period in totalPeriods"
                    :key="period"
                    class="flex h-full w-16 shrink-0 items-center justify-center border-l p-4 text-center text-sm font-medium text-foreground-muted"
                  >
                    {{ periodType === 1 ? `${period}` : `${period}` }}
                  </div>
                </div>
                <div class="divide-y">
                  <template
                    v-for="(component, componentIndex) in reversedComponents"
                    :key="componentIndex"
                  >
                    <div
                      class="flex h-[4rem] border-b transition-colors duration-150 hover:bg-background-hover"
                    >
                      <div
                        v-for="period in totalPeriods"
                        :key="period"
                        class="w-16 shrink-0 border-l"
                      ></div>
                    </div>
                    <div
                      v-for="(activity, activityIndex) in sortedActivities(component.activities)"
                      :key="activityIndex"
                      class="flex h-[4rem] border-b bg-background-card transition-colors duration-150 hover:bg-background-hover"
                    >
                      <div
                        v-for="period in totalPeriods"
                        :key="period"
                        class="relative w-16 shrink-0 border-l"
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
        class="flex items-center justify-center rounded-lg border border-border bg-background-card p-8 text-center text-foreground-muted"
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
    // Check if activities is an array
    if (!activities || !Array.isArray(activities)) {
      return [];
    }

    // Sort the activities based on the selectedPeriods
    return [...activities].sort((a, b) => {
      // If activities have selectedPeriods, sort by the earliest period
      if (
        a.selectedPeriods &&
        b.selectedPeriods &&
        Array.isArray(a.selectedPeriods) &&
        Array.isArray(b.selectedPeriods)
      ) {
        const aMin = a.selectedPeriods.length > 0 ? Math.min(...a.selectedPeriods) : 0;
        const bMin = b.selectedPeriods.length > 0 ? Math.min(...b.selectedPeriods) : 0;
        return aMin - bMin;
      }

      // Fallback for activities without selectedPeriods
      return 0;
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
