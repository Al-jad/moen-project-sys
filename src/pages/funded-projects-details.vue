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

        <!-- Attachments Section -->
        <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:paperclip" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h4 class="font-medium text-gray-900 dark:text-gray-100">المرفقات</h4>
            </div>
            <Button @click="openAttachmentDialog" variant="ghost" size="sm">
              <Icon icon="lucide:plus" class="h-4 w-4" />
            </Button>
          </div>

          <div class="p-4">
            <div v-if="project?.attachments?.length > 0">
              <CustomTable
                :columns="attachmentColumns"
                :data="transformedAttachments"
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{
                      item.fileType.type
                    }}</span>
                  </div>
                </template>
                <template #action="{ item }">
                  <div class="flex items-center justify-center gap-4">
                    <a
                      :href="item.url"
                      target="_blank"
                      class="inline-flex items-center gap-1 text-nowrap text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Icon icon="lucide:external-link" class="h-4 w-4" />
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
              class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center dark:border-gray-700"
            >
              <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Icon icon="lucide:file" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">
                لا توجد مرفقات
              </h3>
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                قم بإضافة مرفقات للمشروع
              </p>
              <Button variant="outline" size="sm" @click="openAttachmentDialog">
                <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                إضافة مرفق
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

  <!-- Delete Attachment Modal -->
  <DeleteModal
    v-model:open="isDeleteAttachmentModalOpen"
    title="حذف المرفق"
    description="تأكيد حذف المرفق"
    :message="
      selectedAttachment?.title
        ? 'هل أنت متأكد من حذف المرفق ' + selectedAttachment.title + '؟'
        : ''
    "
    :loading="isDeleting"
    @confirm="confirmDeleteAttachment"
    @cancel="cancelDeleteAttachment"
  />

  <!-- Edit Attachment Modal -->
  <Dialog :open="isEditAttachmentModalOpen" @update:open="closeEditAttachmentDialog">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-center">تعديل المرفق</DialogTitle>
        <DialogDescription class="text-center">قم بتعديل بيانات المرفق</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleEditAttachmentSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">عنوان المرفق</label>
          <input
            v-model="editAttachmentData.title"
            type="text"
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
          <textarea
            v-model="editAttachmentData.description"
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            rows="3"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">الملف</label>
          <input
            ref="editFileInput"
            type="file"
            @change="handleEditFileChange"
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <DialogFooter class="flex justify-center gap-4 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            @click="closeEditAttachmentDialog"
            class="min-w-[8rem]"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            :disabled="isUploading"
            class="min-w-[8rem] bg-blue-600 hover:bg-blue-700"
          >
            <Icon v-if="isUploading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            {{ isUploading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
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
      const response = await axiosInstance.get(`/api/Project/${route.params.id}`);
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

        const componentResponse = await axiosInstance.put(
          `/api/Component/${component.id}`,
          componentData
        );

        // If component save was successful and there are activities, save them separately
        if (Array.isArray(component.activities) && component.activities.length > 0) {
          for (const activity of component.activities) {
            const activityData = {
              componentId: component.id,
              name: activity.name,
              targetPercentage: parseFloat(activity.targetPercentage) || 0,
              selectedPeriods: activity.selectedPeriods || [],
            };

            const activityResponse = await axiosInstance.put(
              `/api/Activity/${activity.id}`,
              activityData
            );
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

  // Add these new refs and functions for attachments
  const isAttachmentDialogOpen = ref(false);
  const isUploading = ref(false);
  const fileInput = ref(null);
  const attachmentData = ref({
    title: '',
    description: '',
    url: '',
    projectId: 0,
  });

  const getFileTypeInfo = (filename) => {
    if (!filename) return { type: 'unknown', color: 'gray', icon: 'lucide:file' };

    const extension = filename.split('.').pop()?.toLowerCase();

    const typeMap = {
      // Images
      jpg: { type: 'صورة', color: 'emerald', icon: 'lucide:image' },
      jpeg: { type: 'صورة', color: 'emerald', icon: 'lucide:image' },
      png: { type: 'صورة', color: 'emerald', icon: 'lucide:image' },
      gif: { type: 'صورة', color: 'emerald', icon: 'lucide:image' },
      svg: { type: 'صورة', color: 'emerald', icon: 'lucide:image' },

      // Documents
      pdf: { type: 'PDF', color: 'red', icon: 'lucide:file-text' },
      doc: { type: 'مستند', color: 'blue', icon: 'lucide:file-text' },
      docx: { type: 'مستند', color: 'blue', icon: 'lucide:file-text' },
      txt: { type: 'نص', color: 'gray', icon: 'lucide:file-text' },

      // Spreadsheets
      xls: { type: 'جدول بيانات', color: 'green', icon: 'lucide:table' },
      xlsx: { type: 'جدول بيانات', color: 'green', icon: 'lucide:table' },
      csv: { type: 'جدول بيانات', color: 'green', icon: 'lucide:table' },

      // Archives
      zip: { type: 'ملف مضغوط', color: 'yellow', icon: 'lucide:folder' },
      rar: { type: 'ملف مضغوط', color: 'yellow', icon: 'lucide:folder' },
      '7z': { type: 'ملف مضغوط', color: 'yellow', icon: 'lucide:folder' },
    };

    return typeMap[extension] || { type: 'ملف', color: 'gray', icon: 'lucide:file' };
  };

  const getFileTypeContainerClass = (fileType) => {
    const baseClasses = 'flex h-8 w-8 items-center justify-center rounded-lg';
    const colorClasses = {
      emerald: 'bg-emerald-50 dark:bg-emerald-500/10',
      red: 'bg-red-50 dark:bg-red-500/10',
      blue: 'bg-blue-50 dark:bg-blue-500/10',
      gray: 'bg-gray-50 dark:bg-gray-500/10',
      green: 'bg-green-50 dark:bg-green-500/10',
      yellow: 'bg-yellow-50 dark:bg-yellow-500/10',
    };

    return `${baseClasses} ${colorClasses[fileType.color] || colorClasses.gray}`;
  };

  const getFileTypeIconClass = (fileType) => {
    const baseClasses = 'h-4 w-4';
    const colorClasses = {
      emerald: 'text-emerald-500 dark:text-emerald-400',
      red: 'text-red-500 dark:text-red-400',
      blue: 'text-blue-500 dark:text-blue-400',
      gray: 'text-gray-500 dark:text-gray-400',
      green: 'text-green-500 dark:text-green-400',
      yellow: 'text-yellow-500 dark:text-yellow-400',
    };

    return `${baseClasses} ${colorClasses[fileType.color] || colorClasses.gray}`;
  };

  const openAttachmentDialog = () => {
    isAttachmentDialogOpen.value = true;
    attachmentData.value.projectId = project.value.id;
  };

  const closeAttachmentDialog = () => {
    isAttachmentDialogOpen.value = false;
    resetAttachmentForm();
  };

  const resetAttachmentForm = () => {
    attachmentData.value = {
      title: '',
      description: '',
      url: '',
      projectId: project.value.id,
    };
    if (fileInput.value) fileInput.value.value = '';
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      attachmentData.value.url = URL.createObjectURL(file);
    }
  };

  const handleAttachmentSubmit = async () => {
    try {
      isUploading.value = true;
      const file = fileInput.value.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axiosInstance.post(
        'https://encode.ibaity.com/uploads/raw',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      attachmentData.value.url = uploadResponse.data.url;
      await axiosInstance.post('/api/Attachment', attachmentData.value);
      closeAttachmentDialog();
      await fetchProject();
      toast.success('تم إضافة المرفق بنجاح');
    } catch (error) {
      console.error('Error in attachment process:', error);
      toast.error('حدث خطأ أثناء رفع المرفق');
    } finally {
      isUploading.value = false;
    }
  };

  const handleEditAttachment = (attachment) => {
    selectedAttachment.value = attachment;
    editAttachmentData.value = {
      title: attachment.title,
      description: attachment.description,
      url: attachment.url,
    };
    isEditAttachmentModalOpen.value = true;
  };

  const handleDeleteAttachment = (attachment) => {
    selectedAttachment.value = attachment;
    isDeleteAttachmentModalOpen.value = true;
  };

  // New refs and functions for the new attachment handling
  const isDeleteAttachmentModalOpen = ref(false);
  const selectedAttachment = ref(null);
  const editAttachmentData = ref({
    title: '',
    description: '',
    url: '',
  });
  const editFileInput = ref(null);

  const confirmDeleteAttachment = async () => {
    try {
      await axiosInstance.delete(`/api/Attachment/${selectedAttachment.value.id}`);
      await fetchProject();
      toast.success('تم حذف المرفق بنجاح');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('حدث خطأ أثناء حذف المرفق');
    } finally {
      isDeleteAttachmentModalOpen.value = false;
    }
  };

  const cancelDeleteAttachment = () => {
    isDeleteAttachmentModalOpen.value = false;
    selectedAttachment.value = null;
  };

  const handleEditAttachmentSubmit = async (event) => {
    event.preventDefault();
    try {
      isUploading.value = true;
      const file = editFileInput.value.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axiosInstance.post(
        'https://encode.ibaity.com/uploads/raw',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      editAttachmentData.value.url = uploadResponse.data.url;
      await axiosInstance.put(
        `/api/Attachment/${selectedAttachment.value.id}`,
        editAttachmentData.value
      );
      await fetchProject();
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error in attachment process:', error);
      toast.error('حدث خطأ أثناء رفع المرفق');
    } finally {
      isUploading.value = false;
    }
  };

  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      editAttachmentData.value.url = URL.createObjectURL(file);
    }
  };

  const closeEditAttachmentDialog = () => {
    isEditAttachmentModalOpen.value = false;
    selectedAttachment.value = null;
    resetAttachmentForm();
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
      icon: 'lucide:external-link',
    },
  ];

  const transformedAttachments = computed(() => {
    return (
      project.value?.attachments?.map((attachment) => {
        const fileInfo = getFileTypeInfo(attachment.url);
        return {
          ...attachment,
          createdAt: formatDate(attachment.createdAt),
          fileType: fileInfo,
        };
      }) || []
    );
  });
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
