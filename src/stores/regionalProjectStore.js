import axiosInstance from '@/plugins/axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRegionalProjectStore = defineStore('regionalProject', () => {
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const filteredProjects = ref([]);

  const fetchAllProjects = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await axiosInstance.get('/api/RegionalProject');
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

  const applyFilters = (filtered) => {
    filteredProjects.value = filtered;
  };

  return {
    projects,
    loading,
    error,
    filteredProjects,
    fetchAllProjects,
    applyFilters,
  };
});
