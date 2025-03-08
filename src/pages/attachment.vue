<template>
  <DefaultLayout>
    <Toaster position="bottom-left" />
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="rounded-lg bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <BackToMainButton />
              <div>
                <h1 class="text-2xl font-semibold dark:text-white"
                  >المرفقات ({{ attachments.length }})</h1
                >
              </div>
              <input
                type="text"
                class="block w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-10 text-right text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="البحث عن مرفق..."
              />
            </div>
            <div class="w-full sm:w-48">
              <CustomSelect
                v-model="selectedProject"
                :options="projectOptions"
                placeholder="اختر المشروع"
                icon="lucide:folder"
                trigger-class="w-full flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                @update:model-value="handleProjectChange"
              />
            </div>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل المرفقات...</p>
          </div>
        </div>

        <div
          v-if="selectedProject !== 'all' && !isLoading"
          class="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ getProjectName(selectedProject) }}
            </h3>
            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {{ filteredAttachments.length }} مرفق
            </span>
          </div>
        </div>

        <div v-else>
          <CustomTable
            v-if="filteredAttachments.length > 0"
            :columns="tableColumns"
            :data="transformedAttachments"
            :items-per-page="itemsPerPage"
            :show-export="false"
            :show-date-filter="true"
            :filters="[]"
          >
            <template #fileType="{ item }">
              <div class="flex items-center gap-2">
                <div :class="getFileTypeContainerClass(item.fileType)">
                  <Icon :icon="item.fileType.icon" :class="getFileTypeIconClass(item.fileType)" />
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
                  @click="handleEdit(item)"
                  class="inline-flex items-center gap-1 text-nowrap text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Icon icon="lucide:edit" class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(item)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 text-nowrap text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Icon icon="lucide:trash" class="h-4 w-4" />
                </button>
              </div>
            </template>
          </CustomTable>

          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
          >
            <Icon
              icon="lucide:file"
              class="mb-2 h-12 w-12 text-gray-300 dark:text-gray-600"
            />
            <h3 class="mb-1 text-lg font-medium text-gray-900 dark:text-white">
              لا توجد مرفقات
            </h3>
            <p class="max-w-sm text-sm text-gray-500 dark:text-gray-400">
              لم يتم العثور على أي مرفقات للمشروع المحدد.
            </p>
          </div>
        </div>

        <div v-if="filteredAttachments.length > itemsPerPage" class="mt-6 flex justify-center">
          <Pagination
            v-model="currentPage"
            :total="filteredAttachments.length"
            :per-page="itemsPerPage"
          />
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

      <DeleteModal
        v-model:open="isDeleteModalOpen"
        :loading="isDeleting"
        title="حذف المرفق"
        description="تأكيد حذف المرفق"
        :message="
          selectedAttachment?.title
            ? 'هل أنت متأكد من حذف المرفق ' + selectedAttachment.title + '؟'
            : ''
        "
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </main>
  </DefaultLayout>
</template>

<script setup>
  import AttachmentEditModal from '@/components/AttachmentEditModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import { Toaster } from '@/components/ui/sonner';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import projectService from '@/services/projectService';
  import projectUtils from '@/utils/projectUtils';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';
  import { toast } from 'vue-sonner';

  const selectedProject = ref('all');
  const attachments = ref([]);
  const isLoading = ref(true);
  const projects = ref([]);
  const itemsPerPage = 8;
  const currentPage = ref(1);
  const isEditModalOpen = ref(false);
  const selectedAttachment = ref(null);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/Project');
      projects.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const fetchAttachments = async (projectId = null) => {
    try {
      isLoading.value = true;
      let url = '/Attachment';
      if (projectId && projectId !== 'all') {
        url = `/Attachment?projectId=${projectId}`;
      }
      const response = await axiosInstance.get(url);
      attachments.value = response.data;
    } catch (error) {
      console.error('Error fetching attachments:', error);
    } finally {
      isLoading.value = false;
    }
  };
  const projectOptions = computed(() => {
  
  const fetchProjects = function() {
    isLoading.value = true;
    
    projectService.getAllProjects()
      .then(function(response) {
        const apiProjects = response.data;
        
        if (Array.isArray(apiProjects)) {
          projects.value = apiProjects.map(function(project) {
            return {
              id: project.id,
              name: project.name
            };
          });
          
          // Extract all attachments from all projects
          const allAttachments = [];
          apiProjects.forEach(function(project) {
            if (Array.isArray(project.attachments)) {
              project.attachments.forEach(function(attachment) {
                allAttachments.push({
                  id: attachment.id,
                  title: attachment.title || 'Untitled',
                  description: attachment.description || '',
                  url: attachment.url || '',
                  createdAt: attachment.createdAt,
                  projectId: project.id
                });
              });
            }
          });
          
          attachments.value = allAttachments;
        }
        
        isLoading.value = false;
      })
      .catch(function(err) {
        console.error('Error fetching projects:', err);
        isLoading.value = false;
      });
  };
  
  const getProjectName = function(projectId) {
    const project = projects.value.find(function(p) { return p.id === projectId; });
    return project ? project.name : '';
  };
  
  const formatDate = function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  const filteredAttachments = computed(function() {
    if (selectedProject.value === 'all') {
      return attachments.value;
    }
    return attachments.value.filter(function(attachment) {
      return attachment.projectId === selectedProject.value;
    });
  });
  
  const paginatedAttachments = computed(function() {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAttachments.value.slice(startIndex, endIndex);
  });
  
  const projectOptions = computed(function() {
    const options = [{ value: 'all', label: 'الكل' }];
    return options.concat(
      projects.value?.map((project) => ({
        value: project.id.toString(),
        label: project.name,
      })) || []
    );
  });
  const filteredAttachments = computed(() => {
    return attachments.value;
  });
  const paginatedAttachments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAttachments.value.slice(start, end);
  });
  const handleProjectChange = () => {
    currentPage.value = 1;
    fetchAttachments(selectedProject.value);
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

      // Code
      js: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      ts: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      html: { type: 'كود', color: 'amber', icon: 'lucide:code' },
      css: { type: 'كود', color: 'amber', icon: 'lucide:code' },

      // Video
      mp4: { type: 'فيديو', color: 'purple', icon: 'lucide:video' },
      mov: { type: 'فيديو', color: 'purple', icon: 'lucide:video' },
      avi: { type: 'فيديو', color: 'purple', icon: 'lucide:video' },

      // Audio
      mp3: { type: 'صوت', color: 'pink', icon: 'lucide:music' },
      wav: { type: 'صوت', color: 'pink', icon: 'lucide:music' },
      ogg: { type: 'صوت', color: 'pink', icon: 'lucide:music' },
    };

    return typeMap[extension] || { type: 'ملف', color: 'gray', icon: 'lucide:file' };
  };

  // Update table columns configuration
  const tableColumns = [
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
      key: 'projectName',
      label: 'المشروع',
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

  // Update transformed attachments to include file type info
  const transformedAttachments = computed(() => {
    return filteredAttachments.value.map((attachment) => {
      const fileInfo = getFileTypeInfo(attachment.url);
      return {
        ...attachment,
        projectName: getProjectName(attachment.projectId),
        createdAt: formatDate(attachment.createdAt),
        fileType: fileInfo,
      };
    });
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
      amber: 'text-amber-500 dark:text-amber-400',
      purple: 'text-purple-500 dark:text-purple-400',
      pink: 'text-pink-500 dark:text-pink-400',
    };

    return `${baseClasses} ${colorClasses[fileType.color] || colorClasses.gray}`;
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
      isDeleting.value = true;
      await axiosInstance.delete(`/Attachment/${selectedAttachment.value.id}`);
      toast('تم حذف المرفق', {
        description: `تم حذف المرفق "${selectedAttachment.value.title}" بنجاح`,
        type: 'success',
      });
      await fetchAttachments(selectedProject.value);
      isDeleteModalOpen.value = false;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast('خطأ في حذف المرفق', {
        description: 'حدث خطأ أثناء محاولة حذف المرفق',
        type: 'error',
      });
    } finally {
      isDeleting.value = false;
      selectedAttachment.value = null;
    }
  };

  const cancelDelete = () => {
    isDeleteModalOpen.value = false;
    selectedAttachment.value = null;
  };

  const handleSaveEdit = async (formData) => {
    try {
      isLoading.value = true;
      let requestData;

      if (formData.file) {
        // If there's a new file, upload it first
        const fileFormData = new FormData();
        fileFormData.append('file', formData.file);

        const uploadResponse = await axiosInstance.post(
          'https://encode.ibaity.com/uploads/raw',
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

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

      await axiosInstance.put(`/Attachment/${selectedAttachment.value.id}`, requestData);

      isEditModalOpen.value = false;
      await fetchAttachments(selectedProject.value);
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
    } finally {
      isLoading.value = false;
    }
  };
</script>
