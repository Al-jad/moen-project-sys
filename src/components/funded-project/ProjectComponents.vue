<template>
  <FormSection fullWidth title="المكونات والفعاليات">
    <div class="min-w-full space-y-6">
      <!-- Components List -->
      <div
        v-for="(component, index) in components"
        :key="component.id"
        class="relative overflow-hidden rounded-lg border-r-4 bg-background-surface p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg"
        :style="{
          '--component-color': getComponentColor(index),
          '--component-color-light': getComponentColor(index, true),
          borderRightColor: getComponentColor(index),
        }"
      >
        <!-- Component Header -->
        <div class="mb-6 flex items-center justify-between rounded-lg bg-background-card p-4">
          <div class="flex items-center gap-3">
            <div
              class="h-5 w-5 rounded-full transition-transform duration-300 group-hover:scale-110"
              :style="{ backgroundColor: getComponentColor(index) }"
            ></div>
            <div>
              <h3 class="text-lg font-semibold text-foreground-heading">
                {{ component.name ? component.name : `المكون ${index + 1}` }}
              </h3>
              <p class="mt-1 text-sm text-foreground-muted">
                {{ component.activities?.length || 0 }} فعالية
              </p>
            </div>
          </div>
          <PrimaryButton @click="removeComponent(index)" variant="delete" size="sm">
            <Icon icon="lucide:trash" class="h-4 w-4" />
          </PrimaryButton>
        </div>

        <div class="space-y-6 pr-4">
          <!-- Component Fields -->
          <div class="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg bg-background-card p-4">
            <FormField label="اسم المكون">
              <CustomInput
                v-model="component.name"
                dir="rtl"
                placeholder="ادخل اسم المكون"
                @update:modelValue="updateComponent(index, 'name', $event)"
              />
            </FormField>
            <FormField label="المستهدف الكلي للمكون">
              <NumberInput
                v-model="component.targetPercentage"
                placeholder="ادخل المستهدف الكلي"
                unit="%"
                @update:modelValue="updateComponent(index, 'targetPercentage', $event)"
              />
            </FormField>
          </div>

          <!-- Activities Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-lg bg-background-surface p-3">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:list-checks" class="h-5 w-5 text-foreground-muted" />
                <h4 class="font-medium text-foreground-heading">الفعاليات</h4>
              </div>
              <PrimaryButton
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
              </PrimaryButton>
            </div>

            <!-- Activities List -->
            <div class="space-y-4">
              <div
                v-for="(activity, activityIndex) in component.activities"
                :key="activityIndex"
                class="activity-item group relative rounded-lg border bg-background-card p-6 transition-all duration-300"
              >
                <!-- Activity Header -->
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-3 w-3 rounded-full transition-transform duration-300 group-hover:scale-110"
                      :style="{ backgroundColor: getComponentColor(index) }"
                    ></div>
                    <h5 class="font-medium text-foreground-heading">
                      {{ activity.name ? activity.name : `الفعالية ${activityIndex + 1}` }}
                    </h5>
                  </div>
                  <PrimaryButton
                    @click="removeActivity(index, activityIndex)"
                    variant="delete"
                    size="sm"
                  >
                    <Icon icon="lucide:trash" class="h-4 w-4" />
                  </PrimaryButton>
                </div>

                <!-- Activity Fields -->
                <div class="flex flex-col gap-x-6 gap-y-4 rounded-lg p-4">
                  <FormField label="اسم الفعالية">
                    <CustomInput
                      v-model="activity.name"
                      dir="rtl"
                      placeholder="ادخل اسم الفعالية"
                      @update:modelValue="updateActivity(index, activityIndex, 'name', $event)"
                    />
                  </FormField>
                  <FormField label="المستهدف الكلي للفعالية">
                    <NumberInput
                      v-model="activity.targetPercentage"
                      placeholder="ادخل المستهدف الكلي"
                      unit="%"
                      @update:modelValue="
                        updateActivity(index, activityIndex, 'targetPercentage', $event)
                      "
                    />
                  </FormField>
                  <FormField label="ملاحظات">
                    <CustomTextArea
                      v-model="activity.notes"
                      dir="rtl"
                      placeholder="ادخل الملاحظات"
                      class="min-h-[80px]"
                      :value="activity.notes ?? ''"
                      @update:modelValue="
                        updateActivity(index, activityIndex, 'notes', $event || '')
                      "
                    />
                  </FormField>
                </div>

                <!-- Activity Periods Selection -->
                <div class="mt-6">
                  <FormField label="الفترات المحددة">
                    <div v-if="totalPeriods > 0" class="space-y-4">
                      <!-- Periods Header -->
                      <div
                        class="flex items-center justify-between rounded-lg border bg-background-surface p-4"
                      >
                        <div class="flex items-center gap-2">
                          <Icon icon="lucide:calendar" class="h-5 w-5 text-foreground-muted" />
                          <span class="text-sm font-medium text-foreground-heading">
                            {{ periodType === 1 ? 'الاسابيع' : 'الاشهر' }}
                            <span class="text-primary"
                              >({{ activity.selectedPeriods?.length || 0 }} من
                              {{ totalPeriods }})</span
                            >
                          </span>
                        </div>
                        <PrimaryButton
                          v-if="activity.selectedPeriods?.length"
                          variant="link"
                          class="text-sm text-destructive transition-colors hover:text-destructive/80"
                          @click="clearActivityPeriods(index, activityIndex)"
                        >
                          مسح التحديد
                        </PrimaryButton>
                      </div>
                      <div class="rounded-lg border bg-background-surface p-4">
                        <div
                          class="grid auto-rows-fr gap-2"
                          :class="{
                            'grid-cols-8': totalPeriods <= 8,
                            'grid-cols-12': totalPeriods > 8 && totalPeriods <= 12,
                            'grid-cols-16': totalPeriods > 12,
                          }"
                        >
                          <PrimaryButton
                            v-for="period in totalPeriods"
                            :key="period"
                            variant="outline"
                            class="flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-all duration-300"
                            :class="[
                              activity.selectedPeriods?.includes(period)
                                ? 'border-primary bg-primary/10 font-semibold hover:bg-primary/5 hover:text-primary'
                                : 'border-border bg-background-card text-foreground-muted hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                            ]"
                            @click="toggleActivityPeriod(index, activityIndex, period)"
                          >
                            {{ periodType === 1 ? `اسبوع ${period}` : `شهر ${period}` }}
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-center rounded-lg border border-dashed p-6 text-center"
                    >
                      <div class="space-y-2">
                        <div
                          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-surface"
                        >
                          <Icon
                            icon="lucide:calendar-x"
                            class="h-6 w-6 text-gray-400 dark:text-gray-500"
                          />
                        </div>
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                          يرجى تحديد مدة المشروع أولاً
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          قم بتحديد المدة ونوع الفترة في القسم السابق
                        </div>
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
      <PrimaryButton @click="addComponent" icon="lucide:plus" variant="primary" class="w-full py-6">
        <span>اضافة مكون جديد</span>
      </PrimaryButton>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Icon } from '@iconify/vue';
  import { computed, nextTick } from 'vue';

  // Update the Button import to match where it's located in your project
  // This path should match the one used in add-funded-project.vue

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
  .activity-item {
    border-right: 3px solid transparent;
    transition: all 0.3s ease;
  }
  .activity-item:hover {
    border-right-color: var(--component-color);
    transform: translateX(-4px);
  }
</style>
