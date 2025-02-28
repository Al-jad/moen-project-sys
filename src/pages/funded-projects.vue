<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-7xl space-y-8">
        <!-- Stats Overview -->
        <div class="grid gap-4 md:grid-cols-4">
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-blue-500/10 p-3 dark:bg-blue-500/20">
                <Folders class="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                <Target class="h-6 w-6 text-green-600 dark:text-green-400" />
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
                <ListTodo class="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                <DollarSign class="h-6 w-6 text-amber-600 dark:text-amber-400" />
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

        <!-- Projects Section -->
        <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="border-b p-6 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">المشاريع الممولة</h1>
                <Badge variant="outline" class="px-3">{{ projects.length }} مشروع</Badge>
              </div>
              <RouterLink to="/add-funded-project">
                <Button
                  class="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
                >
                  <Plus class="ml-2 h-4 w-4" />
                  اضافة مشروع جديد
                </Button>
              </RouterLink>
            </div>
          </div>

          <div class="p-6">
            <!-- Projects Grid -->
            <div v-if="!isLoading" class="grid grid-cols-1 gap-6">
              <div
                v-for="project in projects"
                :key="project.id"
                class="group relative overflow-hidden rounded-lg border bg-gray-50/50 transition-all hover:border-blue-500/20 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
              >
                <!-- Project Header -->
                <div class="relative border-b p-4 dark:border-gray-700">
                  <div class="mb-3 flex items-center gap-3">
                    <div class="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                      <div
                        class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
                      >
                        {{ project.id }}
                      </div>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">{{
                        project.name
                      }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ project.executingDepartment }}
                      </p>
                    </div>
                  </div>
                  <Badge
                    :class="[
                      project.fundingType === 1
                        ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
                    ]"
                    variant="secondary"
                  >
                    {{ project.fundingType === 1 ? 'ممول' : 'غير ممول' }}
                  </Badge>
                </div>

                <!-- Project Stats -->
                <div class="space-y-4 p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="rounded-lg bg-gray-100/80 p-3 dark:bg-gray-700/50">
                      <div class="text-sm text-gray-500 dark:text-gray-400">المكونات</div>
                      <div class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {{ project.components?.length || 0 }}
                      </div>
                    </div>
                    <div class="rounded-lg bg-gray-100/80 p-3 dark:bg-gray-700/50">
                      <div class="text-sm text-gray-500 dark:text-gray-400">الفعاليات</div>
                      <div class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {{ getTotalActivities(project) }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="flex items-center justify-between rounded-lg bg-gray-100/80 p-3 dark:bg-gray-700/50"
                  >
                    <div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">التكلفة</div>
                      <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${{ formatCost(project.cost) }}
                      </div>
                    </div>
                    <div class="text-left">
                      <div class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</div>
                      <div class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ formatDate(project.actualStartDate) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hover Actions -->
                <div
                  class="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 border-t bg-white/80 p-3 opacity-0 backdrop-blur transition-all group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800/80"
                >
                  <Button
                    variant="ghost"
                    @click="viewProject(project.id)"
                    size="sm"
                    class="h-8 w-8 p-0"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:text-red-400"
                  >
                    <Trash class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="n in 6"
                :key="n"
                class="h-[280px] animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <!-- Empty State -->
            <div
              v-if="!isLoading && projects.length === 0"
              class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
            >
              <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <FolderOpen class="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100"
                >لا توجد مشاريع</h3
              >
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400"
                >قم بإضافة مشروع جديد للبدء</p
              >
              <RouterLink to="/add-funded-project">
                <Button variant="outline" size="sm">
                  <Plus class="ml-2 h-4 w-4" />
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
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import {
    DollarSign,
    Edit,
    Eye,
    FolderOpen,
    Folders,
    ListTodo,
    Plus,
    Target,
    Trash,
  } from 'lucide-vue-next';
  import { onMounted, ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';

  const projects = ref([]);
  const isLoading = ref(true);
  const router = useRouter();

  const viewProject = (projectId) => {
    router.push({
      name: 'funded-projects-details',
      params: { id: projectId },
    });
  };

  onMounted(async () => {
    try {
      const response = await axiosInstance.get('/Project');
      projects.value = response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      isLoading.value = false;
    }
  });

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
