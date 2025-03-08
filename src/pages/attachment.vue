<template>
  <DefaultLayout>
    <main class="flex-1 bg-gray-50 p-6 dark:bg-darkmode">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <BackToMainButton />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">المرفقات</h1>
          </div>
        </div>

        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-1 items-center gap-3">
            <div class="relative flex-1 sm:max-w-xs">
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Icon icon="lucide:search" class="h-5 w-5 text-gray-400" />
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
    </main>
  </DefaultLayout>
</template>
<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import Pagination from '@/components/CustomPagination.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import projectService from '@/services/projectService';
  import projectUtils from '@/utils/projectUtils';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const selectedProject = ref('all');
  const attachments = ref([]);
  const isLoading = ref(true);
  const projects = ref([]);
  const itemsPerPage = 8;
  const currentPage = ref(1);
  
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
  
  const handleProjectChange = function() {
    currentPage.value = 1;
  };
  
  onMounted(function() {
    fetchProjects();
  });
</script>
