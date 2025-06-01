<template>
  <FormSection title="مكونات المشروع" full-width>
    <div class="space-y-6">
      <div
        v-for="(component, index) in components"
        :key="index"
        class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="h-8 w-8 rounded-lg"
              :style="{ backgroundColor: getComponentColor(index, true) }"
            >
              <div
                class="flex h-full w-full items-center justify-center text-sm font-medium"
                :style="{ color: getComponentColor(index) }"
              >
                {{ index + 1 }}
              </div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              المكون {{ index + 1 }}
            </h3>
          </div>
          <Button
            @click="removeComponent(index)"
            variant="ghost"
            size="sm"
            class="text-red-500 hover:text-red-600 dark:text-red-400"
          >
            <Icon icon="lucide:trash" class="h-4 w-4" />
          </Button>
        </div>

        <div class="space-y-6">
          <!-- Component Fields -->
          <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <FormField label="اسم المكون">
              <CustomInput
                v-model="component.name"
                dir="rtl"
                placeholder="ادخل اسم المكون"
                class="bg-white dark:bg-gray-800"
                @update:modelValue="updateComponent(index, 'name', $event)"
              />
            </FormField>
            <FormField label="المستهدف الكلي للمكون">
              <NumberInput
                v-model="component.targetPercentage"
                placeholder="ادخل المستهدف الكلي"
                unit="%"
                class="bg-white dark:bg-gray-800"
                @update:modelValue="updateComponent(index, 'targetPercentage', $event)"
              />
            </FormField>
          </div>

          <!-- Activities Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900 dark:text-gray-100">الفعاليات</h4>
              <Button
                @click="addActivity(index)"
                variant="outline"
                size="sm"
                :style="{
                  borderColor: getComponentColor(index),
                  color: getComponentColor(index),
                }"
              >
                <Icon icon="lucide:plus" class="h-4 w-4" />
                اضافة فعالية
              </Button>
            </div>

            <!-- Activities List -->
            <div class="space-y-3">
              <div
                v-for="(activity, activityIndex) in component.activities"
                :key="activityIndex"
                class="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
              >
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      class="h-2 w-2 rounded-full"
                      :style="{ backgroundColor: getComponentColor(index) }"
                    ></div>
                    <span class="font-medium text-gray-900 dark:text-gray-100">
                      الفعالية {{ activityIndex + 1 }}
                    </span>
                  </div>
                  <Button
                    @click="removeActivity(index, activityIndex)"
                    variant="ghost"
                    size="sm"
                    class="text-red-500 hover:text-red-600 dark:text-red-400"
                  >
                    <Icon icon="lucide:trash" class="h-4 w-4" />
                  </Button>
                </div>

                <!-- Activity Fields -->
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  <FormField label="اسم الفعالية">
                    <CustomInput
                      v-model="activity.name"
                      dir="rtl"
                      placeholder="ادخل اسم الفعالية"
                      class="bg-white dark:bg-gray-800"
                      @update:modelValue="updateActivity(index, activityIndex, 'name', $event)"
                    />
                  </FormField>
                  <FormField label="المستهدف الكلي للفعالية">
                    <NumberInput
                      v-model="activity.targetPercentage"
                      placeholder="ادخل المستهدف الكلي"
                      unit="%"
                      class="bg-white dark:bg-gray-800"
                      @update:modelValue="
                        updateActivity(index, activityIndex, 'targetPercentage', $event)
                      "
                    />
                  </FormField>
                  <FormField label="ملاحظات" class="md:col-span-2">
                    <Textarea
                      v-model="activity.notes"
                      dir="rtl"
                      placeholder="ادخل الملاحظات"
                      class="min-h-[80px] bg-white dark:bg-gray-800"
                      :value="activity.notes ?? ''"
                      @update:modelValue="
                        updateActivity(index, activityIndex, 'notes', $event || '')
                      "
                    />
                  </FormField>
                </div>

                <!-- Activity Weeks Selection -->
                <div class="mt-4">
                  <FormField label="الفترات المحددة">
                    <div v-if="totalPeriods > 0" class="space-y-4">
                      <div
                        class="flex items-center justify-between rounded-lg border bg-gray-50/50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50"
                      >
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {{
                            periodType === 1
                              ? `اختر الاسابيع (${activity.selectedPeriods?.length || 0} من ${totalPeriods})`
                              : `اختر الاشهر (${activity.selectedPeriods?.length || 0} من ${totalPeriods})`
                          }}
                        </span>
                        <button
                          v-if="activity.selectedPeriods?.length"
                          type="button"
                          class="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          @click="clearActivityPeriods(index, activityIndex)"
                        >
                          مسح التحديد
                        </button>
                      </div>
                      <div
                        class="grid gap-2 rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                        :class="{
                          'grid-cols-4': totalPeriods <= 4,
                          'grid-cols-8': totalPeriods > 4 && totalPeriods <= 8,
                          'grid-cols-12': totalPeriods > 8,
                        }"
                      >
                        <div
                          v-for="period in totalPeriods"
                          :key="period"
                          class="flex flex-col items-center"
                        >
                          <span class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                            {{ periodType === 1 ? `${period}` : `${period}` }}
                          </span>
                          <button
                            type="button"
                            class="group relative h-12 w-full cursor-pointer rounded-md border transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                            :class="[
                              activity.selectedPeriods?.includes(period)
                                ? 'border-blue-500 bg-blue-500 dark:border-blue-600 dark:bg-blue-600'
                                : 'border-gray-200 bg-white hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600',
                            ]"
                            @click.prevent="toggleActivityPeriod(index, activityIndex, period)"
                          >
                            <span
                              class="absolute inset-0 flex items-center justify-center text-xs font-medium"
                              :class="[
                                activity.selectedPeriods?.includes(period)
                                  ? 'text-white'
                                  : 'text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-white',
                              ]"
                            >
                              {{ periodType === 1 ? 'اسبوع' : 'شهر' }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <div class="space-y-1">
                        <div class="text-sm font-medium">يرجى تحديد مدة المشروع أولاً</div>
                        <div class="text-xs">قم بتحديد المدة ونوع الفترة في القسم السابق</div>
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Component Button -->
      <Button
        @click="addComponent"
        variant="outline"
        class="w-full border-dashed py-6 hover:border-gray-400 dark:hover:border-gray-600"
      >
        <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
        اضافة مكون جديد
      </Button>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import Textarea from '@/components/ui/textarea/Textarea.vue';
  import { Icon } from '@iconify/vue';
  import { computed, nextTick } from 'vue';

  // Update the Button import to match where it's located in your project
  // This path should match the one used in add-funded-project.vue
  import Button from '@/components/ui/button/Button.vue';

  interface Activity {
    name: string;
    targetPercentage: number;
    notes: string;
    selectedPeriods: number[];
  }

  interface Component {
    id: string;
    name: string;
    description: string;
    targetPercentage: number;
    activities: Activity[];
  }

  interface Props {
    components: Component[];
    periodType: number;
    totalPeriods: number;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    'update:components': [components: Component[]];
  }>();

  const componentColors = [
    { base: '#3B82F6', light: '#EFF6FF' }, // Blue
    { base: '#10B981', light: '#ECFDF5' }, // Green
    { base: '#F59E0B', light: '#FFFBEB' }, // Yellow
    { base: '#8B5CF6', light: '#F5F3FF' }, // Purple
    { base: '#EC4899', light: '#FDF2F8' }, // Pink
  ];

  const getComponentColor = (index: number, isLight = false): string => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };

  const components = computed(() => {
    return Array.isArray(props.components) ? props.components : [];
  });

  const addComponent = () => {
    if (!Array.isArray(props.components)) {
      emit('update:components', []);
      nextTick(() => {
        const newComponent: Component = {
          id: Date.now().toString(),
          name: '',
          description: '',
          targetPercentage: 0,
          activities: [],
        };
        emit('update:components', [...(props.components || []), newComponent]);
      });
    } else {
      const newComponent: Component = {
        id: Date.now().toString(),
        name: '',
        description: '',
        targetPercentage: 0,
        activities: [],
      };
      emit('update:components', [...props.components, newComponent]);
    }
  };

  const removeComponent = (index: number) => {
    const newComponents = [...props.components];
    newComponents.splice(index, 1);
    emit('update:components', newComponents);
  };

  const updateComponent = (
    index: number,
    field: keyof Component | 'targetPercentage',
    value: string | number
  ) => {
    const newComponents = [...props.components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: value,
    };
    emit('update:components', newComponents);
  };

  const addActivity = (componentIndex: number) => {
    const newComponents = [...props.components];
    if (!newComponents[componentIndex].activities) {
      newComponents[componentIndex].activities = [];
    }
    const newActivity: Activity = {
      name: '',
      targetPercentage: 0,
      notes: '',
      selectedPeriods: [],
    };
    newComponents[componentIndex].activities.push(newActivity);
    emit('update:components', newComponents);
  };

  const removeActivity = (componentIndex: number, activityIndex: number) => {
    const newComponents = [...props.components];
    newComponents[componentIndex].activities.splice(activityIndex, 1);
    emit('update:components', newComponents);
  };

  const updateActivity = (
    componentIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string | number
  ) => {
    const newComponents = [...props.components];
    newComponents[componentIndex].activities[activityIndex] = {
      ...newComponents[componentIndex].activities[activityIndex],
      [field]: value,
    };
    emit('update:components', newComponents);
  };

  const toggleActivityPeriod = (componentIndex: number, activityIndex: number, period: number) => {
    const newComponents = [...props.components];
    const activity = newComponents[componentIndex].activities[activityIndex];
    if (!activity.selectedPeriods) {
      activity.selectedPeriods = [];
    }
    const periodIndex = activity.selectedPeriods.indexOf(period);
    if (periodIndex === -1) {
      activity.selectedPeriods.push(period);
    } else {
      activity.selectedPeriods.splice(periodIndex, 1);
    }
    activity.selectedPeriods.sort((a, b) => a - b);
    emit('update:components', newComponents);
  };

  const clearActivityPeriods = (componentIndex: number, activityIndex: number) => {
    const newComponents = [...props.components];
    newComponents[componentIndex].activities[activityIndex].selectedPeriods = [];
    emit('update:components', newComponents);
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

  :deep(.dark) .custom-scrollbar {
    scrollbar-color: #4b5563 #1f2937;
  }
</style>
