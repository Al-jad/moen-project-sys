<template>
  <div class="space-y-6">
    <div class="grid grid-cols-4 gap-4">
      <template v-if="loading">
        <div
          v-for="i in itemsPerPage"
          :key="i"
          class="animate-pulse rounded-xl border border-border bg-background-card p-6"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="h-8 w-8 rounded-lg bg-border"></div>
            <div class="h-6 w-24 rounded-full bg-border"></div>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="h-6 w-3/4 rounded bg-border"></div>
              <div class="h-4 w-1/2 rounded bg-border"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="h-3 w-24 rounded bg-border"></div>
              <div class="h-8 w-8 rounded-full bg-border"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <GenericProjectCard
          v-for="project in paginatedProjects"
          :key="project.id"
          :project="project"
          :disabled="false"
        />
      </template>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !projects.length"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background-card p-12 text-center"
    >
      <div
        class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-background-hover"
      >
        <Icon icon="lucide:folder" class="h-10 w-10 text-foreground-muted" />
      </div>
      <h3 class="mt-4 text-lg font-medium text-foreground-heading">لا توجد مشاريع</h3>
      <p class="mt-1 text-sm text-foreground-muted">
        لم يتم العثور على أي مشاريع تطابق معايير البحث الخاصة بك
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && projects.length > 0" class="mt-6 flex items-center justify-center">
      <CustomPagination
        v-model="currentPage"
        :total="projects.length"
        :per-page="itemsPerPage"
        class="text-foreground-muted"
      />
    </div>
  </div>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import CustomPagination from './CustomPagination.vue';
  import GenericProjectCard from './GenericProjectCard.vue';

  const props = defineProps({
    projects: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    fundingFilter: {
      type: Function,
      default: () => true,
    },
  });

  const route = useRoute();
  const useDetailedCard = computed(() => route.path === '/projects');

  // Pagination logic
  const currentPage = ref(1);
  const itemsPerPage = 8; // Changed to 8 for better grid layout (2x4)

  const filteredProjects = computed(() => {
    return props.projects.filter((project) => props.fundingFilter(project));
  });

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProjects.value.slice(start, end);
  });

  // Watch for projects changes to reset pagination
  watch([() => props.projects.length, () => filteredProjects.value.length], () => {
    currentPage.value = 1;
  });

  // Simple function to process project data if needed
  function getProjectData(project) {
    // Return the project as is for now
    return project;
  }

  // No need to process projects on mount since we're just displaying them as is
  // If you need to process them later, you can uncomment this
  /*
onMounted(() => {
  props.projects.forEach(getProjectData);
});
*/
</script>
