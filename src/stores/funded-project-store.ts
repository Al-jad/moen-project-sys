import { fundedProjectService } from '@/services/fundedProjectService';
import type {
  CreateFundedProjectRequest as APICreateFundedProjectRequest,
  UpdateFundedProjectRequest as APIUpdateFundedProjectRequest,
  FundedProject,
} from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// Add interface for form state
export interface FormState {
  name: string;
  executingDepartment: string;
  implementingEntity: string;
  beneficiaryEntities: string[];
  grantingEntity: string;
  fundingType: number;
  cost: number | null;
  currency: number;
  projectObjectives: string;
  duration: number;
  periodType: number;
  durationType: string;
  actualStartDate: string | null;
  components: any[];
  latitude: number | string;
  longitude: number | string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  projectStatus: number;
  isGovernment: boolean;
  financialAchievement: number;
}

// Add interface for non-null project
interface NonNullProject
  extends Omit<
    FundedProject,
    'name' | 'executingDepartment' | 'implementingEntity' | 'grantingEntity' | 'cost'
  > {
  name: string;
  executingDepartment: string;
  implementingEntity: string;
  grantingEntity: string;
  cost: number;
}

export const useFundedProjectStore = defineStore('funded-project', () => {
  // State
  const projects = ref<NonNullProject[]>([]);
  const filteredProjects = ref<NonNullProject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentProject = ref<NonNullProject | null>(null);
  const isSaving = ref(false);
  const hasUnsavedChanges = ref(false);

  // Add form state with proper initialization
  const form = ref<FormState>({
    name: '',
    executingDepartment: '',
    implementingEntity: '',
    beneficiaryEntities: [],
    grantingEntity: '',
    fundingType: 1,
    cost: null,
    currency: 1,
    projectObjectives: '',
    duration: 0,
    periodType: 1,
    durationType: 'weeks',
    actualStartDate: null,
    components: [],
    latitude: '',
    longitude: '',
    isSaving: false,
    hasUnsavedChanges: false,
    projectStatus: 1,
    isGovernment: false,
    financialAchievement: 0,
  });

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
      projects.value = response.map((project) => ({
        ...project,
        name: project.name || '',
        executingDepartment: project.executingDepartment || '',
        implementingEntity: project.implementingEntity || '',
        grantingEntity: project.grantingEntity || '',
        cost: project.cost || 0,
      }));
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
      const response = await fundedProjectService.getProjectById(id.toString());
      const nonNullProject: NonNullProject = {
        ...response,
        name: response.name || '',
        executingDepartment: response.executingDepartment || '',
        implementingEntity: response.implementingEntity || '',
        grantingEntity: response.grantingEntity || '',
        cost: response.cost || 0,
      };
      currentProject.value = nonNullProject;
      return nonNullProject;
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

      // First create the project - no need for ID conversion
      const response = await fundedProjectService.createProject(projectData);

      // If project creation was successful and we have components, create them
      const nonNullProject: NonNullProject = {
        ...response,
        name: response.name || '',
        executingDepartment: response.executingDepartment || '',
        implementingEntity: response.implementingEntity || '',
        grantingEntity: response.grantingEntity || '',
        cost: response.cost || 0,
      };
      projects.value.push(nonNullProject);
      filteredProjects.value = [...projects.value];
      return nonNullProject;
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
      const nonNullProject: NonNullProject = {
        ...response,
        name: response.name || '',
        executingDepartment: response.executingDepartment || '',
        implementingEntity: response.implementingEntity || '',
        grantingEntity: response.grantingEntity || '',
        cost: response.cost || 0,
      };
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = nonNullProject;
        filteredProjects.value = [...projects.value];
      }
      return nonNullProject;
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
      projects.value = projects.value.filter((p) => p.id !== id);
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
          (project.name.toLowerCase().includes(searchLower) ||
            project.executingDepartment.toLowerCase().includes(searchLower) ||
            project.implementingEntity.toLowerCase().includes(searchLower));
      }

      if (typeof filters.status !== 'undefined') {
        matches = matches && project.projectStatus === filters.status;
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
    sortBy: 'cost' | 'financialAchievement' | 'duration',
    order: 'asc' | 'desc' = 'desc'
  ) => {
    filteredProjects.value.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'financialAchievement':
          comparison = (a.financialAchievement || 0) - (b.financialAchievement || 0);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  };

  // Add new action for updating form
  function updateForm(updates: Partial<FormState>) {
    form.value = {
      ...form.value,
      ...updates,
    };
    hasUnsavedChanges.value = true;
  }

  return {
    // State
    projects,
    filteredProjects,
    loading,
    error,
    currentProject,
    form,
    isSaving,
    hasUnsavedChanges,

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
    updateForm,
  };
});
