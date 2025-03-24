<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100"> اضافة مشروع - ممول </h1>
        </div>

        <div class="space-y-8">
          <ProjectDetails
            :project="projectFormWithGovernment"
            :is-editing="true"
            @update:project="updateProjectDetails"
          />

          <ProjectLocation />
          <ProjectDuration />
          <ProjectAchivments />

          <!-- Components section -->
          <FormSection title="مكونات المشروع" full-width>
            <div class="space-y-6">
              <!-- Display existing components -->
              <div
                v-for="(component, index) in store.form.components"
                :key="component.id || index"
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
                      />
                    </FormField>
                    <FormField label="المستهدف الكلي للمكون">
                      <NumberInput
                        v-model="component.targetPercentage"
                        placeholder="ادخل المستهدف الكلي"
                        unit="%"
                        class="bg-white dark:bg-gray-800"
                      />
                    </FormField>
                  </div>

                  <!-- Activities Section -->
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-900 dark:text-gray-100">الفعاليات</h4>

                    <!-- Activities List -->
                    <div class="space-y-3">
                      <div
                        v-for="(activity, activityIndex) in component.activities || []"
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
                            @click="deleteActivity(index, activityIndex)"
                            variant="ghost"
                            size="sm"
                            :disabled="store.form.isSaving"
                            class="text-red-500 hover:text-red-600 dark:text-red-400"
                          >
                            <Icon
                              v-if="store.form.isSaving"
                              icon="lucide:loader-2"
                              class="h-4 w-4 animate-spin"
                            />
                            <Icon v-else icon="lucide:trash" class="h-4 w-4" />
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
                            />
                          </FormField>
                          <FormField label="المستهدف الكلي للفعالية">
                            <NumberInput
                              v-model="activity.targetPercentage"
                              placeholder="ادخل المستهدف الكلي"
                              unit="%"
                              class="bg-white dark:bg-gray-800"
                            />
                          </FormField>
                          <FormField label="ملاحظات" class="md:col-span-2">
                            <Textarea
                              v-model="activity.notes"
                              dir="rtl"
                              placeholder="ادخل الملاحظات"
                              class="min-h-[80px] bg-white dark:bg-gray-800"
                            />
                          </FormField>
                        </div>

                        <!-- Activity Weeks/Months Selection -->
                        <div class="mt-4">
                          <FormField
                            :label="
                              store.form.periodType === 1 ? 'الاسابيع المحددة' : 'الاشهر المحددة'
                            "
                          >
                            <div v-if="totalPeriods > 0" class="space-y-4">
                              <div
                                class="flex items-center justify-between rounded-lg border bg-gray-50/50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50"
                              >
                                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  {{
                                    store.form.periodType === 1
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
                                  <span
                                    class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                                  >
                                    {{ period }}
                                  </span>
                                  <button
                                    type="button"
                                    class="group relative h-12 w-full cursor-pointer rounded-md border transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                                    :class="[
                                      activity.selectedPeriods?.includes(period)
                                        ? 'border-blue-500 bg-blue-500 dark:border-blue-600 dark:bg-blue-600'
                                        : 'border-gray-200 bg-white hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600',
                                    ]"
                                    @click.prevent="
                                      toggleActivityPeriod(index, activityIndex, period)
                                    "
                                  >
                                    <span
                                      class="absolute inset-0 flex items-center justify-center text-xs font-medium"
                                      :class="[
                                        activity.selectedPeriods?.includes(period)
                                          ? 'text-white'
                                          : 'text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-white',
                                      ]"
                                    >
                                      {{ store.form.periodType === 1 ? 'اسبوع' : 'شهر' }}
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
                                <div class="text-xs"
                                  >قم بتحديد المدة ونوع الفترة في القسم السابق</div
                                >
                              </div>
                            </div>
                          </FormField>
                        </div>
                      </div>
                    </div>

                    <!-- Add Activity Button (Moved here) -->
                    <Button
                      @click="addActivity(index)"
                      variant="outline"
                      size="sm"
                      :style="{
                        borderColor: getComponentColor(index),
                        color: getComponentColor(index),
                      }"
                      class="w-full"
                    >
                      <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                      اضافة فعالية
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Add Component Button -->
              <Button
                @click="addNewComponent"
                variant="outline"
                class="w-full border-dashed py-6 hover:border-gray-400 dark:hover:border-gray-600"
              >
                <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                اضافة مكون جديد
              </Button>
            </div>
          </FormSection>

          <!-- Schedule Timeline Section -->
          <ScheduleTimeLine
            :components="store.form.components"
            :duration="store.form.duration"
            :periodType="store.form.periodType"
          />

          <ProjectPreview />
        </div>

        <div class="sticky bottom-6 left-0 right-0">
          <div class="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <Button
              @click="saveProjectWithComponents"
              class="h-12 w-full bg-slate-700 text-lg hover:bg-slate-800 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700"
              :disabled="store.isSaving"
            >
              <Icon
                v-if="store.isSaving"
                icon="lucide:loader-2"
                class="ml-2 h-4 w-4 animate-spin"
              />
              <Icon v-else icon="lucide:plus" class="ml-2 h-4 w-4" />
              {{ store.isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import ProjectAchivments from '@/components/funded-project/ProjectAchivments.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import ScheduleTimeLine from '@/components/ScheduleTimeLine.vue';
  import Button from '@/components/ui/button/Button.vue'; // Adjust the path if needed
  import Textarea from '@/components/ui/textarea/Textarea.vue';
  import { CURRENCY_CONVERSION } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const store = useFundedProjectStore();
  const router = useRouter();
  const route = useRoute();
  const projectSaved = ref(false);
  const projectId = ref(null);
  const selectedCurrency = ref('USD');
  const currencyOptions = [
    { value: 'USD', label: 'دولار أمريكي' },
    { value: 'IQD', label: 'دينار عراقي' },
  ];

  // Ensure beneficiaryEntities is always an array
  if (!Array.isArray(store.form.beneficiaryEntities)) {
    store.form.beneficiaryEntities = store.form.beneficiaryEntities
      ? [store.form.beneficiaryEntities]
      : [];
  }

  // Function to fetch project data directly
  const fetchProjectData = async (projectId) => {
    try {
      console.log('Fetching project data for ID:', projectId);

      // Make a simple GET request and await the response
      const response = await axiosInstance.get(`/api/projects/${projectId}`);

      // Log the entire response for debugging
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('isGovernment in response:', response.data.isGovernment);

      // Update the store with the project data
      if (response.data) {
        // First assign all data
        Object.assign(store.form, response.data);

        // Then explicitly force isGovernment to be a boolean
        store.form.isGovernment = response.data.isGovernment === true;

        console.log('Updated store.form:', store.form);
        console.log(
          'Store form isGovernment (after update):',
          store.form.isGovernment,
          typeof store.form.isGovernment
        );

        // Update UI state
        projectSaved.value = true;
        projectId.value = response.data.id;
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  onMounted(async () => {
    store.form = {
      name: '',
      executingDepartment: '',
      implementingEntity: '',
      beneficiaryEntities: [],
      grantingEntity: '',
      fundingType: 1,
      cost: null,
      projectObjectives: '',
      duration: 0,
      periodType: 1,
      durationType: 'weeks',
      actualStartDate: null,
      components: [],
      latitude: '',
      longitude: '',
      isSaving: false,
      hasUnsavedChanges: false,
      projectStatus: 1,
      isGovernment: false,
      financialAchievement: 0,
    };

    // A check to ensure components is always an array
    if (!Array.isArray(store.form.components)) {
      store.form.components = [];
    }

    console.log(
      'Component mounted, isGovernment initialized as:',
      store.form.isGovernment,
      typeof store.form.isGovernment
    );

    // If there's a project ID in the route, fetch the project data
    const routeProjectId = route.params.id;
    if (routeProjectId) {
      await fetchProjectData(routeProjectId);
    } else {
      // For new projects, clear the localStorage/sessionStorage
      localStorage.removeItem('fundedProject');
      sessionStorage.removeItem('fundedProject');
    }

    // Get saved currency from localStorage if available
    const savedCurrency = localStorage.getItem('projectCurrency');
    if (savedCurrency === 'IQD' || savedCurrency === 'USD') {
      selectedCurrency.value = savedCurrency;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  const handleBeforeUnload = (e) => {
    if (store.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  const totalPeriods = computed(() => {
    if (!store.form.duration) return 0;

    // For weeks (periodType 1), convert months to weeks if needed
    if (store.form.periodType === 1) {
      // If the durationType is 'months', convert to weeks (approx 4 weeks per month)
      if (store.form.durationType === 'months') {
        return parseInt(store.form.duration) * 4;
      }
      // Otherwise, if already in weeks, return the duration directly
      return parseInt(store.form.duration);
    }
    // For months (periodType 2), return the duration directly
    else {
      return parseInt(store.form.duration);
    }
  });

  const updateGovernmentStatus = (value) => {
    store.form.isGovernment = value;
    store.hasUnsavedChanges = true;
  };

  // New function to validate basic project info
  const validateProjectBasicInfo = () => {
    if (!store.form.name) {
      toast.error('يرجى ادخال اسم المشروع');
      return false;
    }
    if (!store.form.executingDepartment) {
      toast.error('يرجى اختيار الدائرة المنفذة');
      return false;
    }
    if (!store.form.implementingEntity) {
      toast.error('يرجى ادخال الجهة المنفذة');
      return false;
    }
    if (!store.form.grantingEntity) {
      toast.error('يرجى ادخال الجهة المانحة');
      return false;
    }
    if (!store.form.cost) {
      toast.error('يرجى ادخال كلفة المشروع');
      return false;
    }
    if (!store.form.duration) {
      toast.error('يرجى تحديد مدة المشروع');
      return false;
    }
    if (!store.form.actualStartDate) {
      toast.error('يرجى تحديد تاريخ بدء المشروع');
      return false;
    }
    if (!store.form.latitude || !store.form.longitude) {
      toast.error('يرجى تحديد موقع المشروع على الخريطة');
      return false;
    }
    return true;
  };

  // Function to prepare form data before sending to API
  const prepareFormData = () => {
    // Ensure data types are correct before saving
    if (store.form.cost) {
      // First parse as float to handle any existing formatting
      let costValue = parseFloat(store.form.cost);

      // Ensure it's a valid number
      if (!isNaN(costValue)) {
        // Convert currency if needed
        if (selectedCurrency.value === 'IQD') {
          // Convert from IQD to USD using constant
          costValue = costValue * CURRENCY_CONVERSION.IQD_TO_USD;
          costValue = parseFloat(costValue.toFixed(CURRENCY_CONVERSION.PRECISION.USD));
        }
        store.form.cost = costValue;
      }
    }

    // Ensure financialAchievement is a number and has a default value
    if (store.form.financialAchievement === undefined || store.form.financialAchievement === null) {
      store.form.financialAchievement = 0;
    } else {
      store.form.financialAchievement = Number(store.form.financialAchievement);
    }

    if (store.form.duration) {
      store.form.duration = parseInt(store.form.duration);

      // Ensure periodType and durationType are synchronized
      if (store.form.periodType === 1) {
        store.form.durationType = 'weeks';
      } else if (store.form.periodType === 2) {
        store.form.durationType = 'months';
      }
    }

    if (store.form.latitude) {
      store.form.latitude = parseFloat(store.form.latitude);
    }

    if (store.form.longitude) {
      store.form.longitude = parseFloat(store.form.longitude);
    }

    if (store.form.actualStartDate instanceof Date) {
      store.form.actualStartDate = store.form.actualStartDate.toISOString();
    }

    // Make sure isGovernment is explicitly a boolean
    store.form.isGovernment =
      typeof store.form.isGovernment === 'boolean'
        ? store.form.isGovernment
        : Boolean(store.form.isGovernment);

    console.log(
      'Preparing form data with isGovernment:',
      store.form.isGovernment,
      typeof store.form.isGovernment
    );
    console.log(
      'Financial Achievement:',
      store.form.financialAchievement,
      typeof store.form.financialAchievement
    );

    if (Array.isArray(store.form.beneficiaryEntities)) {
      store.form.beneficiaryEntities = store.form.beneficiaryEntities
        .filter((entity) => entity && entity.toString().trim() !== '')
        .map((entity) => {
          const parsed = parseInt(entity);
          return !isNaN(parsed) ? parsed : entity;
        });
    }
  };

  // Save the initial project data (without components)
  const saveProjectWithComponents = async () => {
    if (!validateProjectBasicInfo()) {
      return;
    }

    try {
      prepareFormData();
      store.isSaving = true;

      console.log('1. Saving project...');
      // First, save only the project using direct axios call
      const projectResponse = await axiosInstance.post('/api/project', {
        fundingType: store.form.fundingType,
        periodType: store.form.periodType,
        duration: parseInt(store.form.duration) || 0,
        name: store.form.name,
        isGovernment: store.form.isGovernment,
        executingDepartment: store.form.executingDepartment,
        implementingEntity: store.form.implementingEntity,
        grantingEntity: store.form.grantingEntity,
        lng: store.form.longitude ? parseFloat(store.form.longitude) : 0,
        lat: store.form.latitude ? parseFloat(store.form.latitude) : 0,
        beneficiaryEntities: store.form.beneficiaryEntities,
        projectStatus: store.form.projectStatus || 1,
        cost: parseFloat(store.form.cost) || 0,
        actualStartDate: store.form.actualStartDate,
        projectObjectives: store.form.projectObjectives || '',
        financialAchievement: Number(store.form.financialAchievement) || 0,
      });

      if (!projectResponse.data?.id) {
        throw new Error('Failed to get project ID after creation');
      }

      const projectId = projectResponse.data.id;
      console.log('Project saved with ID:', projectId);

      // Then save each component and its activities sequentially
      if (store.form.components && store.form.components.length > 0) {
        for (const component of store.form.components) {
          console.log('2. Saving component:', component.name);
          // Save component first using direct axios call
          const componentResponse = await axiosInstance.post('/api/Component', {
            projectId: projectId,
            name: component.name,
            targetPercentage: component.targetPercentage || 0,
          });

          if (!componentResponse.data?.id) {
            throw new Error('Failed to get component ID after creation');
          }

          const componentId = componentResponse.data.id;
          console.log('Component saved with ID:', componentId);

          // Then save each activity for this component
          if (component.activities && component.activities.length > 0) {
            for (const activity of component.activities) {
              console.log('3. Saving activity:', activity.name, 'for component:', componentId);
              // Save activity using direct axios call
              const activityResponse = await axiosInstance.post('/api/Activity', {
                componentId: componentId,
                name: activity.name,
                targetPercentage: activity.targetPercentage || 0,
                notes: activity.notes || '',
                selectedPeriods: activity.selectedPeriods || [],
                periodType: store.form.periodType,
              });

              if (!activityResponse.data) {
                throw new Error('Failed to save activity');
              }
              console.log('Activity saved successfully');
            }
          }
        }
      }

      // Show success message
      toast.success('تم حفظ المشروع بنجاح');

      // Wait a moment before redirecting to ensure the toast is visible
      setTimeout(() => {
        router.push({
          path: '/done',
          query: {
            title: 'تم حفظ المشروع بنجاح',
            message: `تم حفظ المشروع "${store.form.name}" بنجاح`,
            projectDetails: {
              id: projectId,
              name: store.form.name,
              executingDepartment: store.form.executingDepartment,
              components: store.form.components,
            },
          },
        });
      }, 1000);
    } catch (error) {
      console.error('Error in saveProjectWithComponents:', error);
      handleSaveError(error);
    } finally {
      store.isSaving = false;
    }
  };

  // Keep the helper functions for adding/removing components and activities
  const addNewComponent = () => {
    const newComponent = {
      name: '',
      targetPercentage: 0,
      activities: [],
    };

    if (!store.form.components) {
      store.form.components = [];
    }

    store.form.components.push(newComponent);
    store.hasUnsavedChanges = true;
  };

  const removeComponent = (index) => {
    store.form.components.splice(index, 1);
    store.hasUnsavedChanges = true;
  };

  const addActivity = (componentIndex) => {
    const newActivity = {
      name: '',
      targetPercentage: 0,
      notes: '',
      selectedPeriods: [],
      periodType: store.form.periodType,
    };

    if (!store.form.components[componentIndex].activities) {
      store.form.components[componentIndex].activities = [];
    }

    store.form.components[componentIndex].activities.push(newActivity);
    store.hasUnsavedChanges = true;
  };

  const deleteActivity = (componentIndex, activityIndex) => {
    if (store.form.components[componentIndex].activities) {
      store.form.components[componentIndex].activities.splice(activityIndex, 1);
      store.hasUnsavedChanges = true;
    }
  };

  const toggleActivityPeriod = (componentIndex, activityIndex, period) => {
    const activity = store.form.components[componentIndex].activities[activityIndex];

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
    store.hasUnsavedChanges = true;
  };

  const clearActivityPeriods = (componentIndex, activityIndex) => {
    const activity = store.form.components[componentIndex].activities[activityIndex];
    activity.selectedPeriods = [];
    store.hasUnsavedChanges = true;
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

  const updateProjectDetails = (updatedProject) => {
    console.log('Received updated project data from ProjectDetails');
    console.log(
      'Current isGovernment value:',
      store.form.isGovernment,
      typeof store.form.isGovernment
    );
    console.log(
      'New isGovernment value:',
      updatedProject.isGovernment,
      typeof updatedProject.isGovernment
    );

    // First, update all other properties
    Object.assign(store.form, updatedProject);

    // Then, handle isGovernment explicitly to ensure it's a boolean
    if (updatedProject.hasOwnProperty('isGovernment')) {
      // Convert explicitly to boolean (true for true/"true"/1, false otherwise)
      store.form.isGovernment =
        updatedProject.isGovernment === true ||
        updatedProject.isGovernment === 'true' ||
        updatedProject.isGovernment === 1;
    }

    console.log(
      'After update, isGovernment value:',
      store.form.isGovernment,
      typeof store.form.isGovernment
    );

    store.hasUnsavedChanges = true;
  };

  // Handle API errors
  const handleSaveError = (error) => {
    console.error('API Error:', error);
    let errorMessage = 'يرجى المحاولة مرة أخرى';

    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);

      // Handle specific error codes
      if (error.response.status === 400) {
        errorMessage = 'بيانات غير صحيحة، يرجى التحقق من المدخلات';
      } else if (error.response.status === 401) {
        errorMessage = 'غير مصرح لك بإضافة مشروع';
      } else if (error.response.status === 500) {
        errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
      }
    }

    toast.error('حدث خطأ أثناء الحفظ', {
      description: error.response?.data?.message || errorMessage,
    });
  };

  const handleCurrencyChange = (newCurrency) => {
    if (store.form.cost && selectedCurrency.value !== newCurrency) {
      // Convert the cost value when currency changes
      const currentCost = parseFloat(store.form.cost);
      if (!isNaN(currentCost)) {
        if (newCurrency === 'IQD' && selectedCurrency.value === 'USD') {
          // Convert from USD to IQD using constant
          // For display, we want to show a clean integer value for IQD
          const convertedValue = currentCost * CURRENCY_CONVERSION.USD_TO_IQD;
          store.form.cost = parseInt(convertedValue.toFixed(0));
        } else if (newCurrency === 'USD' && selectedCurrency.value === 'IQD') {
          // Convert from IQD to USD using constant
          const convertedValue = currentCost * CURRENCY_CONVERSION.IQD_TO_USD;
          // Preserve 2 decimal places for USD but keep as a clean number
          store.form.cost = parseFloat(convertedValue.toFixed(CURRENCY_CONVERSION.PRECISION.USD));
        }
      }
    }
    selectedCurrency.value = newCurrency;

    // Save preference to localStorage
    localStorage.setItem('projectCurrency', newCurrency);
  };

  // Add a helper function to format cost display
  const formatCostWithCurrency = (value, currency) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    let formattedValue;
    if (currency === 'USD') {
      formattedValue = numValue.toLocaleString('en-US', {
        minimumFractionDigits: CURRENCY_CONVERSION.PRECISION.USD,
        maximumFractionDigits: CURRENCY_CONVERSION.PRECISION.USD,
      });
      return `$${formattedValue}`;
    } else {
      formattedValue = numValue.toLocaleString('en-US', {
        minimumFractionDigits: CURRENCY_CONVERSION.PRECISION.IQD,
        maximumFractionDigits: CURRENCY_CONVERSION.PRECISION.IQD,
      });
      return `${formattedValue} د.ع`;
    }
  };

  // Add an explicit console log when passing the form to ProjectDetails
  const projectFormWithGovernment = computed(() => {
    const isGov = Boolean(store.form.isGovernment);
    console.log('Computing projectFormWithGovernment:');
    console.log(
      '- store.form.isGovernment:',
      store.form.isGovernment,
      typeof store.form.isGovernment
    );
    console.log('- converted to Boolean:', isGov, typeof isGov);

    return {
      ...store.form,
      isGovernment: isGov,
    };
  });
</script>

<style scoped>
  .form-section {
    @apply transition-all duration-200;
  }
  .form-field:focus-within {
    @apply ring-2 ring-blue-500 ring-opacity-50;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }
  :deep(.dark) .custom-scrollbar {
    scrollbar-color: #4b5563 #1f2937;
  }
</style>
