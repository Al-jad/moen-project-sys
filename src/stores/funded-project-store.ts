import { fundedProjectService } from '@/services/funded-project';
import type {
  CreateFundedProjectRequest as APICreateFundedProjectRequest,
  UpdateFundedProjectRequest as APIUpdateFundedProjectRequest,
} from '@/types';
import type { TransformedFundedProject } from '@/types/funded-project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useFundedProjectStore = defineStore('funded-project', () => {
  // State
  const projects = ref<TransformedFundedProject[]>([]);
  const filteredProjects = ref<TransformedFundedProject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentProject = ref<TransformedFundedProject | null>(null);

  // Getters
  const totalProjects = computed(() => projects.value.length);
  const totalComponents = computed(() => {
    return projects.value.reduce((total, project) => {
      return total + (project.components?.length || 0);
    }, 0);
  });
  const totalActivities = computed(() => {
    return projects.value.reduce((total, project) => {
      return (
        total +
        project.components.reduce((sum, component) => {
          return sum + (component.activities?.length || 0);
        }, 0)
      );
    }, 0);
  });

  // Actions
  const fetchAllProjects = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fundedProjectService.getAllProjects();
      projects.value = response.data
        .map((project) => fundedProjectService.transformProject(project))
        .filter((p): p is TransformedFundedProject => p !== null);
      filteredProjects.value = [...projects.value];
    } catch (err) {
      error.value = 'Failed to fetch projects';
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectById = async (id: number | string) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fundedProjectService.getProjectById(id);
      const transformed = fundedProjectService.transformProject(response.data);
      if (transformed) {
        currentProject.value = transformed;
      }
      return transformed;
    } catch (err) {
      error.value = 'Failed to fetch project';
      console.error('Error fetching project:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (projectData: APICreateFundedProjectRequest) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fundedProjectService.createProject(projectData);
      const transformed = fundedProjectService.transformProject(response.data);
      if (transformed) {
        projects.value.push(transformed);
        filteredProjects.value = [...projects.value];
      }
      return transformed;
    } catch (err) {
      error.value = 'Failed to create project';
      console.error('Error creating project:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (id: number | string, projectData: APIUpdateFundedProjectRequest) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fundedProjectService.updateProject(id, {
        ...projectData,
        id: typeof id === 'string' ? parseInt(id) : id,
      });
      const transformed = fundedProjectService.transformProject(response.data);
      if (transformed) {
        const index = projects.value.findIndex((p) => p.id === id.toString());
        if (index !== -1) {
          projects.value[index] = transformed;
          filteredProjects.value = [...projects.value];
        }
      }
      return transformed;
    } catch (err) {
      error.value = 'Failed to update project';
      console.error('Error updating project:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (id: number | string) => {
    try {
      loading.value = true;
      error.value = null;
      await fundedProjectService.deleteProject(id);
      projects.value = projects.value.filter((p) => p.id !== id.toString());
      filteredProjects.value = [...projects.value];
      return true;
    } catch (err) {
      error.value = 'Failed to delete project';
      console.error('Error deleting project:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Filter functions
  const filterProjects = (filters: {
    search?: string;
    status?: number;
    minCost?: number;
    maxCost?: number;
    isGovernment?: boolean;
  }) => {
    filteredProjects.value = projects.value.filter((project) => {
      let matches = true;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        matches =
          matches &&
          (project.title.toLowerCase().includes(searchLower) ||
            project.department.toLowerCase().includes(searchLower) ||
            project.implementingEntity.toLowerCase().includes(searchLower));
      }

      if (typeof filters.status !== 'undefined') {
        matches = matches && project.status === filters.status.toString();
      }

      if (typeof filters.minCost !== 'undefined') {
        matches = matches && project.cost >= filters.minCost;
      }

      if (typeof filters.maxCost !== 'undefined') {
        matches = matches && project.cost <= filters.maxCost;
      }

      if (typeof filters.isGovernment !== 'undefined') {
        matches = matches && project.isGovernment === filters.isGovernment;
      }

      return matches;
    });
  };

  // Sort functions
  const sortProjects = (
    sortBy: 'cost' | 'progress' | 'duration',
    order: 'asc' | 'desc' = 'desc'
  ) => {
    filteredProjects.value.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'duration':
          comparison = Number(a.duration) - Number(b.duration);
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  };

  return {
    // State
    projects,
    filteredProjects,
    loading,
    error,
    currentProject,

    // Getters
    totalProjects,
    totalComponents,
    totalActivities,

    // Actions
    fetchAllProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    filterProjects,
    sortProjects,
  };
});
