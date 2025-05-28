<template>
  <DefaultLayout>
    <Toaster position="bottom-left" />
    <main class="min-h-screen bg-background p-6">
      <div class="rounded-xl border border-border bg-card shadow-lg">
        <div class="p-8">
          <!-- Page Header -->
          <div class="mb-8 border-b border-border pb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <BackToMainButton />
                <div>
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">
                    إدارة المرفقات
                    <span v-if="!isLoading" class="text-lg font-medium text-foreground-muted">
                      ({{ attachmentsCount }})
                    </span>
                  </h1>
                  <p class="text-foreground-muted">عرض وإدارة جميع مرفقات المشاريع</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading && attachments.length === 0" class="space-y-6">
            <div class="flex items-center justify-center py-16">
              <div class="flex flex-col items-center gap-4">
                <div
                  class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
                ></div>
                <p class="text-foreground-muted">جاري تحميل المرفقات...</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-else-if="attachments.length > 0">
            <CustomTable
              ref="tableRef"
              :columns="tableColumns"
              :data="transformedAttachments"
              :filters="tableFilters"
              @export="exportToExcel"
              @action-click="handleActionClick"
              :isExportPremium="false"
              :loading="isLoading"
            >
              <template #fileType="{ item }">
                <div class="flex items-center gap-3">
                  <div :class="getFileTypeContainerClass(item.fileType)">
                    <Icon :icon="item.fileType.icon" :class="getFileTypeIconClass(item.fileType)" />
                  </div>
                  <span class="text-sm font-medium text-foreground-body">{{
                    item.fileType.type
                  }}</span>
                </div>
              </template>

              <template #title="{ item }">
                <div class="max-w-xs">
                  <p class="truncate font-medium text-foreground-heading" :title="item.title">
                    {{ item.title }}
                  </p>
                  <p
                    v-if="item.description"
                    class="truncate text-sm text-foreground-muted"
                    :title="item.description"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </template>

              <template #projectName="{ item }">
                <Badge
                  class="w-fit border-0 bg-accent font-medium text-accent-foreground shadow-sm"
                >
                  {{ item.projectName || 'غير محدد' }}
                </Badge>
              </template>

              <template #createdAt="{ item }">
                <div class="font-medium text-foreground-body">
                  {{ item.createdAt }}
                </div>
              </template>

              <template #actions="{ item }">
                <div class="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-primary hover:bg-primary/10 hover:text-primary"
                    @click="downloadAttachment(item)"
                    :title="'تحميل ' + item.title"
                  >
                    <Icon icon="tabler:download" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-500/10"
                    @click="handleEdit(item)"
                    :title="'تعديل ' + item.title"
                  >
                    <Icon icon="lucide:edit" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    @click="handleDelete(item)"
                    :disabled="isDeleting"
                    :title="'حذف ' + item.title"
                  >
                    <Icon icon="lucide:trash" class="h-4 w-4" />
                  </Button>
                </div>
              </template>
            </CustomTable>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-16">
            <div class="rounded-full bg-muted p-6">
              <Icon icon="lucide:file-plus" class="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-foreground-heading">لا توجد مرفقات</h3>
            <p class="mt-2 max-w-sm text-center text-foreground-muted">
              لم يتم العثور على أي مرفقات للمشروع المحدد. ابدأ بإضافة مرفق جديد.
            </p>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <AttachmentEditModal
        v-model:open="isEditModalOpen"
        :loading="isLoading"
        :attachment="selectedAttachment"
        @confirm="handleSaveEdit"
        @cancel="selectedAttachment = null"
      />

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:open="isDeleteModalOpen">
        <DialogContent class="border border-border bg-background shadow-xl sm:max-w-[26rem]">
          <DialogHeader>
            <DialogTitle class="text-right text-xl font-bold text-foreground-heading">
              حذف المرفق
            </DialogTitle>
            <DialogDescription class="text-right text-foreground-muted">
              هذا الإجراء لا يمكن التراجع عنه
            </DialogDescription>
          </DialogHeader>
          <div class="py-6">
            <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div class="flex items-start gap-3">
                <div class="rounded-full bg-destructive/10 p-2">
                  <Icon icon="lucide:alert-triangle" class="h-5 w-5 text-destructive" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-foreground-heading"> هل أنت متأكد من حذف المرفق؟ </p>
                  <p class="mt-1 text-sm text-foreground-muted">
                    سيتم حذف المرفق "{{ selectedAttachment?.title }}" نهائياً من النظام.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="cancelDelete" :disabled="isDeleting"> إلغاء </Button>
            <Button variant="destructive" @click="confirmDelete" :disabled="isDeleting">
              <Icon v-if="isDeleting" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
              حذف المرفق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Attachment Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="border border-border bg-background shadow-xl sm:max-w-[36rem]">
          <DialogHeader>
            <DialogTitle class="text-right text-xl font-bold text-foreground-heading">
              تفاصيل المرفق
            </DialogTitle>
            <DialogDescription class="text-right text-foreground-muted">
              معلومات المرفق الكاملة والتفصيلية
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-y-6 py-6">
            <div
              v-for="(field, index) in attachmentDetailsFields"
              :key="index"
              class="grid grid-cols-[7.5rem_1fr] items-center gap-6 rounded-lg border border-border bg-background-surface/50 p-4"
            >
              <span class="text-right font-medium text-foreground-muted">{{ field.label }}</span>
              <div v-if="field.key === 'fileType'" class="flex items-center gap-3">
                <div :class="getFileTypeContainerClass(selectedAttachment?.fileType)">
                  <Icon
                    :icon="selectedAttachment?.fileType?.icon"
                    :class="getFileTypeIconClass(selectedAttachment?.fileType)"
                  />
                </div>
                <span class="font-medium text-foreground-body">{{
                  selectedAttachment?.fileType?.type
                }}</span>
              </div>
              <Badge
                v-else-if="field.key === 'projectName'"
                class="w-fit border-0 bg-accent font-medium text-accent-foreground shadow-sm"
              >
                {{ selectedAttachment?.projectName || 'غير محدد' }}
              </Badge>
              <span v-else class="font-medium text-foreground-body">
                {{ selectedAttachment?.[field.key] }}
              </span>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="showDetailsDialog = false"> إغلاق </Button>
            <Button @click="downloadAttachment(selectedAttachment)" class="gap-2">
              <Icon icon="tabler:download" class="h-4 w-4" />
              تحميل المرفق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import AttachmentEditModal from '@/components/AttachmentEditModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Toaster } from '@/components/ui/sonner';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance, { API_CONFIG, fileUploadInstance } from '@/plugins/axios';
  import { useAttachmentsStore } from '@/stores/attachments-store';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { toast } from 'vue-sonner';

  // Store
  const attachmentsStore = useAttachmentsStore();

  // Local reactive state
  const projects = ref([]);
  const isEditModalOpen = ref(false);
  const selectedAttachment = ref(null);
  const isDeleteModalOpen = ref(false);
  const showDetailsDialog = ref(false);
  const tableRef = ref();

  // Store-based computed properties
  const attachments = computed(() => attachmentsStore.getAllAttachments);
  const isLoading = computed(() => attachmentsStore.isLoading);
  const selectedProject = computed({
    get: () => attachmentsStore.getSelectedProjectId,
    set: (value) => attachmentsStore.setSelectedProjectId(value),
  });
  const isDeleting = computed(() => attachmentsStore.isLoading);
  const attachmentsCount = computed(() => attachments.value.length);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/api/Project');
      projects.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchAttachments = async (projectId = null) => {
    try {
      await attachmentsStore.fetchAttachments(projectId);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast('خطأ في جلب المرفقات', {
        description: 'حدث خطأ أثناء محاولة جلب المرفقات',
        type: 'error',
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.value.find((p) => p.id.toString() === projectId?.toString());
    return project ? project.name : '';
  };

  onMounted(async () => {
    await Promise.all([fetchProjects(), fetchAttachments()]);
    selectedProject.value = 'all';
  });

  const getFileTypeInfo = (filename) => {
    if (!filename) return { type: 'unknown', color: 'gray', icon: 'lucide:file' };

    const extension = filename.split('.').pop()?.toLowerCase();

    const typeMap = {
      // Images
      jpg: { type: 'صورة', color: 'emerald', icon: 'hugeicons:ai-image' },
      jpeg: { type: 'صورة', color: 'emerald', icon: 'hugeicons:ai-image' },
      png: { type: 'صورة', color: 'emerald', icon: 'hugeicons:ai-image' },
      gif: { type: 'صورة', color: 'emerald', icon: 'hugeicons:ai-image' },
      svg: { type: 'صورة', color: 'emerald', icon: 'hugeicons:ai-image' },

      // Documents
      pdf: { type: 'PDF', color: 'red', icon: 'fluent:document-pdf-20-regular' },
      doc: { type: 'مستند', color: 'blue', icon: 'hugeicons:doc-02' },
      docx: { type: 'مستند', color: 'blue', icon: 'hugeicons:doc-02' },
      txt: { type: 'نص', color: 'gray', icon: 'hugeicons:txt-02' },
      ppt: { type: 'عرض', color: 'blue', icon: 'icon-park-solid:ppt' },
      pptx: { type: 'عرض', color: 'blue', icon: 'icon-park-solid:ppt' },

      // Spreadsheets
      xls: { type: 'جدول بيانات', color: 'green', icon: 'uiw:file-excel' },
      xlsx: { type: 'جدول بيانات', color: 'green', icon: 'uiw:file-excel' },
      csv: { type: 'جدول بيانات', color: 'green', icon: 'uiw:file-excel' },

      // Archives
      zip: { type: 'ملف مضغوط', color: 'yellow', icon: 'ic:twotone-folder-zip' },
      rar: { type: 'ملف مضغوط', color: 'yellow', icon: 'ic:twotone-folder-zip' },
      '7z': { type: 'ملف مضغوط', color: 'yellow', icon: 'ic:twotone-folder-zip' },

      // Code
      js: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      ts: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      html: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      css: { type: 'كود', color: 'amber', icon: 'lucide:code' },

      // Video
      mp4: { type: 'فيديو', color: 'purple', icon: 'iconamoon:file-video' },
      mov: { type: 'فيديو', color: 'purple', icon: 'iconamoon:file-video' },
      avi: { type: 'فيديو', color: 'purple', icon: 'iconamoon:file-video' },

      // Audio
      mp3: { type: 'صوت', color: 'pink', icon: 'cil:audio-spectrum' },
      wav: { type: 'صوت', color: 'pink', icon: 'cil:audio-spectrum' },
      ogg: { type: 'صوت', color: 'pink', icon: 'cil:audio-spectrum' },
    };

    return typeMap[extension] || { type: 'ملف', color: 'gray', icon: 'lucide:file' };
  };

  // Update table columns configuration
  const tableColumns = [
    {
      key: 'fileType',
      label: 'النوع',
      type: 'custom',
      width: '8rem',
    },
    {
      key: 'title',
      label: 'المرفق',
      type: 'custom',
      width: '20rem',
    },
    {
      key: 'projectName',
      label: 'المشروع',
      type: 'custom',
      width: '12rem',
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإضافة',
      type: 'custom',
      width: '10rem',
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      type: 'custom',
      width: '8rem',
    },
  ];

  // Update transformed attachments to include file type info
  const transformedAttachments = computed(() => {
    const transformed = attachments.value.map((attachment) => {
      const fileInfo = getFileTypeInfo(attachment.url);
      return {
        ...attachment,
        projectName: getProjectName(attachment.projectId),
        createdAt: formatDate(attachment.createdAt),
        fileType: fileInfo,
      };
    });
    return transformed;
  });

  // Add these computed helpers for file type styling
  const getFileTypeContainerClass = (fileType) => {
    const baseClasses = 'flex h-8 w-8 items-center justify-center rounded-lg';
    const colorClasses = {
      emerald: 'bg-emerald-50 dark:bg-emerald-500/10',
      red: 'bg-red-50 dark:bg-red-500/10',
      blue: 'bg-blue-50 dark:bg-blue-500/10',
      gray: 'bg-gray-50 dark:bg-gray-500/10',
      green: 'bg-green-50 dark:bg-green-500/10',
      yellow: 'bg-yellow-50 dark:bg-yellow-500/10',
      amber: 'bg-amber-50 dark:bg-amber-500/10',
      purple: 'bg-purple-50 dark:bg-purple-500/10',
      pink: 'bg-pink-50 dark:bg-pink-500/10',
    };

    return `${baseClasses} ${colorClasses[fileType?.color] || colorClasses.gray}`;
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
      amber: 'text-amber-500 dark:text-amber-400',
      purple: 'text-purple-500 dark:text-purple-400',
      pink: 'text-pink-500 dark:text-pink-400',
    };

    return `${baseClasses} ${colorClasses[fileType?.color] || colorClasses.gray}`;
  };

  const handleEdit = (attachment) => {
    selectedAttachment.value = {
      ...attachment,
      projectName: getProjectName(attachment.projectId),
    };
    isEditModalOpen.value = true;
  };

  const handleDelete = (attachment) => {
    selectedAttachment.value = attachment;
    isDeleteModalOpen.value = true;
  };

  const confirmDelete = async () => {
    try {
      await attachmentsStore.deleteAttachment(selectedAttachment.value.id);
      toast('تم حذف المرفق', {
        description: `تم حذف المرفق "${selectedAttachment.value.title}" بنجاح`,
        type: 'success',
      });
      isDeleteModalOpen.value = false;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast('خطأ في حذف المرفق', {
        description: 'حدث خطأ أثناء محاولة حذف المرفق',
        type: 'error',
      });
    } finally {
      selectedAttachment.value = null;
    }
  };

  const cancelDelete = () => {
    isDeleteModalOpen.value = false;
    selectedAttachment.value = null;
  };

  const handleSaveEdit = async (formData) => {
    try {
      let requestData;

      if (formData.file) {
        // If there's a new file, upload it first
        const fileFormData = new FormData();
        fileFormData.append('file', formData.file);

        const uploadResponse = await fileUploadInstance.post(API_CONFIG.FILE_URL, fileFormData);

        requestData = {
          id: selectedAttachment.value.id,
          title: formData.title,
          description: formData.description,
          projectId: selectedAttachment.value.projectId,
          url: uploadResponse.data.url,
        };
      } else {
        // If no new file, just update the metadata
        requestData = {
          id: selectedAttachment.value.id,
          title: formData.title,
          description: formData.description,
          projectId: selectedAttachment.value.projectId,
          url: selectedAttachment.value.url,
        };
      }

      await attachmentsStore.updateAttachment(selectedAttachment.value.id, requestData);

      isEditModalOpen.value = false;
      toast('تم تعديل المرفق', {
        description: `تم تعديل المرفق "${formData.title}" بنجاح`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating attachment:', error);
      toast('خطأ في تعديل المرفق', {
        description: 'حدث خطأ أثناء محاولة تعديل المرفق',
        type: 'error',
      });
    }
  };

  const tableFilters = computed(() => {
    const filters = [
      {
        key: 'projectId',
        placeholder: 'اختر المشروع',
        options: [
          { value: 'all', label: 'الكل' },
          ...projects.value.map((project) => ({
            value: project.id.toString(),
            label: project.name,
          })),
        ],
        icon: 'lucide:folder',
        triggerClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
      },
    ];
    return filters;
  });

  const exportToExcel = () => {
    const headerLabels = ['النوع', 'عنوان المرفق', 'الوصف', 'المشروع', 'تاريخ الإضافة'];
    const formattedData = transformedAttachments.value.map((attachment) => ({
      النوع: attachment.fileType.type,
      'عنوان المرفق': attachment.title,
      الوصف: attachment.description || '',
      المشروع: attachment.projectName || '',
      'تاريخ الإضافة': attachment.createdAt,
    }));

    if (tableRef.value?.exportToExcel) {
      tableRef.value.exportToExcel(formattedData, headerLabels, 'المرفقات');
    }
  };

  const handleActionClick = (action, item) => {
    if (action === 'view') {
      selectedAttachment.value = {
        ...item,
        fileType: getFileTypeInfo(item.url),
      };
      showDetailsDialog.value = true;
    }
  };

  const downloadAttachment = (item) => {
    if (item?.url) {
      window.open(item.url, '_blank');
    }
  };

  const attachmentDetailsFields = [
    { key: 'title', label: 'عنوان المرفق' },
    { key: 'description', label: 'الوصف' },
    { key: 'fileType', label: 'النوع' },
    { key: 'projectName', label: 'المشروع' },
    { key: 'createdAt', label: 'تاريخ الإضافة' },
  ];
</script>
