<template>
  <DefaultLayout>
    <div class="min-h-screen bg-background p-6">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-background-surface"></div>
          <div class="h-48 animate-pulse rounded-xl bg-background-surface"></div>
          <div class="h-96 animate-pulse rounded-xl bg-background-surface"></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="rounded-xl border border-destructive bg-background-surface p-6 text-center"
        >
          <div class="mb-3 inline-block rounded-full bg-destructive/10 p-3">
            <Icon icon="lucide:alert-circle" class="h-6 w-6 text-destructive" />
          </div>
          <h3 class="text-lg font-medium text-destructive">حدث خطأ في تحميل المشروع</h3>
          <p class="mt-2 text-sm text-destructive">
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
          <div class="rounded-xl border bg-background-surface p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-primary/10">
                  <div
                    class="flex h-full w-full items-center justify-center text-lg font-semibold text-primary"
                  >
                    <Icon icon="lucide:folder" class="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-foreground-heading">
                    {{ project?.name }}
                  </h1>
                  <p class="text-foreground-subheading text-sm">
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
            <StatsCard
              label="المدة الكلية"
              :value="project?.duration"
              :unit="project?.periodType === 1 ? 'اسبوع' : 'شهر'"
              color="#3B82F6"
            />
            <StatsCard
              label="عدد المكونات"
              :value="project?.components?.length || 0"
              color="#10B981"
            />
            <StatsCard
              label="عدد الفعاليات"
              :value="
                project?.components?.reduce(
                  (total, comp) => total + (comp.activities?.length || 0),
                  0
                ) || 0
              "
              color="#8B5CF6"
            />
          </div>

          <!-- Project Details -->
          <GenericSection
            title="تفاصيل المشروع"
            icon="lucide:info"
            :data="project"
            layout="grid"
            :columns="3"
            :fields="{
              name: {
                label: 'اسم المشروع',
                type: 'text',
                props: {
                  placeholder: 'ادخل اسم المشروع',
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              executingDepartment: {
                label: 'الدائرة المنفذة',
                type: 'text',
                props: {
                  placeholder: 'ادخل الدائرة المنفذة',
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              implementingEntity: {
                label: 'الجهة المنفذة',
                type: 'text',
                props: {
                  placeholder: 'ادخل الجهة المنفذة',
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              beneficiaries: {
                label: 'الجهات المستفيدة',
                type: 'multiselect',
                formatter: (value) =>
                  value?.map((b) => b.name).join(', ') || 'لم يتم تحديد الجهات المستفيدة',
                props: {
                  options: beneficiaryOptions,
                  placeholder: 'اختر الجهات المستفيدة',
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              projectObjectives: {
                label: 'الهدف من المشروع',
                type: 'textarea',
                props: {
                  placeholder: 'اكتب أهداف المشروع',
                  rows: 3,
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              isGovernment: {
                label: 'البرنامج الحكومي',
                formatter: (value) => (true ? 'ضمن البرنامج الحكومي' : 'ليس ضمن البرنامج الحكومي'),
                editable: true,
                type: 'switch',
                props: {
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              fundingType: {
                label: 'نوع التمويل',
                type: 'switch',
                editable: false,
                formatter: (value) => (value === 1 ? 'مشروع ممول' : 'مشروع غير ممول'),
                props: {
                  label: 'مشروع ممول',
                },
              },
              cost: {
                label: 'كلفة المشروع',
                type: 'number',
                formatter: (value) => (value ? `$${formatCost(value)}` : 'لم يتم تحديد المبلغ'),
                props: {
                  placeholder: 'ادخل قيمة التمويل',
                  min: 0,
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              actualStartDate: {
                label: 'تاريخ البدء',
                type: 'date',
                formatter: (value) => (value ? formatDate(value) : 'لم يتم تحديد تاريخ البدء'),
                props: {
                  type: 'date',
                  class: 'text-base',
                  wrapperClass: 'rounded-lg border-foreground-muted/30',
                },
              },
              endDate: {
                label: 'تاريخ الانتهاء المتوقع',
                editable: false,
                type: 'date',
                props: {
                  disabled: true,
                },
                formatter: () =>
                  project?.actualStartDate && project?.duration
                    ? calculateEndDate(
                        project?.actualStartDate,
                        project?.duration,
                        project?.durationType
                      )
                    : 'لم يتم تحديد تاريخ الانتهاء',
              },
            }"
            :is-saving="isSaving"
            @save="saveProjectDetails"
            @cancel="cancelEditDetails"
          />

          <!-- Components and Activities -->
          <ViewModeSection
            title="المكونات والفعاليات"
            icon="lucide:target"
            :is-editing="isEditingComponents"
            @toggle-edit="toggleEditComponents"
          >
            <template #view-content="{ isEditing }">
              <div v-if="!isEditingComponents">
                <ComponentsActivitiesDetails
                  :components="project?.components || []"
                  :periodType="project?.periodType || 1"
                >
                  <template #componentActions="{ component }">
                    <PrimaryButton
                      @click="handleDeleteComponent(component)"
                      variant="destructive"
                      icon="lucide:trash"
                      size="sm"
                    />
                  </template>
                  <template #activityActions="{ activity, component }">
                    <PrimaryButton
                      @click="handleDeleteActivity(activity, component)"
                      variant="destructive"
                      icon="lucide:trash"
                      size="sm"
                    />
                  </template>
                </ComponentsActivitiesDetails>
              </div>
              <div v-else class="p-4">
                <ProjectComponents
                  :components="editForm.components"
                  :period-type="editForm.periodType"
                  :total-periods="totalPeriods"
                  @update:components="updateComponents"
                />
                <div class="mt-4 flex justify-end gap-2">
                  <PrimaryButton variant="outline" @click="cancelEditComponents">
                    الغاء
                  </PrimaryButton>
                  <PrimaryButton
                    @click="saveComponents"
                    :disabled="isSaving"
                    :icon="isSaving ? 'lucide:loader-2' : 'lucide:save'"
                  >
                    حفظ التغييرات
                  </PrimaryButton>
                </div>
              </div>
            </template>
          </ViewModeSection>
          <ScheduleTimeLine
            :components="project?.components || []"
            :duration="project?.duration || 0"
            :periodType="project?.periodType || 1"
          />
          <!-- Achievements Section -->
          <ViewModeSection
            title="الإنجازات"
            icon="lucide:award"
            :is-editing="isEditingAchievements"
            @toggle-edit="toggleEditAchievements"
          >
            <template #view-content="{ isEditing }">
              <div class="divide-y divide-border">
                <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                  <!-- Financial Achievement -->
                  <div>
                    <div class="text-sm text-foreground-muted">الإنجاز المالي</div>
                    <div v-if="!isEditing" class="mt-1 text-sm font-medium text-foreground-heading">
                      {{
                        project?.financialAchievement
                          ? project.financialAchievement + '%'
                          : 'لم يتم تحديد الإنجاز المالي'
                      }}
                    </div>
                    <div v-else class="mt-1">
                      <NumberInput
                        v-model="editForm.financialAchievement"
                        class="w-full"
                        placeholder="ادخل الإنجاز المالي"
                        unit="%"
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
                </div>
                <!-- Save/Cancel Buttons -->
                <div v-if="isEditing" class="flex justify-end gap-2 p-4">
                  <PrimaryButton variant="outline" @click="cancelEditAchievements"
                    >الغاء</PrimaryButton
                  >
                  <PrimaryButton
                    @click="saveAchievements"
                    :disabled="isSaving"
                    :icon="isSaving ? 'lucide:loader-2' : 'lucide:save'"
                  >
                    حفظ التغييرات
                  </PrimaryButton>
                </div>
              </div>
            </template>
          </ViewModeSection>

          <!-- Attachments Section -->
          <ViewModeSection title="المرفقات" icon="lucide:paperclip" :edit-enabled="false">
            <template #view-content>
              <div class="p-4">
                <div v-if="project?.attachments?.length > 0">
                  <CustomTable
                    :columns="attachmentColumns"
                    :items="transformedAttachments"
                    :loading="isLoading"
                    :items-per-page="8"
                    :show-export="false"
                    :show-date-filter="false"
                    :show-search="true"
                  >
                    <template #fileType="{ item }">
                      <div class="flex items-center gap-2">
                        <div :class="getFileTypeContainerClass(item.fileType)">
                          <Icon
                            :icon="item.fileType.icon"
                            :class="getFileTypeIconClass(item.fileType)"
                          />
                        </div>
                        <span class="text-sm text-foreground-muted">{{ item.fileType.type }}</span>
                      </div>
                    </template>
                    <template #action="{ item }">
                      <div class="flex items-center justify-center gap-4">
                        <a
                          :href="item.url"
                          target="_blank"
                          class="inline-flex items-center gap-1 text-nowrap text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Icon icon="tabler:download" class="h-4 w-4" />
                        </a>
                        <button
                          @click="handleEditAttachment(item)"
                          class="inline-flex items-center gap-1 text-nowrap text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Icon icon="lucide:edit" class="h-4 w-4" />
                        </button>
                        <button
                          @click="handleDeleteAttachment(item)"
                          class="inline-flex items-center gap-1 text-nowrap text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Icon icon="lucide:trash" class="h-4 w-4" />
                        </button>
                      </div>
                    </template>
                  </CustomTable>
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center"
                >
                  <div class="mb-3 rounded-full bg-background-card p-3">
                    <Icon icon="lucide:file" class="text-foreground-subheading h-8 w-8" />
                  </div>
                  <h3 class="mb-1 text-base font-medium text-foreground-heading">
                    لا توجد مرفقات
                  </h3>
                  <p class="mb-4 text-sm text-foreground-muted"> قم بإضافة مرفقات للمشروع </p>
                  <PrimaryButton
                    icon="lucide:plus"
                    variant="outline"
                    size="sm"
                    @click="openAttachmentDialog"
                  >
                    إضافة
                  </PrimaryButton>
                </div>
              </div>
            </template>
          </ViewModeSection>

          <!-- Attachment Modal -->
          <AttachmentEditModal
            v-model:open="isAttachmentDialogOpen"
            :loading="isUploading"
            :attachment="selectedAttachment"
            :project-id="project?.id"
            @confirm="handleAttachmentSubmit"
            @cancel="closeAttachmentDialog"
          />

          <!-- Delete Attachment Modal -->
          <DeleteModal
            v-model:open="isDeleteAttachmentModalOpen"
            title="حذف المرفق"
            description="تأكيد حذف المرفق"
            :message="
              selectedAttachment?.title
                ? `هل أنت متأكد من حذف المرفق '${selectedAttachment.title}'؟`
                : ''
            "
            :sub-message="'سيتم حذف المرفق نهائياً من النظام'"
            :checklist="[
              {
                text: 'لن يمكنك استعادة البيانات بعد الحذف',
                icon: 'lucide:x-circle',
              },
              {
                text: 'سيتم إزالة المرفق من جميع السجلات',
                icon: 'lucide:alert-triangle',
              },
            ]"
            :loading="isDeleting"
            @confirm="confirmDeleteAttachment"
            @cancel="cancelDeleteAttachment"
          />

          <!-- Delete Component Modal -->
          <DeleteModal
            v-model:open="isDeleteComponentModalOpen"
            title="حذف المكون"
            description="تأكيد حذف المكون"
            :message="
              selectedComponentToDelete?.name
                ? `هل أنت متأكد من حذف المكون '${selectedComponentToDelete.name}'؟`
                : ''
            "
            :sub-message="'سيتم حذف جميع الفعاليات المرتبطة بالمكون'"
            :checklist="[
              {
                text: 'لن يمكنك استعادة البيانات بعد الحذف',
                icon: 'lucide:x-circle',
              },
              {
                text: 'سيتم إزالة جميع الفعاليات المرتبطة بالمكون',
                icon: 'lucide:alert-triangle',
              },
            ]"
            :loading="isDeleting"
            @confirm="confirmDeleteComponent"
            @cancel="cancelDeleteComponent"
          />

          <!-- Delete Activity Modal -->
          <DeleteModal
            v-model:open="isDeleteActivityModalOpen"
            title="حذف الفعالية"
            description="تأكيد حذف الفعالية"
            :message="
              selectedActivityToDelete?.name
                ? `هل أنت متأكد من حذف الفعالية '${selectedActivityToDelete.name}' من المكون '${selectedActivityToDelete.componentName}'؟`
                : ''
            "
            :sub-message="'سيتم حذف الفعالية نهائياً من المكون'"
            :checklist="[
              {
                text: 'لن يمكنك استعادة البيانات بعد الحذف',
                icon: 'lucide:x-circle',
              },
              {
                text: 'سيتم إزالة الفعالية من المكون',
                icon: 'lucide:alert-triangle',
              },
            ]"
            :loading="isDeleting"
            @confirm="confirmDeleteActivity"
            @cancel="cancelDeleteActivity"
          />

          <!-- Action Buttons -->
          <div class="flex justify-end">
            <div class="flex items-center gap-2">
              <PrimaryButton icon="lucide:lock" variant="outline" class="hover:cursor-not-allowed">
                توجيه المهام
              </PrimaryButton>
              <PrimaryButton icon="lucide:lock" variant="outline" class="hover:cursor-not-allowed">
                عرض النسخة السابقة
              </PrimaryButton>
              <PrimaryButton icon="lucide:lock" variant="outline" class="hover:cursor-not-allowed">
                تدقيق المشروع
              </PrimaryButton>
              <PrimaryButton
                icon="lucide:trash"
                variant="destructive"
                @click="showDeleteConfirmation"
              >
                حذف المشروع
              </PrimaryButton>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefaultLayout>

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:open="showDeleteModal"
    :loading="isDeleting"
    title="حذف المشروع"
    description="تأكيد حذف المشروع"
    :message="`هل أنت متأكد من حذف المشروع '${project?.name}'؟`"
    :sub-message="'سيتم حذف جميع البيانات المرتبطة بالمشروع بشكل نهائي'"
    :checklist="[
      {
        text: 'لن يمكنك استعادة البيانات بعد الحذف',
        icon: 'lucide:x-circle',
      },
      {
        text: 'سيتم إزالة جميع السجلات المرتبطة بالمشروع',
        icon: 'lucide:alert-triangle',
      },
    ]"
    @confirm="confirmDeleteProject"
    @cancel="() => (showDeleteModal = false)"
  />
</template>

<script setup>
  import AttachmentEditModal from '@/components/AttachmentEditModal.vue';
  import ComponentsActivitiesDetails from '@/components/ComponentsActivitiesDetails.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import ProjectComponents from '@/components/funded-project/ProjectComponents.vue';
  import GenericSection from '@/components/GenericSection.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ScheduleTimeLine from '@/components/ScheduleTimeLine.vue';
  import ViewModeSection from '@/components/ViewModeSection.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance, { API_CONFIG, fileUploadInstance } from '@/plugins/axios';
  import { fundedProjectService } from '@/services/fundedProjectService';
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
    financialAchievement: 0,
  });
  const showPremiumModal = ref(false);
  const OpenPremiumModal = () => {
    showPremiumModal.value = true;
  };
  const fetchProject = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fundedProjectService.getProjectById(Number(route.params.id));
      project.value = response;

      // Initialize editForm with current project data
      Object.assign(editForm, {
        name: response.name || '',
        executingDepartment: response.executingDepartment || '',
        implementingEntity: response.implementingEntity || '',
        beneficiaryEntities: Array.isArray(response.beneficiaries)
          ? response.beneficiaries.map((b) => b.id)
          : [],
        grantingEntity: response.grantingEntity || '',
        fundingType: response.fundingType || 1,
        cost: response.cost || null,
        actualStartDate: response.actualStartDate || null,
        projectObjectives: response.projectObjectives || '',
        duration: response.duration || 0,
        periodType: response.periodType || 1,
        components: Array.isArray(response.components)
          ? JSON.parse(JSON.stringify(response.components))
          : [],
        financialAchievement: response.financialAchievement || 0,
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
    fetchBeneficiaryOptions();
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

      const response = await fundedProjectService.updateFundedProject(
        project.value.id,
        projectData
      );

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

        let savedComponent;
        if (component.id) {
          // Update existing component
          await fundedProjectService.updateComponent(component.id, componentData);
          savedComponent = component;
        } else {
          // Create new component
          const componentResponse = await fundedProjectService.createComponent(componentData);
          savedComponent = componentResponse.data;
        }

        // If component save was successful and there are activities, save them separately
        if (Array.isArray(component.activities) && component.activities.length > 0) {
          for (const activity of component.activities) {
            const activityData = {
              componentId: savedComponent.id,
              name: activity.name,
              targetPercentage: parseFloat(activity.targetPercentage) || 0,
              selectedPeriods: activity.selectedPeriods || [],
            };

            if (activity.id) {
              // Update existing activity
              await axiosInstance.put(`/api/Activity/${activity.id}`, activityData);
            } else {
              // Create new activity
              await axiosInstance.post('/api/Activity', activityData);
            }
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
    // Deep clone the components to avoid reference issues
    editForm.components = JSON.parse(JSON.stringify(updatedComponents));
  };

  const confirmDeleteProject = async () => {
    isDeleting.value = true;
    try {
      await axiosInstance.delete(`/api/Project/${project.value.id}`);
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
    if (!project.value) return;
    showDeleteModal.value = true;
  };

  const toggleEditAchievements = () => {
    if (isEditingAchievements.value) {
      cancelEditAchievements();
    } else {
      isEditingAchievements.value = true;
      editForm.financialAchievement = project.value?.financialAchievement || 0;
    }
  };

  const cancelEditAchievements = () => {
    isEditingAchievements.value = false;
    editForm.financialAchievement = project.value?.financialAchievement || 0;
  };

  const saveAchievements = async () => {
    isSaving.value = true;
    try {
      const response = await axiosInstance.put(`/api/Project/${project.value.id}`, {
        ...project.value,
        financialAchievement: Number(editForm.financialAchievement) || 0,
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

  // Add these new refs and functions for attachments
  const isAttachmentDialogOpen = ref(false);
  const isUploading = ref(false);
  const selectedAttachment = ref(null);
  const isDeleteAttachmentModalOpen = ref(false);

  const openAttachmentDialog = () => {
    selectedAttachment.value = null;
    isAttachmentDialogOpen.value = true;
  };

  const closeAttachmentDialog = () => {
    selectedAttachment.value = null;
    isAttachmentDialogOpen.value = false;
  };

  const handleAttachmentSubmit = async (formData) => {
    try {
      isUploading.value = true;
      if (!formData.file && !formData.url) {
        toast.error('يرجى اختيار ملف');
        return;
      }

      let fileUrl = formData.url;
      if (formData.file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.file);
        const uploadResponse = await fileUploadInstance.post(API_CONFIG.FILE_URL, uploadFormData);
        fileUrl = uploadResponse.data.url;
      }

      const attachmentData = {
        title: formData.title,
        description: formData.description,
        url: fileUrl,
        projectId: project.value.id,
      };

      if (selectedAttachment.value) {
        // Update existing attachment
        await axiosInstance.put(`/api/Attachment/${selectedAttachment.value.id}`, attachmentData);
        toast.success('تم تعديل المرفق بنجاح');
      } else {
        // Create new attachment
        await axiosInstance.post('/api/Attachment', attachmentData);
        toast.success('تم إضافة المرفق بنجاح');
      }

      closeAttachmentDialog();
      await fetchProject();
    } catch (error) {
      console.error('Error in attachment process:', error);
      toast.error('حدث خطأ أثناء معالجة المرفق');
    } finally {
      isUploading.value = false;
    }
  };

  const handleEditAttachment = (attachment) => {
    selectedAttachment.value = attachment;
    isAttachmentDialogOpen.value = true;
  };

  const handleDeleteAttachment = (attachment) => {
    selectedAttachment.value = attachment;
    isDeleteAttachmentModalOpen.value = true;
  };

  const confirmDeleteAttachment = async () => {
    try {
      isDeleting.value = true;
      await axiosInstance.delete(`/api/Attachment/${selectedAttachment.value.id}`);
      await fetchProject();
      toast.success('تم حذف المرفق بنجاح');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('حدث خطأ أثناء حذف المرفق');
    } finally {
      isDeleting.value = false;
      isDeleteAttachmentModalOpen.value = false;
      selectedAttachment.value = null;
    }
  };

  const cancelDeleteAttachment = () => {
    isDeleteAttachmentModalOpen.value = false;
    selectedAttachment.value = null;
  };

  const getFileTypeInfo = (url) => {
    if (!url) return { type: 'غير معروف', icon: 'lucide:help-circle', color: 'gray' };

    const extension = url.split('.').pop()?.toLowerCase();

    const types = {
      pdf: { type: 'PDF', icon: 'lucide:file-text', color: 'red' },
      doc: { type: 'Word', icon: 'lucide:file-text', color: 'blue' },
      docx: { type: 'Word', icon: 'lucide:file-text', color: 'blue' },
      xls: { type: 'Excel', icon: 'lucide:table', color: 'green' },
      xlsx: { type: 'Excel', icon: 'lucide:table', color: 'green' },
      ppt: { type: 'PowerPoint', icon: 'lucide:presentation', color: 'orange' },
      pptx: { type: 'PowerPoint', icon: 'lucide:presentation', color: 'orange' },
      jpg: { type: 'صورة', icon: 'lucide:image', color: 'purple' },
      jpeg: { type: 'صورة', icon: 'lucide:image', color: 'purple' },
      png: { type: 'صورة', icon: 'lucide:image', color: 'purple' },
      gif: { type: 'صورة', icon: 'lucide:image', color: 'purple' },
      txt: { type: 'نص', icon: 'lucide:file-text', color: 'gray' },
    };

    return types[extension] || { type: 'ملف', icon: 'lucide:file', color: 'gray' };
  };

  const getFileTypeContainerClass = (fileType) => {
    const baseClasses = 'rounded-full p-2';
    const colorClasses = {
      red: 'bg-red-50 dark:bg-red-950/30',
      blue: 'bg-blue-50 dark:bg-blue-950/30',
      green: 'bg-green-50 dark:bg-green-950/30',
      orange: 'bg-orange-50 dark:bg-orange-950/30',
      purple: 'bg-purple-50 dark:bg-purple-950/30',
      gray: 'bg-gray-50 dark:bg-gray-800',
    };
    return `${baseClasses} ${colorClasses[fileType.color]}`;
  };

  const getFileTypeIconClass = (fileType) => {
    const baseClasses = 'h-4 w-4';
    const colorClasses = {
      red: 'text-red-600 dark:text-red-400',
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      orange: 'text-orange-600 dark:text-orange-400',
      purple: 'text-purple-600 dark:text-purple-400',
      gray: 'text-gray-600 dark:text-gray-400',
    };
    return `${baseClasses} ${colorClasses[fileType.color]}`;
  };

  const attachmentColumns = [
    {
      key: 'fileType',
      label: 'النوع',
      type: 'custom',
      width: '7rem',
    },
    {
      key: 'title',
      label: 'عنوان المرفق',
      type: 'text',
    },
    {
      key: 'description',
      label: 'الوصف',
      type: 'text',
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإضافة',
      type: 'text',
    },
    {
      key: 'action',
      label: 'الإجراءات',
      type: 'action',
      icon: 'tabler:download',
    },
  ];

  const transformedAttachments = computed(() => {
    return (
      project.value?.attachments?.map((attachment) => ({
        ...attachment,
        fileType: getFileTypeInfo(attachment.url),
        createdAt: new Date(attachment.createdAt).toLocaleDateString('ar-SA'),
      })) || []
    );
  });

  // Add these new refs and functions for components and activities
  const isDeleteComponentModalOpen = ref(false);
  const isDeleteActivityModalOpen = ref(false);
  const selectedComponentToDelete = ref(null);
  const selectedActivityToDelete = ref(null);

  const handleDeleteComponent = (component) => {
    selectedComponentToDelete.value = component;
    isDeleteComponentModalOpen.value = true;
  };

  const handleDeleteActivity = (activity, component) => {
    selectedActivityToDelete.value = { ...activity, componentName: component.name };
    isDeleteActivityModalOpen.value = true;
  };

  const confirmDeleteComponent = async () => {
    if (!selectedComponentToDelete.value?.id) return;

    try {
      isDeleting.value = true;
      await axiosInstance.delete(`/api/Component/${selectedComponentToDelete.value.id}`);
      toast.success('تم حذف المكون بنجاح');
      await fetchProject();
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('حدث خطأ أثناء حذف المكون');
    } finally {
      isDeleting.value = false;
      isDeleteComponentModalOpen.value = false;
      selectedComponentToDelete.value = null;
    }
  };

  const confirmDeleteActivity = async () => {
    if (!selectedActivityToDelete.value?.id) return;

    try {
      isDeleting.value = true;
      await axiosInstance.delete(`/api/Activity/${selectedActivityToDelete.value.id}`);
      toast.success('تم حذف الفعالية بنجاح');
      await fetchProject();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('حدث خطأ أثناء حذف الفعالية');
    } finally {
      isDeleting.value = false;
      isDeleteActivityModalOpen.value = false;
      selectedActivityToDelete.value = null;
    }
  };

  const cancelDeleteComponent = () => {
    isDeleteComponentModalOpen.value = false;
    selectedComponentToDelete.value = null;
  };

  const cancelDeleteActivity = () => {
    isDeleteActivityModalOpen.value = false;
    selectedActivityToDelete.value = null;
  };

  // Add this near the top of your script setup
  const beneficiaryOptions = ref([]);

  // Fetch beneficiary options
  const fetchBeneficiaryOptions = async () => {
    try {
      const response = await axiosInstance.get('/api/Beneficiary');
      beneficiaryOptions.value = response.data.map((beneficiary) => ({
        value: beneficiary.id,
        label: beneficiary.name,
      }));
    } catch (error) {
      console.error('Error fetching beneficiary options:', error);
      toast.error('حدث خطأ في تحميل الجهات المستفيدة');
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
