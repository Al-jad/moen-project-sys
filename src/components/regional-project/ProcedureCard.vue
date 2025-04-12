<template>
  <div
    class="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
  >
    <div class="relative">
      <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div>
            <h5 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ procedure.name }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(procedure.startDate) }} - {{ formatDate(procedure.endDate) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800">
            <Icon icon="lucide:clock" class="h-4 w-4 text-gray-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              مدة الاجراء: {{ procedure.duration }} يوم
            </span>
          </div>
          <div class="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800">
            <Icon icon="lucide:weight" class="h-4 w-4 text-gray-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              وزن الاجراء: {{ procedure.weight }}%
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              @click="$emit('edit', procedure)"
              variant="ghost"
              size="icon"
              class="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Icon icon="lucide:edit" class="h-4 w-4" />
            </Button>
            <Button
              @click="$emit('delete', procedure)"
              variant="ghost"
              size="icon"
              class="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Icon icon="lucide:trash" class="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <Icon icon="lucide:trending-up" class="h-4 w-4 text-blue-500" />
              المعلومات المالية
            </h6>
            <span class="text-sm text-gray-500">{{ procedure.plannedFinancialProgress }}%</span>
          </div>
          <div class="space-y-3">
            <div>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="text-gray-500 dark:text-gray-400">
                  نسبة الإنجاز المالي المخطط له
                </span>
                <span class="font-medium text-blue-600"
                  >{{ procedure.plannedFinancialProgress }}%</span
                >
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-blue-500 transition-all duration-300"
                  :style="{ width: `${procedure.plannedFinancialProgress}%` }"
                ></div>
              </div>
            </div>
            <PremiumMask>
              <div>
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="text-gray-500 dark:text-gray-400"> نسبة الإنجاز المالي الفعلي </span>
                  <span
                    class="font-medium"
                    :class="{
                      'text-green-600':
                        procedure.actualFinancialProgress >= procedure.plannedFinancialProgress,
                      'text-red-600':
                        procedure.actualFinancialProgress < procedure.plannedFinancialProgress,
                    }"
                  >
                    {{ procedure.actualFinancialProgress }}%
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="{
                      'bg-green-500':
                        procedure.actualFinancialProgress >= procedure.plannedFinancialProgress,
                      'bg-red-500':
                        procedure.actualFinancialProgress < procedure.plannedFinancialProgress,
                    }"
                    :style="{ width: `${procedure.actualFinancialProgress}%` }"
                  ></div>
                </div>
              </div>
            </PremiumMask>
          </div>
        </div>
        <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <Icon icon="lucide:settings" class="h-4 w-4 text-purple-500" />
              المعلومات الفنية
            </h6>
          </div>
          <div class="space-y-3">
            <div>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="text-gray-500 dark:text-gray-400"> نسبة الإنجاز الفني المخطط له </span>
                <span class="font-medium text-purple-600"
                  >{{ procedure.plannedCompletionPercentage }}%</span
                >
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-purple-500 transition-all duration-300"
                  :style="{
                    width: `${procedure.plannedCompletionPercentage}%`,
                  }"
                ></div>
              </div>
            </div>
            <PremiumMask>
              <div>
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="text-gray-500 dark:text-gray-400">الفعلي</span>
                  <span
                    class="font-medium"
                    :class="{
                      'text-green-600':
                        procedure.actualCompletionPercentage >=
                        procedure.plannedCompletionPercentage,
                      'text-red-600':
                        procedure.actualCompletionPercentage <
                        procedure.plannedCompletionPercentage,
                    }"
                  >
                    {{ procedure.actualCompletionPercentage }}%
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="{
                      'bg-green-500':
                        procedure.actualCompletionPercentage >=
                        procedure.plannedCompletionPercentage,
                      'bg-red-500':
                        procedure.actualCompletionPercentage <
                        procedure.plannedCompletionPercentage,
                    }"
                    :style="{
                      width: `${procedure.actualCompletionPercentage}%`,
                    }"
                  ></div>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs">
                  <span class="text-gray-500 dark:text-gray-400"> نسبة الإنحراف الفني </span>
                  <span
                    class="font-medium"
                    :class="{
                      'text-green-600': procedure.technicalDeviation >= 0,
                      'text-red-600': procedure.technicalDeviation < 0,
                    }"
                  >
                    {{ procedure.technicalDeviation >= 0 ? '+' : ''
                    }}{{ procedure.technicalDeviation }}%
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="{
                      'bg-green-500':
                        procedure.actualCompletionPercentage >=
                        procedure.plannedCompletionPercentage,
                      'bg-red-500':
                        procedure.actualCompletionPercentage <
                        procedure.plannedCompletionPercentage,
                    }"
                    :style="{
                      width: `${procedure.actualCompletionPercentage}%`,
                    }"
                  ></div>
                </div>
              </div>
            </PremiumMask>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import PremiumMask from '@/components/PremiumMask.vue';
  import { Button } from '@/components/ui/button';
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    procedure: {
      type: Object,
      required: true,
    },
  });

  defineEmits(['edit', 'delete']);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IQ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
</script>
