import axiosInstance from '@/plugins/axios';
import { BaseApiService } from '@/services/base/BaseApiService';
import type {
  CreateProjectRequest,
  Project,
  ProjectStatus,
  ServiceResponse,
  UpdateProjectRequest,
} from '@/types/api';

class ProjectService extends BaseApiService<Project, CreateProjectRequest, UpdateProjectRequest> {
  constructor() {
    super(axiosInstance, '/api/project');
  }

  /**
   * Get all projects
   * @returns Promise with the projects data
   */
  async getAllProjects(): ServiceResponse<Project[]> {
    return this.getAll();
  }

  /**
   * Get a project by ID
   * @param id - Project ID
   * @returns Promise with the project data
   */
  async getProjectById(id: number | string): ServiceResponse<Project> {
    return this.getById(id);
  }

  /**
   * Create a new project
   * @param projectData - Project data
   * @returns Promise with the created project data
   */
  async createProject(projectData: CreateProjectRequest): ServiceResponse<Project> {
    return this.create(projectData);
  }

  /**
   * Update a project
   * @param id - Project ID
   * @param projectData - Updated project data
   * @returns Promise with the updated project data
   */
  async updateProject(
    id: number | string,
    projectData: UpdateProjectRequest
  ): ServiceResponse<Project> {
    return this.update(id, projectData);
  }

  /**
   * Delete a project
   * @param id - Project ID
   * @returns Promise with the deletion result
   */
  async deleteProject(id: number | string): ServiceResponse<void> {
    return this.delete(id);
  }

  /**
   * Get projects by status
   * @param status - Project status
   * @returns Promise with filtered projects
   */
  async getProjectsByStatus(status: ProjectStatus): ServiceResponse<Project[]> {
    return this.getAll({ status });
  }

  /**
   * Get projects by beneficiary ID
   * @param beneficiaryId - Beneficiary ID
   * @returns Promise with projects for the beneficiary
   */
  async getProjectsByBeneficiary(beneficiaryId: number): ServiceResponse<Project[]> {
    return axiosInstance.get(`${this.baseEndpoint}/beneficiary/${beneficiaryId}`);
  }

  /**
   * Get projects with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with paginated projects
   */
  async getProjectsPaginated(page: number = 1, limit: number = 10) {
    return this.getPaginated({ page, limit });
  }

  /**
   * Search projects by name or description
   * @param searchTerm - Search term
   * @returns Promise with matching projects
   */
  async searchProjects(searchTerm: string): ServiceResponse<Project[]> {
    return this.getAll({ search: searchTerm });
  }

  /**
   * Update project status
   * @param id - Project ID
   * @param status - New status
   * @returns Promise with updated project
   */
  async updateProjectStatus(id: number | string, status: ProjectStatus): ServiceResponse<Project> {
    return this.patch(id, { status });
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;
