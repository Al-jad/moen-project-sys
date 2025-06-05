<template>
  <div class="overflow-hidden border bg-background-surface">
    <div class="divide-y divide-border">
      <!-- Empty State for No Components -->
      <div
        v-if="!components?.length"
        class="flex flex-col items-center justify-center p-8 text-center"
      >
        <div class="mb-4 rounded-full bg-background-card p-3">
          <Icon icon="lucide:layers" class="h-8 w-8 text-foreground-muted" />
        </div>
        <h3 class="mb-2 text-lg font-medium text-foreground-heading">لا توجد مكونات</h3>
        <p class="mb-4 text-sm text-foreground-muted">قم بإضافة مكونات للمشروع في وضع التعديل</p>
      </div>

      <!-- Components List -->
      <template v-else v-for="(component, componentIndex) in components" :key="componentIndex">
        <!-- Component Container with distinct styling -->
        <div
          class="component-item relative border-r-4 bg-background-card p-6 transition-all duration-300"
          :style="{
            '--component-color': getComponentColor(componentIndex),
            '--component-color-light': getComponentColor(componentIndex, true),
            borderRightColor: getComponentColor(componentIndex),
          }"
        >
          <!-- Component Header -->
          <div
            class="mb-6 flex items-center justify-between rounded-lg bg-background-card p-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="component-dot h-5 w-5 rounded-full transition-transform duration-300"
                :style="{ backgroundColor: getComponentColor(componentIndex) }"
              ></div>
              <div>
                <h5 class="text-lg font-semibold text-foreground-heading">
                  {{ component.name || `المكون ${componentIndex + 1}` }}
                </h5>
                <p class="mt-1 text-sm text-foreground-muted">
                  {{ component.activities?.length || 0 }} فعالية
                </p>
              </div>
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
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20 p-1 text-warning"
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

          <!-- Activities Container -->
          <div class="space-y-4 pr-4">
            <!-- Empty State for No Activities -->
            <div
              v-if="!component.activities?.length"
              class="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
            >
              <div class="mb-3 rounded-full bg-background-card p-3">
                <Icon icon="lucide:list-checks" class="h-6 w-6 text-foreground-muted" />
              </div>
              <h3 class="mb-1 text-base font-medium text-foreground-heading">لا توجد فعاليات</h3>
              <p class="text-sm text-foreground-muted">قم بإضافة فعاليات للمكون في وضع التعديل</p>
            </div>

            <!-- Activities List -->
            <template v-else>
              <div
                class="mb-4 flex items-center justify-between rounded-md bg-background-card p-3"
              >
                <div
                  class="flex items-center gap-2 text-sm font-medium text-foreground-muted"
                >
                  <Icon icon="lucide:list-checks" class="h-4 w-4" />
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
                  <span class="text-xs text-foreground-muted">
                    (يجب أن تكون: {{ component.targetPercentage || component.totalTarget || 0 }}%)
                  </span>
                </div>
                <Badge :variant="isPercentageMatching(component) ? 'success' : 'warning'">
                  {{ isPercentageMatching(component) ? 'متطابق' : 'غير متطابق' }}
                </Badge>
              </div>

              <div class="space-y-3">
                <template
                  v-for="(activity, activityIndex) in sortedActivities(component.activities)"
                  :key="activityIndex"
                >
                  <div
                    class="activity-item relative rounded-lg border-border bg-background-card p-4 transition-all duration-300"
                    :style="{
                      '--component-color': getComponentColor(componentIndex),
                      '--component-color-light': getComponentColor(componentIndex, true),
                    }"
                  >
                    <!-- Activity Header -->
                    <div class="mb-3 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <div
                            class="activity-dot h-2 w-2 rounded-full transition-transform duration-300"
                            :style="{ backgroundColor: getComponentColor(componentIndex) }"
                          ></div>
                          <span class="text-sm font-medium text-foreground-heading">
                            {{ activity.name || `الفعالية ${activityIndex + 1}` }}
                          </span>
                        </div>
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

                    <!-- Activity Details with enhanced readability -->
                    <div
                      class="grid grid-cols-1 gap-3 rounded-lg bg-background-card p-3 md:grid-cols-2"
                    >
                      <div>
                        <div class="flex items-center gap-2 text-xs text-foreground-muted">
                          <Icon icon="lucide:calendar" class="h-4 w-4" />
                          <span>الفترات المحددة</span>
                        </div>
                        <div class="mt-1 text-sm text-foreground-heading">
                          {{ (activity.selectedPeriods || activity.weeks || []).length || 0 }}
                          {{ periodType === 1 ? 'اسبوع' : 'شهر' }}
                          <span class="text-xs text-foreground-muted">
                            ({{
                              (activity.selectedPeriods || activity.weeks || []).join(', ') ||
                              'لم يتم التحديد'
                            }})
                          </span>
                        </div>
                      </div>
                      <div v-if="activity.notes">
                        <div class="flex items-center gap-2 text-xs text-foreground-muted">
                          <Icon icon="lucide:clipboard" class="h-4 w-4" />
                          <span>ملاحظات</span>
                        </div>
                        <div class="mt-1 text-sm text-foreground-heading">
                          {{ activity.notes }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
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
    return props.components;
  });

  const sortedActivities = (activities) => {
    if (!activities || !Array.isArray(activities)) {
      return [];
    }
    return activities;
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
    transform: scale(1.2);
  }
  .activity-item {
    background-color: white;
    border-right: 3px solid transparent;
  }
  .activity-item:hover {
    border-right-color: var(--component-color);
    transform: translateX(-4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .dark .activity-item {
    background-color: rgba(31, 41, 55, 0.3);
  }
  .dark .activity-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .activity-item:hover .activity-dot {
    transform: scale(1.2);
  }
</style>
