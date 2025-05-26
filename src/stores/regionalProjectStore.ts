import { regionalProjectService } from '@/services/regional-project-service';
import type { Component } from '@/types/component';
import type { Contract } from '@/types/contract';
import type { Procedure } from '@/types/procedure';
import type { RegionalProject } from '@/types/regional-project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useRegionalProjectStore = defineStore('regionalProject', () => {
  const projects = ref<RegionalProject[]>([]);
  const filteredProjects = ref<RegionalProject[]>([]);
  const contracts = ref<Contract[]>([]);
  const procedures = ref<Procedure[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
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
  const fetchAllContracts = async () => {
    try {
      const response = await regionalProjectService.getAllContracts();
      contracts.value = response;
    } catch (err) {
      console.error('Error fetching contracts:', err);
    }
  };
  const fetchAllProcedures = async () => {
    try {
      const response = await regionalProjectService.getAllProcedures();
      procedures.value = response;
    } catch (err) {
      console.error('Error fetching procedures:', err);
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
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };
  const applyFilters = (filtered: RegionalProject[]) => {
    filteredProjects.value = filtered;
  };
  const resetFilters = () => {
    filteredProjects.value = [...projects.value];
  };
  return {
    projects,
    filteredProjects,
    contracts,
    procedures,
    loading,
    error,
    contractsCount,
    proceduresCount,
    getTotalComponents,
    getTotalActivities,
    fetchAllProjects,
    fetchAllContracts,
    fetchAllProcedures,
    createProject,
    updateProject,
    deleteProject,
    applyFilters,
    resetFilters,
  };
});
