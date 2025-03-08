<template>
  <div class="space-y-6">
    <div class="grid gap-4" :class="useDetailedCard ? 'grid-cols-1' : 'grid-cols-4'">
      <component
        :is="useDetailedCard ? DetailedProjectCard : ProjectCard"
        v-for="project in paginatedProjects"
        :key="project.id"
        v-bind="{
          ...project,
          duration: '12',
        }"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-center">
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
  import ProjectCard from './ProjectCard.vue';
  import DetailedProjectCard from './DetailedProjectCard.vue';
  import CustomPagination from './CustomPagination.vue';
  import { useRoute } from 'vue-router';
  import { computed, ref, onMounted, watch } from 'vue';
  import projectUtils from '@/utils/projectUtils';

  const props = defineProps({
    projects: {
      type: Array,
      default: () => []
    }
  });

  const route = useRoute();
  const useDetailedCard = computed(() => route.path === '/projects');

  // Pagination logic
  const currentPage = ref(1);
  const itemsPerPage = 8;

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return props.projects.slice(start, end);
  });

  const projectsData = ref([]);

  // Transform projects safely
  const getProjectData = () => {
    if (!Array.isArray(props.projects)) {
      console.warn('Projects is not an array:', props.projects);
      return [];
    }
    
    return props.projects.map(project => {
      try {
        const transformedProject = projectUtils.transformProject(project);
        return transformedProject || null;
      } catch (error) {
        console.error('Error transforming project:', error, project);
        // Return a minimal valid object to prevent UI errors
        return {
          id: project?.id?.toString() || 'error',
          title: project?.name || 'Error loading project',
          department: '',
          status: 'خطأ',
          statusVariant: 'danger',
          progress: 0,
          duration: '0',
          startDate: '',
          endDate: '',
        };
      }
    }).filter(project => project !== null);
  };

  // Update projects data when props change
  watch(() => props.projects, () => {
    projectsData.value = getProjectData();
  }, { immediate: true });

  onMounted(() => {
    projectsData.value = getProjectData();
  });
</script>
