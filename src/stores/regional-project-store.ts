import { regionalProjectService } from '@/services/regional-project-service';
import type { Contract } from '@/types/contract';
import type { Procedure } from '@/types/procedure';
import type { RegionalProject } from '@/types/regional-project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useRegionalProjectStore = defineStore('regionalProject', () => {
  const projects = ref<RegionalProject[]>([]);
  const filteredProjects = ref<RegionalProject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const contracts = ref<Contract[]>([]);
  const procedures = ref<Procedure[]>([]);
  const contractsCount = computed(() => contracts.value.length);
  const proceduresCount = computed(() => procedures.value.length);
  const fetchAllProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await regionalProjectService.getAllProjects();
      projects.value = data;
      filteredProjects.value = data;
    } catch (err) {
      error.value = 'Failed to fetch projects';
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };
  const fetchAllContracts = async () => {
    try {
      const data = await regionalProjectService.getAllContracts();
      contracts.value = data;
    } catch (err) {
      console.error('Error fetching contracts:', err);
    }
  };
  const fetchAllProcedures = async () => {
    try {
      const data = await regionalProjectService.getAllProcedures();
      procedures.value = data;
    } catch (err) {
      console.error('Error fetching procedures:', err);
    }
  };
  const applyFilters = (filtered: RegionalProject[]) => {
    filteredProjects.value = filtered;
  };
  return {
    projects,
    filteredProjects,
    loading,
    error,
    contracts,
    procedures,
    contractsCount,
    proceduresCount,
    fetchAllProjects,
    fetchAllContracts,
    fetchAllProcedures,
    applyFilters,
  };
});
