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
            <div class="w-1/4">
              <CustomSelect
                v-model="selectedProject"
                :options="projectOptions"
                placeholder="اختر المشروع"
                icon="lucide:folder"
                trigger-class="flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                @update:model-value="handleProjectChange"
              />
            </div>
          </div>
          <div
            v-if="selectedProject !== 'all' && !isLoading"
            class="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
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
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="h-[200px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800/50"
          />
        </div>
        <div v-else>
          <div
            v-if="filteredAttachments.length > 0"
            class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <DocumentCard
              v-for="attachment in paginatedAttachments"
              :key="attachment.id"
              :title="attachment.title"
              :description="attachment.description"
              :date="formatDate(attachment.createdAt)"
              :url="attachment.url"
              :project-name="selectedProject === 'all' ? getProjectName(attachment.projectId) : ''"
              class="dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
            />
          </div>
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
          <div
            v-if="filteredAttachments.length > itemsPerPage"
            class="mt-6 flex items-center justify-center"
          >
            <Pagination
              v-model="currentPage"
              :total="filteredAttachments.length"
              :per-page="itemsPerPage"
            />
          </div>
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import Pagination from '@/components/CustomPagination.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
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
</script>
