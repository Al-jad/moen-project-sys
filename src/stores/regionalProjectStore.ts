import { regionalProjectService } from '@/services/regional-project-service';
import type { Component } from '@/types/component';
import type { Contract } from '@/types/contract';
import type { Procedure } from '@/types/procedure';
import type { RegionalProject } from '@/types/regional-project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useRegionalProjectStore = defineStore('regionalProject', () => {
  // State
  const projects = ref<RegionalProject[]>([]);
  const filteredProjects = ref<RegionalProject[]>([]);
  const currentProject = ref<RegionalProject | null>(null);
  const contracts = ref<Contract[]>([]);
  const procedures = ref<Procedure[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const contractsCount = computed(() => contracts.value.length);
  const proceduresCount = computed(() => procedures.value.length);
  const getTotalComponents = computed(() => {
    return projects.value.reduce((total: number, project: RegionalProject) => {
      return total + (project.components?.length || 0);
    }, 0);
  });
  const getTotalActivities = computed(() => {
    return projects.value.reduce((total: number, project: RegionalProject) => {
      if (!project.components) return total;
      return (
        total +
        project.components.reduce((sum: number, comp: Component) => {
          return sum + (comp.activities?.length || 0);
        }, 0)
      );
    }, 0);
  });

  // Project Actions
  const fetchAllProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await regionalProjectService.getAllProjects();
      projects.value = response;
      filteredProjects.value = response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch projects';
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await regionalProjectService.getProjectById(id);
      currentProject.value = response;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch project';
      console.error('Error fetching project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (project: Partial<RegionalProject>) => {
    try {
      const response = await regionalProjectService.createProject(project);
      projects.value.push(response);
      return response;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id: number, project: Partial<RegionalProject>) => {
    try {
      const response = await regionalProjectService.updateProject(id.toString(), project);
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = response;
      }
      if (currentProject.value?.id === id) {
        currentProject.value = response;
      }
      return response;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await regionalProjectService.deleteProject(id.toString());
      projects.value = projects.value.filter((p) => p.id !== id);
      filteredProjects.value = filteredProjects.value.filter((p) => p.id !== id);
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Contract Actions
  const fetchAllContracts = async () => {
    try {
      const response = await regionalProjectService.getAllContracts();
      contracts.value = response;
    } catch (err) {
      console.error('Error fetching contracts:', err);
      throw err;
    }
  };

  const fetchContractById = async (id: string | number) => {
    try {
      const response = await regionalProjectService.getContractById(id.toString());
      return response;
    } catch (err) {
      console.error('Error fetching contract:', err);
      throw err;
    }
  };

  const fetchContractsByProjectId = async (projectId: string) => {
    try {
      const response = await regionalProjectService.getContractsByProjectId(projectId);
      contracts.value = response;
      return response;
    } catch (err) {
      console.error('Error fetching project contracts:', err);
      throw err;
    }
  };

  const createContract = async (contract: Partial<Contract>) => {
    try {
      const response = await regionalProjectService.createContract(contract);
      contracts.value.push(response);
      return response;
    } catch (err) {
      console.error('Error creating contract:', err);
      throw err;
    }
  };

  const updateContract = async (id: string, contract: Partial<Contract>) => {
    try {
      const response = await regionalProjectService.updateContract(id, contract);
      const index = contracts.value.findIndex((c) => c.id.toString() === id);
      if (index !== -1) {
        contracts.value[index] = response;
      }
      return response;
    } catch (err) {
      console.error('Error updating contract:', err);
      throw err;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      await regionalProjectService.deleteContract(id);
      contracts.value = contracts.value.filter((c) => c.id.toString() === id);
    } catch (err) {
      console.error('Error deleting contract:', err);
      throw err;
    }
  };

  // Procedure Actions
  const fetchAllProcedures = async () => {
    try {
      const response = await regionalProjectService.getAllProcedures();
      procedures.value = response;
    } catch (err) {
      console.error('Error fetching procedures:', err);
      throw err;
    }
  };

  const createProcedure = async (procedure: Partial<Procedure>) => {
    try {
      const response = await regionalProjectService.createProcedure(procedure);
      procedures.value.push(response);
      return response;
    } catch (err) {
      console.error('Error creating procedure:', err);
      throw err;
    }
  };

  const updateProcedure = async (id: string, procedure: Partial<Procedure>) => {
    try {
      const response = await regionalProjectService.updateProcedure(id, procedure);
      const index = procedures.value.findIndex((p) => p.id.toString() === id);
      if (index !== -1) {
        procedures.value[index] = response;
      }
      return response;
    } catch (err) {
      console.error('Error updating procedure:', err);
      throw err;
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      await regionalProjectService.deleteProcedure(id);
      procedures.value = procedures.value.filter((p) => p.id.toString() !== id);
    } catch (err) {
      console.error('Error deleting procedure:', err);
      throw err;
    }
  };

  // Filter Actions
  const applyFilters = (filtered: RegionalProject[]) => {
    filteredProjects.value = filtered;
  };

  const resetFilters = () => {
    filteredProjects.value = [...projects.value];
  };

  return {
    // State
    projects,
    filteredProjects,
    currentProject,
    contracts,
    procedures,
    loading,
    error,

    // Computed
    contractsCount,
    proceduresCount,
    getTotalComponents,
    getTotalActivities,

    // Project Actions
    fetchAllProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,

    // Contract Actions
    fetchAllContracts,
    fetchContractById,
    fetchContractsByProjectId,
    createContract,
    updateContract,
    deleteContract,

    // Procedure Actions
    fetchAllProcedures,
    createProcedure,
    updateProcedure,
    deleteProcedure,

    // Filter Actions
    applyFilters,
    resetFilters,
  };
});
