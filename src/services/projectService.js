import axiosInstance from '@/plugins/axios';

/**
 * Service for handling project-related API requests
 */
export const projectService = {
  /**
   * Get all projects
   * @returns {Promise} Promise with the projects data
   */
  getAllProjects() {
    return axiosInstance.get('/api/project');
  },

  /**
   * Get a project by ID
   * @param {number|string} id - Project ID
   * @returns {Promise} Promise with the project data
   */
  getProjectById(id) {
    return axiosInstance.get(`/api/project/${id}`);
  },

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise} Promise with the created project data
   */
  createProject(projectData) {
    return axiosInstance.post('/api/project', projectData);
  },

  /**
   * Update a project
   * @param {number|string} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} Promise with the updated project data
   */
  updateProject(id, projectData) {
    return axiosInstance.put(`/api/project/${id}`, projectData);
  },

  /**
   * Delete a project
   * @param {number|string} id - Project ID
   * @returns {Promise} Promise with the deletion result
   */
  deleteProject(id) {
    return axiosInstance.delete(`/api/project/${id}`);
  }
};

export default projectService;
