<template>
  <DefaultLayout>
    <div class="min-h-screen bg-background p-6">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div class="rounded-xl border border-border bg-background-surface p-6">
          <h1 class="text-2xl font-bold text-foreground"> اضافة مشروع - ممول </h1>
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
                class="rounded-xl border border-border bg-background-surface p-6"
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
                    <h3 class="text-lg font-medium text-foreground"> المكون {{ index + 1 }} </h3>
                  </div>
                  <Button
                    @click="removeComponent(index)"
                    variant="ghost"
                    size="sm"
                    class="bg-destructive/30 !text-destructive hover:bg-destructive/40"
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
                      />
                    </FormField>
                    <FormField label="المستهدف الكلي للمكون">
                      <NumberInput
                        v-model="component.targetPercentage"
                        placeholder="ادخل المستهدف الكلي"
                        unit="%"
                      />
                    </FormField>
                  </div>

                  <!-- Activities Section -->
                  <div class="space-y-4">
                    <h4 class="font-medium text-foreground">الفعاليات</h4>

                    <!-- Activities List -->
                    <div class="space-y-3">
                      <div
                        v-for="(activity, activityIndex) in component.activities || []"
                        :key="activityIndex"
                        class="rounded-lg border border-border bg-background-surface p-4"
                      >
                        <div class="mb-4 flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <div
                              class="h-2 w-2 rounded-full"
                              :style="{ backgroundColor: getComponentColor(index) }"
                            ></div>
                            <span class="font-medium text-foreground">
                              الفعالية {{ activityIndex + 1 }}
                            </span>
                          </div>
                          <Button
                            @click="deleteActivity(index, activityIndex)"
                            variant="ghost"
                            size="sm"
                            :disabled="store.form.isSaving"
                            class="bg-destructive/30 !text-destructive hover:bg-destructive/40"
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
                            />
                          </FormField>
                          <FormField label="المستهدف الكلي للفعالية">
                            <NumberInput
                              v-model="activity.targetPercentage"
                              placeholder="ادخل المستهدف الكلي"
                              unit="%"
                            />
                          </FormField>
                          <FormField label="ملاحظات" class="md:col-span-2">
                            <CustomTextArea
                              v-model="activity.notes"
                              dir="rtl"
                              placeholder="ادخل الملاحظات"
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
                                class="flex items-center justify-between rounded-lg border border-border bg-background-surface p-4"
                              >
                                <span class="text-sm font-medium text-foreground">
                                  {{
                                    store.form.periodType === 1
                                      ? `اختر الاسابيع (${activity.selectedPeriods?.length || 0} من ${totalPeriods})`
                                      : `اختر الاشهر (${activity.selectedPeriods?.length || 0} من ${totalPeriods})`
                                  }}
                                </span>
                                <PrimaryButton
                                  variant="link"
                                  v-if="activity.selectedPeriods?.length"
                                  type="button"
                                  class="!text-destructive"
                                  @click="clearActivityPeriods(index, activityIndex)"
                                >
                                  مسح التحديد
                                </PrimaryButton>
                              </div>
                              <div
                                class="grid gap-2 rounded-lg border border-border bg-background-surface p-4"
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
                                  <span class="mb-2 text-sm font-medium text-foreground">
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
                              class="flex items-center justify-center rounded-lg border border-border bg-background-surface p-6 text-center text-foreground"
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
                    <PrimaryButton
                      @click="addActivity(index)"
                      variant="primary"
                      size="sm"
                      class="w-full"
                    >
                      <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                      اضافة فعالية
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <!-- Add Component Button -->
              <PrimaryButton @click="addNewComponent" variant="primary" class="w-full py-6">
                <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                اضافة مكون جديد
              </PrimaryButton>
            </div>
          </FormSection>

          <!-- Schedule Timeline Section -->
          <ScheduleTimeLine
            :components="store.form?.components || []"
            :duration="store.form?.duration || 0"
            :periodType="store.form?.periodType || 1"
          />

          <ProjectPreview />
        </div>

        <div class="sticky bottom-6 left-0 right-0">
          <div class="rounded-xl border border-border bg-background-card p-4">
            <PrimaryButton
              @click="saveProjectWithComponents"
              variant="primary"
              class="h-12 w-full"
              :disabled="store.isSaving"
            >
              <Icon
                v-if="store.isSaving"
                icon="lucide:loader-2"
                class="ml-2 h-4 w-4 animate-spin"
              />
              <Icon v-else icon="lucide:plus" class="ml-2 h-4 w-4" />
              {{ store.isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import CustomInput from '@/components/CustomInput.vue';
  import CustomTextArea from '@/components/CustomTextArea.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import ProjectAchivments from '@/components/funded-project/ProjectAchivments.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import ScheduleTimeLine from '@/components/ScheduleTimeLine.vue';
  import Button from '@/components/ui/button/Button.vue';
  import { CURRENCY_CONVERSION } from '@/constants';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import {
    type CreateFundedProjectRequest,
    type FundedProject,
    FundedProjectStatus,
    FundingType,
    PeriodType,
  } from '@/types/funded-project';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const store = useFundedProjectStore();
  const router = useRouter();
  const route = useRoute();
  const projectSaved = ref(false);
  const projectId = ref<string | undefined>(undefined);
  const selectedCurrency = ref('USD');
  const currencyOptions = [
    { value: 'USD', label: 'دولار أمريكي' },
    { value: 'IQD', label: 'دينار عراقي' },
  ];

  const fetchProjectData = async (id: string) => {
    try {
      const project = await store.fetchProjectById(id);

      if (project) {
        projectSaved.value = true;
        projectId.value = project.id;
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('فشل في جلب بيانات المشروع');
    }
  };

  onMounted(async () => {
    store.form = {
      name: '',
      executingDepartment: '',
      implementingEntity: '',
      beneficiaryEntities: [],
      grantingEntity: '',
      fundingType: FundingType.GRANT,
      cost: null,
      currency: 1,
      projectObjectives: '',
      duration: 0,
      periodType: PeriodType.WEEKLY,
      durationType: 'weeks',
      actualStartDate: null,
      components: [],
      latitude: '',
      longitude: '',
      isSaving: false,
      hasUnsavedChanges: false,
      projectStatus: FundedProjectStatus.IN_PROGRESS,
      isGovernment: false,
      financialAchievement: 0,
    };

    const routeProjectId = route.params.id as string;
    if (routeProjectId) {
      await fetchProjectData(routeProjectId);
    }

    const savedCurrency = localStorage.getItem('projectCurrency');
    if (savedCurrency === 'IQD' || savedCurrency === 'USD') {
      selectedCurrency.value = savedCurrency;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (store.form.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  const totalPeriods = computed(() => {
    if (!store.form.duration) return 0;

    if (store.form.periodType === 1) {
      if (store.form.durationType === 'months') {
        return Number(store.form.duration) * 4;
      }
      return Number(store.form.duration);
    }
    return Number(store.form.duration);
  });

  const updateGovernmentStatus = (value: boolean) => {
    store.form.isGovernment = value;
    store.hasUnsavedChanges = true;
  };

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

  const prepareFormData = () => {
    if (store.form.cost) {
      let costValue = Number(store.form.cost);
      if (!isNaN(costValue)) {
        if (selectedCurrency.value === 'IQD') {
          costValue = costValue * CURRENCY_CONVERSION.IQD_TO_USD;
          costValue = Number(costValue.toFixed(CURRENCY_CONVERSION.PRECISION.USD));
        }
        store.form.cost = costValue;
      }
    }

    // Clean up and normalize components data
    if (store.form.components) {
      store.form.components = store.form.components.map((component) => {
        // Handle potential _custom wrapper
        const componentData = component._custom ? component._custom.value : component;
        return {
          name: componentData.name || '',
          targetPercentage: Number(componentData.targetPercentage) || 0,
          activities: (componentData.activities || []).map(
            (activity: {
              name?: string;
              targetPercentage?: number;
              notes?: string;
              selectedPeriods?: number[];
            }) => ({
              name: activity.name || '',
              targetPercentage: Number(activity.targetPercentage) || 0,
              notes: activity.notes || '',
              selectedPeriods: activity.selectedPeriods || [],
            })
          ),
        };
      });
    }

    store.form.financialAchievement = Number(store.form.financialAchievement) || 0;
    store.form.duration = Number(store.form.duration);
    store.form.latitude = Number(store.form.latitude);
    store.form.longitude = Number(store.form.longitude);
    store.form.isGovernment = Boolean(store.form.isGovernment);
    store.form.currency = store.form.currency || 1;

    if (store.form.actualStartDate) {
      const date = new Date(store.form.actualStartDate);
      if (!isNaN(date.getTime())) {
        store.form.actualStartDate = date.toISOString();
      }
    }

    if (Array.isArray(store.form.beneficiaryEntities)) {
      store.form.beneficiaryEntities = store.form.beneficiaryEntities.filter(
        (entity) => entity && entity.toString().trim() !== ''
      );
    }
  };

  const saveProjectWithComponents = async () => {
    if (!validateProjectBasicInfo()) {
      return;
    }

    try {
      prepareFormData();
      store.form.isSaving = true;

      const projectData: CreateFundedProjectRequest = {
        fundingType: store.form.fundingType,
        periodType: store.form.periodType,
        duration: Number(store.form.duration) || 0,
        name: store.form.name,
        isGovernment: store.form.isGovernment,
        executingDepartment: store.form.executingDepartment,
        implementingEntity: store.form.implementingEntity,
        grantingEntity: store.form.grantingEntity,
        lat: Number(store.form.latitude) || 0,
        lng: Number(store.form.longitude) || 0,
        beneficiaryEntities: store.form.beneficiaryEntities,
        projectStatus: store.form.projectStatus,
        cost: Number(store.form.cost) || 0,
        actualStartDate: store.form.actualStartDate || undefined,
        projectObjectives: store.form.projectObjectives,
        components: store.form.components || [],
      };

      const savedProject = await store.createProject(projectData);

      if (savedProject) {
        toast.success('تم حفظ المشروع بنجاح');

        setTimeout(() => {
          router.push({
            path: '/done',
            query: {
              title: 'تم حفظ المشروع بنجاح',
              message: `تم حفظ المشروع "${store.form.name}" بنجاح`,
              from: 'funded',
              projectDetails: JSON.stringify({
                id: savedProject.id,
                name: savedProject.name,
                executingDepartment: savedProject.executingDepartment,
                components: savedProject.components,
              }),
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error in saveProjectWithComponents:', error);
      handleSaveError(error);
    } finally {
      store.form.isSaving = false;
    }
  };

  const addNewComponent = () => {
    if (!store.form.components) {
      store.form.components = [];
    }

    store.form.components.push({
      name: '',
      targetPercentage: 0,
      activities: [],
    });
    store.hasUnsavedChanges = true;
  };

  const removeComponent = (index: number) => {
    if (!store.form.components) return;
    store.form.components.splice(index, 1);
    store.hasUnsavedChanges = true;
  };

  const addActivity = (componentIndex: number) => {
    if (!store.form.components?.[componentIndex]) return;

    const newActivity = {
      name: '',
      targetPercentage: 0,
      notes: '',
      selectedPeriods: [],
    };

    if (!store.form.components[componentIndex].activities) {
      store.form.components[componentIndex].activities = [];
    }

    store.form.components[componentIndex].activities.push(newActivity);
    store.hasUnsavedChanges = true;
  };

  const deleteActivity = (componentIndex: number, activityIndex: number) => {
    if (!store.form.components?.[componentIndex]?.activities) return;
    store.form.components[componentIndex].activities.splice(activityIndex, 1);
    store.hasUnsavedChanges = true;
  };

  const toggleActivityPeriod = (componentIndex: number, activityIndex: number, period: number) => {
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

    activity.selectedPeriods.sort((a: number, b: number) => a - b);
    store.hasUnsavedChanges = true;
  };

  const clearActivityPeriods = (componentIndex: number, activityIndex: number) => {
    const activity = store.form.components[componentIndex].activities[activityIndex];
    activity.selectedPeriods = [];
    store.hasUnsavedChanges = true;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateEndDate = (
    startDateString: string,
    duration: number,
    durationType: 'weeks' | 'months'
  ) => {
    if (!startDateString || !duration) return '';
    const start = new Date(startDateString);
    const durationNum = Number(duration);
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

  const getComponentColor = (index: number, isLight = false) => {
    const colorIndex = index % componentColors.length;
    return isLight ? componentColors[colorIndex].light : componentColors[colorIndex].base;
  };

  const formatCost = (value: number | null) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const updateProjectDetails = (updatedProject: Partial<FundedProject>) => {
    Object.assign(store.form, updatedProject);
    store.form.isGovernment = Boolean(updatedProject.isGovernment);
    store.hasUnsavedChanges = true;
  };

  const handleSaveError = (error: unknown) => {
    console.error('API Error:', error);
    let errorMessage = 'يرجى المحاولة مرة أخرى';

    if (error && typeof error === 'object' && 'response' in error) {
      const response = error.response as { status?: number; data?: { message?: string } };
      if (response.status === 400) {
        errorMessage = 'بيانات غير صحيحة، يرجى التحقق من المدخلات';
      } else if (response.status === 401) {
        errorMessage = 'غير مصرح لك بإضافة مشروع';
      } else if (response.status === 500) {
        errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
      }
    }

    toast.error('حدث خطأ أثناء الحفظ', {
      description:
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        errorMessage,
    });
  };

  const handleCurrencyChange = (newCurrency: 'USD' | 'IQD') => {
    if (store.form.cost && selectedCurrency.value !== newCurrency) {
      const currentCost = Number(store.form.cost);
      if (!isNaN(currentCost)) {
        if (newCurrency === 'IQD' && selectedCurrency.value === 'USD') {
          const convertedValue = currentCost * CURRENCY_CONVERSION.USD_TO_IQD;
          store.form.cost = Math.round(convertedValue);
        } else if (newCurrency === 'USD' && selectedCurrency.value === 'IQD') {
          const convertedValue = currentCost * CURRENCY_CONVERSION.IQD_TO_USD;
          store.form.cost = Number(convertedValue.toFixed(CURRENCY_CONVERSION.PRECISION.USD));
        }
      }
    }
    selectedCurrency.value = newCurrency;
    localStorage.setItem('projectCurrency', newCurrency);
  };

  const formatCostWithCurrency = (value: number | null, currency: 'USD' | 'IQD') => {
    if (!value) return '';
    const numValue = Number(value);
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

  const projectFormWithGovernment = computed(() => {
    if (!store.form) {
      return {
        isGovernment: false,
        components: [],
        name: '',
        executingDepartment: '',
        implementingEntity: '',
        beneficiaryEntities: [],
        grantingEntity: '',
        fundingType: FundingType.GRANT,
        cost: null,
        projectObjectives: '',
        duration: 0,
        periodType: PeriodType.WEEKLY,
        durationType: 'weeks',
        actualStartDate: null,
        latitude: '',
        longitude: '',
        projectStatus: FundedProjectStatus.IN_PROGRESS,
        financialAchievement: 0,
      };
    }

    return {
      ...store.form,
      components: store.form.components || [],
      isGovernment: Boolean(store.form.isGovernment),
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
