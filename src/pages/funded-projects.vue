<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-7xl space-y-8">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-blue-500/10 p-3 dark:bg-blue-500/20">
                <Icon icon="lucide:folders" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ projects.length }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي المشاريع</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-green-500/10 p-3 dark:bg-green-500/20">
                <Icon icon="lucide:target" class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ getTotalComponents() }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي المكونات</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-purple-500/10 p-3 dark:bg-purple-500/20">
                <Icon
                  icon="lucide:list-todo"
                  class="h-6 w-6 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ getTotalActivitiesAll() }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي الفعاليات</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20">
                <Icon
                  icon="lucide:dollar-sign"
                  class="h-6 w-6 text-amber-600 dark:text-amber-400"
                />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${{ formatTotalCost() }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">اجمالي التمويل</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="border-b p-6 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">المشاريع الممولة</h1>
                <Badge variant="outline" class="px-3">{{ projects.length }} مشروع</Badge>
              </div>
              <div class="flex flex-row items-center gap-6">
                <PrimaryButton class="cursor-not-allowed">
                  <Icon icon="lucide:lock" />
                  طباعة
                </PrimaryButton>
                <RouterLink to="/add-funded-project">
                  <Button
                    class="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
                  >
                    <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                    اضافة مشروع جديد
                  </Button>
                </RouterLink>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="!isLoading" class="grid grid-cols-1 gap-6">
              <FundedProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
                @attachment-added="fetchProjects"
              />
            </div>
            <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="n in 6"
                :key="n"
                class="h-[280px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div
              v-if="!isLoading && projects.length === 0"
              class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
            >
              <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Icon icon="lucide:folder-open" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100"
                >لا توجد مشاريع</h3
              >
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400"
                >قم بإضافة مشروع جديد للبدء</p
              >
              <RouterLink to="/add-funded-project">
                <Button variant="outline" size="sm">
                  <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                  اضافة مشروع
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
  import FundedProjectCard from '@/components/FundedProjectCard.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Badge } from '@/components/ui/badge';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  const projects = ref([]);
  const isLoading = ref(true);
  const router = useRouter();
  const fetchProjects = async () => {
    try {
      isLoading.value = true;
      const response = await axiosInstance.get('/Project');
      projects.value = response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      isLoading.value = false;
    }
  };
  onMounted(async () => {
    await fetchProjects();
  });
  const viewProject = (projectId) => {
    router.push({
      name: 'funded-projects-details',
      params: { id: projectId },
    });
  };
  const getTotalComponents = () => {
    return projects.value.reduce((total, project) => total + (project.components?.length || 0), 0);
  };
  const getTotalActivitiesAll = () => {
    return projects.value.reduce((total, project) => total + getTotalActivities(project), 0);
  };
  const getTotalActivities = (project) => {
    return (
      project.components?.reduce((total, comp) => total + (comp.activities?.length || 0), 0) || 0
    );
  };
  const formatTotalCost = () => {
    const total = projects.value.reduce((sum, project) => sum + (project.cost || 0), 0);
    return formatCost(total);
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>
