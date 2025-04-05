import axiosInstance from '@/plugins/axios';
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    filteredProjects: [],
    loading: false,
    error: null,
    sortOrder: null,
  }),

  actions: {
    async fetchAllProjects() {
      this.loading = true;
      this.error = null;

      try {
        const [projectsResponse, regionalProjectsResponse] = await Promise.all([
          axiosInstance.get('/api/Project'),
          axiosInstance.get('/api/RegionalProject'),
        ]);

        // Combine both arrays of projects
        this.projects = [
          ...(projectsResponse.data || []),
          ...(regionalProjectsResponse.data || []),
        ];
        this.filteredProjects = [...this.projects]; // Initialize filtered projects
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching projects:', err);
      } finally {
        this.loading = false;
      }
    },

    applyFilters(filteredResults) {
      this.filteredProjects = filteredResults;
      if (this.sortOrder) {
        this.applySorting(this.sortOrder);
      }
    },

    applySorting(sortId) {
      this.sortOrder = sortId;
      const sortedProjects = [...this.filteredProjects];

      switch (sortId) {
        case 'price-low':
          sortedProjects.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
          break;
        case 'price-high':
          sortedProjects.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
          break;
        case 'period-high':
          sortedProjects.sort((a, b) => b.duration - a.duration);
          break;
        case 'period-low':
          sortedProjects.sort((a, b) => a.duration - b.duration);
          break;
        case 'progress-high':
          sortedProjects.sort((a, b) => b.progress - a.progress);
          break;
        case 'progress-low':
          sortedProjects.sort((a, b) => a.progress - b.progress);
          break;
        default:
          break;
      }

      this.filteredProjects = sortedProjects;
    },

    clearSort() {
      this.sortOrder = null;
      this.filteredProjects = [...this.filteredProjects]; // Reset to unsorted order
    },
  },
});
