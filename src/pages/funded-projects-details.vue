<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-800 dark:bg-gray-800"
        >
          <div class="mb-3 inline-block rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <Icon icon="lucide:alert-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            حدث خطأ في تحميل المشروع
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ error }}
          </p>
          <Button @click="fetchProject" variant="outline" class="mt-4">
            <Icon icon="lucide:refresh-cw" class="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>

        <!-- Content -->
        <template v-else-if="project">
          <!-- Header -->
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <div
                    class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
                  >
                    {{ project?.id }}
                  </div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ project?.name }}
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ project?.executingDepartment }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <PrimaryButton icon="material-symbols-light:print-outline"> طباعة </PrimaryButton>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">المدة الكلية</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ project?.duration }} {{ project?.periodType === 1 ? 'اسبوع' : 'شهر' }}
                </div>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500/10 dark:bg-blue-400/10"></div>
            </div>
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد المكونات</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ project?.components?.length || 0 }}
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-1 bg-green-500/10 dark:bg-green-400/10"
              ></div>
            </div>
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد الفعاليات</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{
                    project?.components?.reduce(
                      (total, comp) => total + (comp.activities?.length || 0),
                      0
                    ) || 0
                  }}
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-1 bg-purple-500/10 dark:bg-purple-400/10"
              ></div>
            </div>
          </div>

          <!-- Project Details -->
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:info" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المشروع</h4>
              </div>
              <Button @click="toggleEditDetails" variant="ghost" size="sm">
                <Icon v-if="!isEditingDetails" icon="lucide:edit" class="h-4 w-4" />
                <Icon v-else icon="lucide:check" class="h-4 w-4" />
              </Button>
            </div>

            <!-- View Mode -->
            <div v-if="!isEditingDetails" class="divide-y dark:divide-gray-700">
              <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">اسم المشروع</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.name || 'لم يتم تحديد اسم المشروع' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الدائرة المنفذة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.executingDepartment || 'لم يتم تحديد الدائرة' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المنفذة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.implementingEntity || 'لم يتم تحديد الجهة' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">الجهات المستفيدة</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{
                      project?.beneficiaries.map((b) => b.name).join(', ') ||
                      'لم يتم تحديد الجهات المستفيدة'
                    }}
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">الهدف من المشروع</div>
                <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ project?.projectObjectives || 'لم يتم تحديد الهدف' }}
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">نوع التمويل</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.fundingType === 1 ? 'مشروع ممول' : 'مشروع غير ممول' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">التمويل الدولي</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ project?.cost ? `$${formatCost(project?.cost)}` : 'لم يتم تحديد المبلغ' }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{
                      project?.actualStartDate
                        ? formatDate(project?.actualStartDate)
                        : 'لم يتم تحديد تاريخ البدء'
                    }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ الانتهاء المتوقع</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{
                      project?.actualStartDate && project?.duration
                        ? calculateEndDate(
                            project?.actualStartDate,
                            project?.duration,
                            project?.durationType
                          )
                        : 'لم يتم تحديد تاريخ الانتهاء'
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="p-4">
              <ProjectDetails
                :project="editForm"
                :is-editing="isEditingDetails"
                @update:project="updateProjectDetails"
              />
              <div class="mt-4 flex justify-end gap-2">
                <Button @click="cancelEditDetails" variant="outline"> الغاء </Button>
                <Button
                  @click="saveProjectDetails"
                  :disabled="isSaving"
                  class="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon v-if="isSaving" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </div>

          <ScheduleTimeLine
            :components="project?.components || []"
            :duration="project?.duration || 0"
            :periodType="project?.periodType || 1"
          />

          <!-- Components and Activities -->
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:target" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">المكونات والفعاليات</h4>
              </div>
              <Button @click="toggleEditComponents" variant="ghost" size="sm">
                <Icon v-if="!isEditingComponents" icon="lucide:edit" class="h-4 w-4" />
                <Icon v-else icon="lucide:check" class="h-4 w-4" />
              </Button>
            </div>

            <!-- View Mode -->
            <div v-if="!isEditingComponents">
              <ComponentsActivitiesDetails
                :components="project?.components || []"
                :periodType="project?.periodType || 1"
              />
            </div>

            <!-- Edit Mode -->
            <div v-else class="p-4">
              <ProjectComponents
                :components="editForm.components"
                :period-type="editForm.periodType"
                :total-periods="totalPeriods"
                @update:components="updateComponents"
              />
              <div class="mt-4 flex justify-end gap-2">
                <Button @click="cancelEditComponents" variant="outline"> الغاء </Button>
                <Button
                  @click="saveComponents"
                  :disabled="isSaving"
                  class="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon v-if="isSaving" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </div>
        </template>

        <!-- Achievements Section -->
        <div
          class="overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <Icon
                icon="hugeicons:task-done-01"
                class="h-5 w-5 text-gray-500 dark:text-gray-400"
              />
              <h4 class="font-medium text-gray-900 dark:text-gray-100">الإنجازات </h4>
            </div>
            <Button @click="toggleEditAchievements" variant="ghost" size="sm">
              <Icon v-if="!isEditingAchievements" icon="lucide:edit" class="h-4 w-4" />
              <Icon v-else icon="lucide:check" class="h-4 w-4" />
            </Button>
          </div>
          <div class="divide-y dark:divide-gray-700">
            <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <!-- Financial Achievement -->
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">الإنجاز المالي</div>
                <div
                  v-if="!isEditingAchievements"
                  class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ project?.financialAchievements || 'لم يتم تحديد الإنجاز المالي' }}
                </div>
                <div v-else class="mt-1">
                  <NumberInput
                    v-model="editForm.financialAchievements"
                    class="w-full"
                    placeholder="ادخل الإنجاز المالي"
                  />
                </div>
              </div>
              <!-- Technical Achievement (Premium) -->
              <div
                @click="OpenPremiumModal"
                class="relative rounded-lg border border-red-300 bg-red-200 p-4"
              >
                <div class="text-sm text-red-600">الإنجاز الفني (ميزة مدفوعة)</div>
                <div class="mt-1 text-sm font-medium text-red-600">
                  {{ project?.technicalAchievements || 'لم يتم تحديد الإنجاز الفني' }}
                </div>
                <div
                  class="absolute inset-0 flex items-center justify-center bg-red-200/10 dark:bg-gray-800/80"
                >
                  <div class="text-center">
                    <Icon icon="lucide:lock" class="mx-auto h-6 w-6 text-red-400" />
                    <p class="mt-2 text-sm text-red-400">هذه ميزة مدفوعة</p>
                  </div>
                </div>
              </div>
              <PremiumModal v-model:open="showPremiumModal" @close="showPremiumModal = false" />
            </div>
            <!-- Save/Cancel Buttons -->
            <div v-if="isEditingAchievements" class="flex justify-end gap-2 p-4">
              <Button @click="cancelEditAchievements" variant="outline">الغاء</Button>
              <Button
                @click="saveAchievements"
                :disabled="isSaving"
                class="bg-slate-700 hover:bg-slate-800"
              >
                <Icon v-if="isSaving" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end">
          <div class="flex items-center gap-2">
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="mr-2 h-4 w-4" />
              توجيه المهام
            </Button>
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="mr-2 h-4 w-4" />
              عرض النسخة السابقة
            </Button>
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="mr-2 h-4 w-4" />
              تدقيق المشروع
            </Button>
            <Button variant="destructive" @click="showDeleteConfirmation">
              <Icon icon="material-symbols-light:delete-outline" class="mr-2 h-4 w-4" />
              حذف المشروع
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    :open="showDeleteModal"
    @update:open="showDeleteModal = $event"
    title="حذف المشروع"
    description="تأكيد حذف المشروع"
    :message="`هل أنت متأكد من حذف المشروع '${project?.name}'؟ لا يمكن التراجع عن هذا الإجراء.`"
    :loading="isDeleting"
    @confirm="confirmDeleteProject"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
  import ComponentsActivitiesDetails from '@/components/ComponentsActivitiesDetails.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import ProjectComponents from '@/components/funded-project/ProjectComponents.vue';
  import ProjectDetails from '@/components/funded-project/ProjectDetails.vue';
  import PremiumModal from '@/components/PremiumModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ScheduleTimeLine from '@/components/ScheduleTimeLine.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const route = useRoute();
  const router = useRouter();
  const project = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  const isEditingDetails = ref(false);
  const isEditingComponents = ref(false);
  const isSaving = ref(false);
  const showDeleteModal = ref(false);
  const isDeleting = ref(false);
  const isEditingAchievements = ref(false);

  // Initialize empty editForm
  const editForm = reactive({
    name: '',
    executingDepartment: '',
    implementingEntity: '',
    beneficiaryEntities: [],
    grantingEntity: '',
    fundingType: 1,
    cost: null,
    actualStartDate: null,
    projectObjectives: '',
    duration: 0,
    periodType: 1,
    components: [],
    financialAchievements: '',
  });
  const showPremiumModal = ref(false);
  const OpenPremiumModal = () => {
    showPremiumModal.value = true;
  };
  const fetchProject = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log('Fetching project with ID:', route.params.id);
      const response = await axiosInstance.get(`/api/Project/${route.params.id}`);
      console.log('API Response:', response);
      project.value = response.data;

      // Initialize editForm with current project data
      Object.assign(editForm, {
        name: response.data.name || '',
        executingDepartment: response.data.executingDepartment || '',
        implementingEntity: response.data.implementingEntity || '',
        beneficiaryEntities: Array.isArray(response.data.beneficiaries)
          ? response.data.beneficiaries.map((b) => b.id)
          : [],
        grantingEntity: response.data.grantingEntity || '',
        fundingType: response.data.fundingType || 1,
        cost: response.data.cost || null,
        actualStartDate: response.data.actualStartDate || null,
        projectObjectives: response.data.projectObjectives || '',
        duration: response.data.duration || 0,
        periodType: response.data.periodType || 1,
        components: Array.isArray(response.data.components)
          ? JSON.parse(JSON.stringify(response.data.components))
          : [],
        financialAchievements: response.data.financialAchievements || '',
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      error.value = err.response?.data?.message || 'حدث خطأ في تحميل بيانات المشروع';
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchProject();
  });

  const totalPeriods = computed(() => {
    if (!project.value?.duration) return 0;
    const duration = parseInt(project.value.duration) || 0;
    if (project.value.periodType === 1) {
      return duration;
    } else {
      return duration * 4;
    }
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
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
    return formatDate(start);
  };

  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getStatusVariant = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'منجز':
        return 'success';
      case 'متلكئ':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  // Project Details Section
  const toggleEditDetails = () => {
    if (isEditingDetails.value) {
      cancelEditDetails();
    } else {
      isEditingDetails.value = true;
    }
  };

  const cancelEditDetails = () => {
    isEditingDetails.value = false;
    // Reset form to current project values
    Object.assign(editForm, {
      name: project.value.name || '',
      executingDepartment: project.value.executingDepartment || '',
      implementingEntity: project.value.implementingEntity || '',
      beneficiaryEntities: project.value.beneficiaryEntities || [],
      grantingEntity: project.value.grantingEntity || '',
      fundingType: project.value.fundingType || 1,
      cost: project.value.cost || null,
      actualStartDate: project.value.actualStartDate || null,
      projectObjectives: project.value.projectObjectives || '',
      duration: project.value.duration || 0,
      periodType: project.value.periodType || 1,
    });
  };

  const saveProjectDetails = async () => {
    // Validation checks
    if (!editForm.name) {
      toast.error('يرجى ادخال اسم المشروع');
      return;
    }
    if (!editForm.executingDepartment) {
      toast.error('يرجى اختيار الدائرة المنفذة');
      return;
    }
    if (!editForm.implementingEntity) {
      toast.error('يرجى ادخال الجهة المنفذة');
      return;
    }
    if (!editForm.grantingEntity) {
      toast.error('يرجى ادخال الجهة المانحة');
      return;
    }
    if (!editForm.cost) {
      toast.error('يرجى ادخال كلفة المشروع');
      return;
    }

    isSaving.value = true;
    try {
      const projectData = {
        name: editForm.name,
        executingDepartment: editForm.executingDepartment,
        implementingEntity: editForm.implementingEntity,
        beneficiaryEntities: editForm.beneficiaryEntities || [],
        grantingEntity: editForm.grantingEntity,
        fundingType: editForm.fundingType || 1,
        cost: parseInt(editForm.cost) || 0,
        actualStartDate: editForm.actualStartDate || project.value.actualStartDate,
        projectObjectives: editForm.projectObjectives,
        duration: project.value.duration || 0,
        periodType: project.value.periodType || 1,
        projectStatus: project.value.projectStatus || 1,
        lat: project.value.lat || 0,
        lng: project.value.lng || 0,
      };

      console.log('Sending project data:', projectData);

      const response = await axiosInstance.put(`/api/Project/${project.value.id}`, projectData);

      if (response.status === 200 || response.status === 204) {
        // Update both project and editForm with new data
        if (response.data) {
          project.value = response.data;
          // Re-sync editForm with new project data
          Object.assign(editForm, {
            name: response.data.name,
            executingDepartment: response.data.executingDepartment,
            implementingEntity: response.data.implementingEntity,
            beneficiaryEntities: Array.isArray(response.data.beneficiaries)
              ? response.data.beneficiaries.map((b) => b.id)
              : [],
            grantingEntity: response.data.grantingEntity,
            fundingType: response.data.fundingType,
            cost: response.data.cost,
            actualStartDate: response.data.actualStartDate,
            projectObjectives: response.data.projectObjectives,
            duration: response.data.duration,
            periodType: response.data.periodType,
          });
        }
        isEditingDetails.value = false;
        toast.success('تم حفظ التغييرات بنجاح');
        // Refresh the project data
        await fetchProject();
      }
    } catch (error) {
      console.error('Error saving project details:', error);
      toast.error('حدث خطأ أثناء الحفظ', {
        description: error.response?.data?.message || 'يرجى المحاولة مرة أخرى',
      });
    } finally {
      isSaving.value = false;
    }
  };

  // Components Section
  const toggleEditComponents = () => {
    if (isEditingComponents.value) {
      cancelEditComponents();
    } else {
      // Deep clone components when starting to edit
      console.log('Starting component edit with:', project.value.components);
      editForm.components = JSON.parse(JSON.stringify(project.value.components || []));
      // Ensure all components have the required properties
      editForm.components = editForm.components.map((component) => ({
        ...component,
        targetPercentage: component.targetPercentage || 0,
        activities: (component.activities || []).map((activity) => ({
          ...activity,
          targetPercentage: activity.targetPercentage || 0,
          selectedPeriods: activity.selectedPeriods || [],
        })),
      }));
      isEditingComponents.value = true;
    }
  };

  const cancelEditComponents = () => {
    isEditingComponents.value = false;
    // Reset components to current project values
    editForm.components = JSON.parse(JSON.stringify(project.value.components || []));
  };

  const saveComponents = async () => {
    if (!editForm.components || !Array.isArray(editForm.components)) {
      toast.error('لا توجد مكونات للحفظ');
      return;
    }

    // Validate components
    for (const component of editForm.components) {
      if (!component.name) {
        toast.error('يرجى ادخال اسم المكون');
        return;
      }
      if (!component.targetPercentage) {
        toast.error('يرجى تحديد النسبة المستهدفة للمكون');
        return;
      }
    }

    isSaving.value = true;
    try {
      // Save each component
      for (const component of editForm.components) {
        const componentData = {
          projectId: project.value.id,
          name: component.name,
          targetPercentage: parseFloat(component.targetPercentage) || 0,
        };

        console.log('Saving component with data:', componentData);
        const componentResponse = await axiosInstance.put(
          `/api/Component/${component.id}`,
          componentData
        );
        console.log('Component save response:', componentResponse);

        // If component save was successful and there are activities, save them separately
        if (Array.isArray(component.activities) && component.activities.length > 0) {
          for (const activity of component.activities) {
            const activityData = {
              componentId: component.id,
              name: activity.name,
              targetPercentage: parseFloat(activity.targetPercentage) || 0,
              selectedPeriods: activity.selectedPeriods || [],
            };

            console.log('Saving activity with data:', activityData);
            const activityResponse = await axiosInstance.put(
              `/api/Activity/${activity.id}`,
              activityData
            );
            console.log('Activity save response:', activityResponse);
          }
        }
      }

      // Refresh project data
      await fetchProject();
      isEditingComponents.value = false;
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error saving components:', error);
      toast.error('حدث خطأ أثناء الحفظ', {
        description: error.response?.data?.message || 'يرجى المحاولة مرة أخرى',
      });
    } finally {
      isSaving.value = false;
    }
  };

  const updateProjectDetails = (updatedProject) => {
    Object.assign(editForm, updatedProject);
  };

  const updateComponents = (updatedComponents) => {
    console.log('Received updated components:', updatedComponents);
    // Deep clone the components to avoid reference issues
    editForm.components = JSON.parse(JSON.stringify(updatedComponents));
  };

  const confirmDeleteProject = async () => {
    isDeleting.value = true;
    try {
      await axiosInstance.delete(`/Project/${project.value.id}`);
      toast.success('تم حذف المشروع بنجاح');
      router.push('/funded-projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ أثناء حذف المشروع');
    } finally {
      isDeleting.value = false;
      showDeleteModal.value = false;
    }
  };

  const showDeleteConfirmation = () => {
    showDeleteModal.value = true;
  };

  const toggleEditAchievements = () => {
    if (isEditingAchievements.value) {
      cancelEditAchievements();
    } else {
      isEditingAchievements.value = true;
      editForm.financialAchievements = project.value?.financialAchievements || '';
    }
  };

  const cancelEditAchievements = () => {
    isEditingAchievements.value = false;
    editForm.financialAchievements = project.value?.financialAchievements || '';
  };

  const saveAchievements = async () => {
    isSaving.value = true;
    try {
      const response = await axiosInstance.put(`/api/Project/${project.value.id}`, {
        ...project.value,
        financialAchievements: editForm.financialAchievements,
      });

      if (response.status === 200 || response.status === 204) {
        if (response.data) {
          project.value = response.data;
        }
        isEditingAchievements.value = false;
        toast.success('تم حفظ التغييرات بنجاح');
        await fetchProject();
      }
    } catch (error) {
      console.error('Error saving achievements:', error);
      toast.error('حدث خطأ أثناء الحفظ', {
        description: error.response?.data?.message || 'يرجى المحاولة مرة أخرى',
      });
    } finally {
      isSaving.value = false;
    }
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
