<template>
  <div class="space-y-6">
    <div class="grid grid-cols-4 gap-4">
      <GenericProjectCard
        v-for="project in paginatedProjects"
        :key="project.id"
        :project="project"
        :disabled="false"
      />
    </div>

    <!-- Empty State -->
    <!-- <div
      v-if="!projects.length"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div
        class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
      >
        <Icon icon="lucide:folder" class="h-10 w-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">لا توجد مشاريع</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        لم يتم العثور على أي مشاريع تطابق معايير البحث الخاصة بك
      </p>
    </div> -->

    <!-- Pagination -->
    <div v-if="projects.length > 0" class="mt-6 flex items-center justify-center">
      <CustomPagination
        v-model="currentPage"
        :total="projects.length"
        :per-page="itemsPerPage"
        class="text-gray-600 dark:text-gray-300"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import CustomPagination from './CustomPagination.vue';
  import GenericProjectCard from './GenericProjectCard.vue';

  const props = defineProps({
    projects: {
      type: Array,
      required: true,
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
  const itemsPerPage = 9; // Changed to 9 for better grid layout (3x3)

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
