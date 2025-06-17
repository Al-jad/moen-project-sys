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

          <!-- Actions -->
          <div class="flex items-center justify-between gap-4 border-t p-4 dark:border-gray-700">
            <!-- Show project details button if project info exists -->
            <div v-if="projectDetails?.id" class="w-full">
              <RouterLink :to="getProjectDetailsRoute">
                <PrimaryButton variant="primary" icon="lucide:eye">
                  عرض تفاصيل المشروع
                </PrimaryButton>
              </RouterLink>
            </div>

            <div class="w-full">
              <RouterLink :to="getProjectsListRoute">
                <PrimaryButton variant="outline" class="w-full" icon="lucide:arrow-right">
                  العودة للمشاريع
                </PrimaryButton>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  import { RouterLink, useRoute } from 'vue-router';

  const route = useRoute();

  // Get props from router
  const title = route.params.title || route.query.title;
  const message = route.params.message || route.query.message;
  const projectDetails = computed(() => {
    const details = route.query.projectDetails;
    if (typeof details === 'string') {
      try {
        return JSON.parse(details);
      } catch (e) {
        console.error('Error parsing project details:', e);
        return null;
      }
    }
    return null;
  });

  // Determine project type and generate appropriate routes
  const projectType = computed(() => {
    const referrer = route.query.from as string;
    if (referrer?.includes('funded')) return 'funded';
    if (referrer?.includes('devlopment') || referrer?.includes('regional')) return 'regional';
    return 'funded'; // Default to funded if no type specified
  });

  const getProjectDetailsRoute = computed(() => {
    if (!projectDetails.value?.id) return '/';
    return projectType.value === 'funded'
      ? `/funded-projects/${projectDetails.value.id}`
      : `/regional-projects/${projectDetails.value.id}`;
  });

  const getProjectsListRoute = computed(() => {
    return projectType.value === 'funded' ? '/funded-projects' : '/regional-projects';
  });
</script>
