<template>
  <DefaultLayout>
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
            </div>
            <div class="flex w-full max-w-xs items-center">
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
          <div
            v-if="selectedProject !== 'all' && !isLoading"
            class="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div
              class="flex items-center gap-4 border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10"
              >
                <Icon icon="lucide:folder-open" class="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{
                  getProjectName(selectedProject)
                }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ attachments.length }} مرفق{{ attachments.length !== 1 ? 'ات' : '' }}
                </p>
              </div>
              <button
                @click="selectedProject = 'all'"
                class="mr-auto flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
                عرض الكل
              </button>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
          ></div>
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
              <a
                :href="item.url"
                target="_blank"
                class="inline-flex items-center gap-1 text-nowrap text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Icon icon="lucide:external-link" class="h-4 w-4" />
                عرض الملف
              </a>
            </template>
          </CustomTable>

          <div
            v-else
            class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
          >
            <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Icon icon="lucide:file" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">
              لا توجد مرفقات
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                selectedProject === 'all' ? 'لا توجد مرفقات متاحة' : 'لا توجد مرفقات لهذا المشروع'
              }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';

  const selectedProject = ref('all');
  const attachments = ref([]);
  const isLoading = ref(true);
  const projects = ref([]);
  const itemsPerPage = 8;
  const currentPage = ref(1);
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
    const options = [{ value: 'all', label: 'الكل' }];
    return options.concat(
      projects.value.map((project) => ({
        value: project.id.toString(),
        label: project.name,
      }))
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
</script>
