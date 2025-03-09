<template>
  <DefaultLayout>
    <div class="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div class="w-full max-w-6xl mx-auto space-y-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div class="h-24 bg-gray-200 animate-pulse rounded-xl dark:bg-gray-800"></div>
          <div class="h-48 bg-gray-200 animate-pulse rounded-xl dark:bg-gray-800"></div>
          <div class="bg-gray-200 h-96 animate-pulse rounded-xl dark:bg-gray-800"></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="p-6 text-center bg-white border border-red-200 rounded-xl dark:border-red-800 dark:bg-gray-800"
        >
          <div class="inline-block p-3 mb-3 bg-red-100 rounded-full dark:bg-red-900/30">
            <Icon icon="lucide:alert-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            حدث خطأ في تحميل المشروع
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ error }}
          </p>
          <Button @click="fetchProject" variant="outline" class="mt-4">
            <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>

        <!-- Content -->
        <template v-else-if="project">
          <!-- Header -->
          <div class="p-6 bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <div
                    class="flex items-center justify-center w-full h-full text-lg font-semibold text-blue-600 dark:text-blue-400"
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
              class="relative p-4 overflow-hidden bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800"
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
              class="relative p-4 overflow-hidden bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800"
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
              class="relative p-4 overflow-hidden bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800"
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
          <div class="bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:info" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">تفاصيل المشروع</h4>
              </div>
              <Button @click="toggleEditDetails" variant="ghost" size="sm">
                <Icon v-if="!isEditingDetails" icon="lucide:edit" class="w-4 h-4" />
                <Icon v-else icon="lucide:check" class="w-4 h-4" />
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
                    {{ project?.beneficiaryEntities || 'لم يتم تحديد الجهات المستفيدة' }}
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
              <ProjectDetails :project="editForm" @update:project="updateProjectDetails" />
              <div class="flex justify-end gap-2 mt-4">
                <Button @click="cancelEditDetails" variant="outline"> الغاء </Button>
                <Button
                  @click="saveProjectDetails"
                  :disabled="isSaving"
                  class="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon v-if="isSaving" icon="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
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
          <div class="bg-white border rounded-xl dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:target" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">المكونات والفعاليات</h4>
              </div>
              <Button @click="toggleEditComponents" variant="ghost" size="sm">
                <Icon v-if="!isEditingComponents" icon="lucide:edit" class="w-4 h-4" />
                <Icon v-else icon="lucide:check" class="w-4 h-4" />
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
              <ProjectComponents :project="editForm" @update:components="updateComponents" />
              <div class="flex justify-end gap-2 mt-4">
                <Button @click="cancelEditComponents" variant="outline"> الغاء </Button>
                <Button
                  @click="saveComponents"
                  :disabled="isSaving"
                  class="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon v-if="isSaving" icon="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </div>
        </template>
        <div class="flex justify-end">
          <div class="flex items-center gap-2">
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="w-4 h-4 mr-2" />
              توجيه المهام
            </Button>
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="w-4 h-4 mr-2" />
              عرض النسخة السابقة
            </Button>
            <Button variant="outline" class="hover:cursor-not-allowed">
              <Icon icon="lucide:lock" class="w-4 h-4 mr-2" />
              تدقيق المشروع
            </Button>
            <Button variant="destructive" @click="showDeleteConfirmation">
              <Icon icon="material-symbols-light:delete-outline" class="w-4 h-4 mr-2" />
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

  // Initialize empty editForm
  const editForm = reactive({
    name: '',
    executingDepartment: '',
    implementingEntity: '',
    beneficiaryEntities: [''],
    grantingEntity: '',
    fundingType: 1,
    cost: null,
    actualStartDate: null,
    projectObjectives: '',
    components: [],
    duration: 0,
    periodType: 1,
  });

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
        name: response.data.name,
        executingDepartment: response.data.executingDepartment,
        implementingEntity: response.data.implementingEntity,
        beneficiaryEntities: response.data.beneficiaryEntities || [''],
        grantingEntity: response.data.grantingEntity,
        fundingType: response.data.fundingType,
        cost: response.data.cost,
        actualStartDate: response.data.actualStartDate,
        projectObjectives: response.data.projectObjectives,
        components: [...(response.data.components || [])], // Deep clone components
        duration: response.data.duration,
        periodType: response.data.periodType,
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
    return project.value.duration;
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
      name: project.value.name,
      executingDepartment: project.value.executingDepartment,
      implementingEntity: project.value.implementingEntity,
      beneficiaryEntities: project.value.beneficiaryEntities,
      grantingEntity: project.value.grantingEntity,
      fundingType: project.value.fundingType,
      cost: project.value.cost,
      actualStartDate: project.value.actualStartDate,
      projectObjectives: project.value.projectObjectives,
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
    if (!editForm.actualStartDate) {
      toast.error('يرجى تحديد تاريخ بدء المشروع');
      return;
    }

    isSaving.value = true;
    try {
      const response = await axiosInstance.put(`/Project/${project.value.id}`, {
        ...editForm,
        duration: project.value.duration,
        periodType: project.value.periodType,
        beneficiaryEntities: Array.isArray(editForm.beneficiaryEntities)
          ? editForm.beneficiaryEntities
          : [editForm.beneficiaryEntities],
      });

      if (response.data) {
        project.value = response.data;
        isEditingDetails.value = false;
        toast.success('تم حفظ التغييرات بنجاح');
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
      isEditingComponents.value = true;
    }
  };

  const cancelEditComponents = () => {
    isEditingComponents.value = false;
    // Deep clone components to avoid reference issues
    editForm.components = JSON.parse(JSON.stringify(project.value.components));
  };

  const saveComponents = async () => {
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

      // Validate activities
      for (const activity of component.activities || []) {
        if (!activity.name) {
          toast.error('يرجى ادخال اسم الفعالية');
          return;
        }
        if (!activity.targetPercentage) {
          toast.error('يرجى تحديد النسبة المستهدفة للفعالية');
          return;
        }
        if (!activity.selectedPeriods?.length) {
          toast.error('يرجى تحديد الفترات للفعالية');
          return;
        }
      }
    }

    isSaving.value = true;
    try {
      // Save each component
      for (const component of editForm.components) {
        await axiosInstance.put(`/api/Component/${component.id}`, {
          ...component,
          activities: component.activities.map((activity) => ({
            ...activity,
            componentId: component.id,
          })),
        });
      }

      // Refresh project data
      const response = await axiosInstance.get(`/api/Project/${project.value.id}`);
      project.value = response.data;
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
    editForm.components = updatedComponents;
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
