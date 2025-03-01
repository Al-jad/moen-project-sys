<template>
  <DefaultLayout>
    <div
      class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 dark:bg-gray-900"
    >
      <div class="w-full max-w-lg space-y-6">
        <!-- Success Card -->
        <div
          class="overflow-hidden rounded-xl border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Header -->
          <div class="border-b p-6 text-center dark:border-gray-700">
            <div class="mb-4 flex justify-center">
              <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Icon
                  icon="lucide:check-circle"
                  class="h-8 w-8 text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              {{ title || 'تمت العملية بنجاح' }}
            </h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ message || 'تم حفظ البيانات بنجاح' }}
            </p>
          </div>

          <!-- Project Details -->
          <div v-if="projectDetails" class="divide-y dark:divide-gray-700">
            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <div
                    class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
                  >
                    {{ projectDetails.id }}
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">
                    {{ projectDetails.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ projectDetails.executingDepartment }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 divide-x dark:divide-gray-700">
              <div class="p-4 text-center">
                <div class="text-sm text-gray-500 dark:text-gray-400">المكونات</div>
                <div class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ projectDetails.components?.length || 0 }}
                </div>
              </div>
              <div class="p-4 text-center">
                <div class="text-sm text-gray-500 dark:text-gray-400">الفعاليات</div>
                <div class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ getTotalActivities(projectDetails) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-4 border-t p-4 dark:border-gray-700">
            <!-- Show single action button if coming from add project -->
            <div v-if="projectDetails?.id" class="w-full">
              <RouterLink :to="`/funded-projects/${projectDetails.id}`">
                <Button
                  class="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
                >
                  <Icon icon="lucide:eye" class="ml-2 h-4 w-4" />
                  عرض تفاصيل المشروع
                </Button>
              </RouterLink>
            </div>

            <!-- Show back button only if not coming from add project -->
            <div v-else class="w-full">
              <RouterLink to="/funded-projects">
                <Button variant="outline" class="w-full">
                  <Icon icon="lucide:arrow-right" class="ml-2 h-4 w-4" />
                  العودة للمشاريع
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
  import { Button } from '@/components/ui/button';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { RouterLink, useRoute } from 'vue-router';

  const route = useRoute();

  // Get props from router
  const title = route.params.title || route.query.title;
  const message = route.params.message || route.query.message;
  const projectDetails = route.params.projectDetails || route.query.projectDetails;

  const getTotalActivities = (project) => {
    if (!project?.components) return 0;
    return project.components.reduce((total, comp) => total + (comp.activities?.length || 0), 0);
  };
</script>
