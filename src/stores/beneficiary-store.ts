import { beneficiaryService } from '@/services/beneficiaryService';
import type { Beneficiary, UpdateBeneficiaryRequest } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useBeneficiaryStore = defineStore('beneficiary', () => {
  // State
  const beneficiaries = ref<Beneficiary[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);

  // Getters
  const getAllBeneficiaries = computed(() => beneficiaries.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // Actions
  const fetchBeneficiaries = async (force = false) => {
    // If force is true, always fetch regardless of cache
    if (force) {
      loading.value = true;
      error.value = null;

      try {
        const response = await beneficiaryService.getAllBeneficiaries();
        beneficiaries.value = response.data;
        lastFetch.value = Date.now();
        return beneficiaries.value;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch beneficiaries';
        throw err;
      } finally {
        loading.value = false;
      }
    }

    // Existing cache logic
    const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
    if (
      beneficiaries.value.length > 0 &&
      lastFetch.value &&
      Date.now() - lastFetch.value < CACHE_TIME
    ) {
      return beneficiaries.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      beneficiaries.value = response.data;
      lastFetch.value = Date.now();
      return beneficiaries.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch beneficiaries';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addBeneficiary = async (
    beneficiaryData: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await beneficiaryService.createBeneficiary(beneficiaryData);
      beneficiaries.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add beneficiary';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBeneficiary = async (
    id: string,
    beneficiaryData: Omit<UpdateBeneficiaryRequest, 'id'>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await beneficiaryService.updateBeneficiary(id, { ...beneficiaryData, id });
      const index = beneficiaries.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        beneficiaries.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update beneficiary';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBeneficiary = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await beneficiaryService.deleteBeneficiary(id);
      beneficiaries.value = beneficiaries.value.filter((b) => b.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete beneficiary';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    beneficiaries,
    loading,
    error,
    // Getters
    getAllBeneficiaries,
    isLoading,
    getError,
    // Actions
    fetchBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
  };
});
