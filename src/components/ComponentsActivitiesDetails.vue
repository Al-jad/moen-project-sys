<template>
  <div class="overflow-hidden border bg-white dark:border-gray-700 dark:bg-gray-800">
    <div class="divide-y dark:divide-gray-700">
      <template v-for="(component, componentIndex) in reversedComponents" :key="componentIndex">
        <div
          class="component-item p-4 transition-all duration-300"
          :style="{
            '--component-color': getComponentColor(componentIndex),
            '--component-color-light': getComponentColor(componentIndex, true),
          }"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="component-dot h-3 w-3 rounded-full transition-transform duration-300"
                :style="{ backgroundColor: getComponentColor(componentIndex) }"
              ></div>
              <h5 class="font-medium text-gray-900 dark:text-gray-100">
                {{ component.name || `المكون ${componentIndex + 1}` }}
              </h5>
            </div>
            <div class="flex items-center gap-2">
              <Badge
                variant="secondary"
                :style="{
                  backgroundColor: `${getComponentColor(componentIndex, true)}`,
                  color: `${getComponentColor(componentIndex)}`,
                  borderColor: `${getComponentColor(componentIndex)}`,
                }"
              >
                المستهدف: {{ component.targetPercentage || component.totalTarget || 0 }}%
              </Badge>
              <TooltipProvider v-if="!isPercentageMatching(component)">
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      <Icon icon="lucide:alert-triangle" class="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p
                      >مجموع نسب الفعاليات ({{ getActivitiesPercentageSum(component) }}%) لا يساوي
                      نسبة المكون ({{
                        component.targetPercentage || component.totalTarget || 0
                      }}%)</p
                    >
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <slot name="componentActions" :component="component" />
            </div>
          </div>
          <div class="space-y-3 pl-6">
            <div
              v-if="component.activities && component.activities.length > 0"
              class="mb-3 flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/50"
            >
              <div
                class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span>مجموع نسب الفعاليات:</span>
                <Badge
                  :style="
                    !isPercentageMatching(component)
                      ? {
                          backgroundColor: `${getComponentColor(componentIndex, true)}`,
                          color: `${getComponentColor(componentIndex)}`,
                          borderColor: `${getComponentColor(componentIndex)}`,
                        }
                      : {}
                  "
                  :variant="isPercentageMatching(component) ? 'success' : 'outline'"
                >
                  {{ getActivitiesPercentageSum(component) }}%
                </Badge>
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  (يجب أن تكون: {{ component.targetPercentage || component.totalTarget || 0 }}%)
                </span>
              </div>
              <Badge :variant="isPercentageMatching(component) ? 'success' : 'warning'">
                {{ isPercentageMatching(component) ? 'متطابق' : 'غير متطابق' }}
              </Badge>
            </div>
            <template
              v-for="(activity, activityIndex) in sortedActivities(component.activities)"
              :key="activityIndex"
            >
              <div
                class="activity-item rounded-lg border border-dashed border-gray-300 p-3 transition-all duration-300 dark:border-gray-700"
                :style="{
                  '--component-color': getComponentColor(componentIndex),
                  '--component-color-light': getComponentColor(componentIndex, true),
                }"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      class="activity-dot h-2 w-2 rounded-full transition-transform duration-300"
                      :style="{ backgroundColor: getComponentColor(componentIndex) }"
                    ></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ activity.name || `الفعالية ${activityIndex + 1}` }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      :style="{
                        borderColor: `${getComponentColor(componentIndex)}`,
                        color: `${getComponentColor(componentIndex)}`,
                      }"
                    >
                      المستهدف: {{ activity.targetPercentage || activity.totalTarget || 0 }}%
                    </Badge>
                    <slot name="activityActions" :activity="activity" :component="component" />
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">الفترات المحددة</div>
                    <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {{ (activity.selectedPeriods || activity.weeks || []).length || 0 }}
                      {{ periodType === 1 ? 'اسبوع' : 'شهر' }}
                      <span class="text-xs text-gray-500">
                        ({{
                          (activity.selectedPeriods || activity.weeks || []).join(', ') ||
                          'لم يتم التحديد'
                        }})
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
              v-if="!component.activities || component.activities.length === 0"
              class="rounded-lg border border-dashed border-gray-200 p-3 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              لا توجد فعاليات لهذا المكون
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    components: {
      type: Array,
      required: true,
      default: () => [],
    },
    periodType: {
      type: Number,
      required: true,
      default: 1,
    },
    useExternalSorting: {
      type: Boolean,
      default: false,
    },
  });

  const reversedComponents = computed(() => {
    if (props.useExternalSorting) {
      return props.components;
    }
    return [...props.components].reverse();
  });

  const sortedActivities = (activities) => {
    if (!activities || !Array.isArray(activities)) {
      return [];
    }
    
    if (props.useExternalSorting) {
      return activities;
    }
    return [...activities].reverse();
  };

  const componentColors = [
    { base: '#3B82F6', light: 'rgba(59, 130, 246, 0.1)' },
    { base: '#10B981', light: 'rgba(16, 185, 129, 0.1)' },
    { base: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)' },
    { base: '#EF4444', light: 'rgba(239, 68, 68, 0.1)' },
    { base: '#8B5CF6', light: 'rgba(139, 92, 246, 0.1)' },
    { base: '#EC4899', light: 'rgba(236, 72, 153, 0.1)' },
  ];

  const getComponentColor = (index, isLight = false) => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };

  // Calculate the sum of activity percentages for a component
  const getActivitiesPercentageSum = (component) => {
    if (!component.activities || component.activities.length === 0) return 0;

    return component.activities.reduce((sum, activity) => {
      const percentage = activity.targetPercentage || activity.totalTarget || 0;
      return sum + Number(percentage);
    }, 0);
  };

  // Check if the sum of activity percentages matches the component percentage
  const isPercentageMatching = (component) => {
    const componentPercentage = Number(component.targetPercentage || component.totalTarget || 0);
    const activitiesSum = getActivitiesPercentageSum(component);

    // Allow a small margin of error (0.1) for floating point comparisons
    return Math.abs(componentPercentage - activitiesSum) < 0.1;
  };
</script>
<style scoped>
  .component-item {
    background-color: transparent;
  }
  .component-item:hover {
    background-color: var(--component-color-light);
  }
  .component-item:hover .component-dot {
    transform: scale(1.25);
  }
  .activity-item {
    background-color: rgba(243, 244, 246, 0.5);
  }
  .dark .activity-item {
    background-color: rgba(31, 41, 55, 0.3);
  }
  .activity-item:hover {
    border: 1px solid var(--component-color);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  }
  .dark .activity-item:hover {
    background-color: var(--component-color-light);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  }
  .activity-item:hover .activity-dot {
    transform: scale(1.25);
  }
</style>
