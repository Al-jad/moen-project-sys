import { defineStore } from 'pinia';
import { ref } from 'vue';
import regionalProjectService from '../services/regionalProjectService';
export const useRegionalProjectStore = defineStore('regionalProject', () => {
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const filteredProjects = ref([]);
  const contractsCount = ref(0);
  const contracts = ref([]);
  const procedures = ref([]);
  const proceduresCount = ref(0);

  const fetchAllProjects = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.getAllRegionalProjects();
      projects.value = response.data;
      filteredProjects.value = response.data;
    } catch (err) {
      error.value = err.message || 'Failed to fetch regional projects';
      projects.value = [];
      filteredProjects.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchAllContracts = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.getAllContracts();
      contracts.value = response.data;
      contractsCount.value = response.data.length;
    } catch (err) {
      error.value = err.message || 'Failed to fetch contracts';
      contracts.value = [];
      contractsCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const createContract = async (contractData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.createContract(contractData);
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to create contract';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateContract = async (id, contractData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.updateContract(id, contractData);
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to update contract';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchContractById = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.getContractById(id);
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to fetch contract';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteContract = async (id) => {
    try {
      loading.value = true;
      await regionalProjectService.deleteContract(id);
      contracts.value = contracts.value.filter((contract) => contract.id !== id);
      contractsCount.value = contracts.value.length;
    } catch (err) {
      error.value = err.message || 'Failed to delete contract';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllProcedures = async (contractId) => {
    try {
      loading.value = true;
      const response = await regionalProjectService.getProceduresByContract(contractId);
      procedures.value = response.data;
      proceduresCount.value = procedures.value.length;
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to fetch procedures';
      procedures.value = [];
      proceduresCount.value = 0;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createProcedure = async (procedureData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.createProcedure(procedureData);
      // Find the contract and update its procedures
      const contract = await fetchContractById(procedureData.contractId);
      if (contract) {
        const index = contracts.value.findIndex((c) => c.id === procedureData.contractId);
        if (index !== -1) {
          contracts.value[index] = contract;
        }
      }
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to create procedure';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProcedure = async (id, contractId) => {
    try {
      loading.value = true;
      await regionalProjectService.deleteProcedure(id);
      // Fetch updated contract data to get fresh procedures
      const contract = await fetchContractById(contractId);
      if (contract) {
        const index = contracts.value.findIndex((c) => c.id === contractId);
        if (index !== -1) {
          contracts.value[index] = contract;
        }
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete procedure';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProcedure = async (id, procedureData) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.updateProcedure(id, procedureData);
      // Fetch updated contract data to get fresh procedures
      const contract = await fetchContractById(procedureData.contractId);
      if (contract) {
        const index = contracts.value.findIndex((c) => c.id === procedureData.contractId);
        if (index !== -1) {
          contracts.value[index] = contract;
        }
      }
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to update procedure';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const applyFilters = (filtered) => {
    filteredProjects.value = filtered;
  };

  const fetchProjectById = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await regionalProjectService.getRegionalProjectById(id);
      return response.data;
    } catch (err) {
      error.value = err.message || 'Failed to fetch project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    loading,
    error,
    filteredProjects,
    contracts,
    contractsCount,
    procedures,
    proceduresCount,
    fetchAllProjects,
    fetchProjectById,
    applyFilters,
    fetchAllContracts,
    fetchContractById,
    fetchAllProcedures,
    deleteContract,
    createContract,
    updateContract,
    createProcedure,
    deleteProcedure,
    updateProcedure,
  };
});
