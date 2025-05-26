import axiosInstance from '@/plugins/axios';
import { BaseApiService } from '@/services/base/BaseApiService';
import type {
  CreateProjectTypeRequest,
  Project,
  ProjectType as ProjectTypeInterface,
  ServiceResponse,
  UpdateProjectTypeRequest,
} from '@/types';

/**
 * Project Type Constants
 */
export enum ProjectTypeEnum {
  FUNDED = 'funded',
  REGIONAL = 'regional',
}

/**
 * Project Type Display Configuration
 */
interface ProjectTypeConfig {
  text: string;
  cssClass: string;
}

const PROJECT_TYPE_CONFIG: Record<ProjectTypeEnum, ProjectTypeConfig> = {
  [ProjectTypeEnum.FUNDED]: {
    text: 'مشروع ممول',
    cssClass: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300',
  },
  [ProjectTypeEnum.REGIONAL]: {
    text: 'مشروع تنمية الأقاليم',
    cssClass: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
  },
};

class ProjectTypeService extends BaseApiService<
  ProjectTypeInterface,
  CreateProjectTypeRequest,
  UpdateProjectTypeRequest
> {
  constructor() {
    super(axiosInstance, '/api/project-type');
  }

  /**
   * Get all project types
   * @returns Promise with the project types data
   */
  async getAllProjectTypes(): ServiceResponse<ProjectTypeInterface[]> {
    return this.getAll();
  }

  /**
   * Get a project type by ID
   * @param id - Project type ID
   * @returns Promise with the project type data
   */
  async getProjectTypeById(id: number | string): ServiceResponse<ProjectTypeInterface> {
    return this.getById(id);
  }

  /**
   * Create a new project type
   * @param projectTypeData - Project type data
   * @returns Promise with the created project type data
   */
  async createProjectType(
    projectTypeData: CreateProjectTypeRequest
  ): ServiceResponse<ProjectTypeInterface> {
    return this.create(projectTypeData);
  }

  /**
   * Update a project type
   * @param id - Project type ID
   * @param projectTypeData - Updated project type data
   * @returns Promise with the updated project type data
   */
  async updateProjectType(
    id: number | string,
    projectTypeData: UpdateProjectTypeRequest
  ): ServiceResponse<ProjectTypeInterface> {
    return this.update(id, projectTypeData);
  }

  /**
   * Delete a project type
   * @param id - Project type ID
   * @returns Promise with the deletion result
   */
  async deleteProjectType(id: number | string): ServiceResponse<void> {
    return this.delete(id);
  }

  /**
   * Search project types by name
   * @param searchTerm - Search term
   * @returns Promise with matching project types
   */
  async searchProjectTypes(searchTerm: string): ServiceResponse<ProjectTypeInterface[]> {
    return this.getAll({ search: searchTerm });
  }
}

/**
 * Determines the funding type of a project based on its properties
 * @param project - The project object
 * @returns Returns 'funded' or 'regional'
 */
export const determineFundingType = (
  project: Partial<Project> | null | undefined
): ProjectTypeEnum => {
  if (!project) return ProjectTypeEnum.REGIONAL;

  // For funded projects - explicit check first
  if ((project as any).isFunded === true || (project as any).fundingType === 1) {
    return ProjectTypeEnum.FUNDED;
  }

  // For regional development projects - explicit check
  if ((project as any).isFunded === false) {
    return ProjectTypeEnum.REGIONAL;
  }

  // Check for regional project indicators
  if (
    (project as any).directorate ||
    (project as any).projectType ||
    Array.isArray((project as any).sustainableDevelopment)
  ) {
    return ProjectTypeEnum.REGIONAL;
  }

  // Check for funded project indicators
  if (Array.isArray((project as any).components)) {
    return ProjectTypeEnum.FUNDED;
  }

  // Default to regional if no clear indicators
  return ProjectTypeEnum.REGIONAL;
};

/**
 * Gets the display text for a project type
 * @param type - The project type ('funded' or 'regional')
 * @returns Returns the display text in Arabic
 */
export const getProjectTypeText = (type: ProjectTypeEnum): string => {
  return PROJECT_TYPE_CONFIG[type]?.text || 'غير معروف';
};

/**
 * Gets the CSS classes for a project type badge
 * @param type - The project type ('funded' or 'regional')
 * @returns Returns the CSS classes
 */
export const getProjectTypeClass = (type: ProjectTypeEnum): string => {
  return PROJECT_TYPE_CONFIG[type]?.cssClass || '';
};

/**
 * Gets the complete configuration for a project type
 * @param type - The project type
 * @returns Returns the complete configuration object
 */
export const getProjectTypeConfig = (type: ProjectTypeEnum): ProjectTypeConfig | null => {
  return PROJECT_TYPE_CONFIG[type] || null;
};

// Export singleton instance
export const projectTypeService = new ProjectTypeService();
export default projectTypeService;

// Export the enum for external use
export { ProjectTypeEnum as ProjectType };
