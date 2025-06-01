import axiosInstance from '@/plugins/axios';
import { BaseApiService } from '@/services/base/BaseApiService';
import type {
  Component,
  CreateProjectRequest,
  FundedProject,
  Project,
  RegionalProject,
  ServiceResponse,
  UpdateProjectRequest,
} from '@/types';
import { ProjectStatus } from '@/types/project-type';
import { formatDate } from '@/utils/dateUtils';

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
    return this.getAll({ status: status.toString() });
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
    return this.patch(id, { status: Number(status) });
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;

interface TransformedProject {
  id: string;
  title: string;
  department: string;
  status: string;
  statusVariant: string;
  progress: number;
  duration: string;
  cost: number;
  startDate: string;
  endDate: string;
  implementingEntity: string;
  beneficiaryEntities: string;
  grantingEntity: string;
  fundingType: number;
  projectObjectives: string;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Maps project status to UI-friendly status text
 */
const getProjectStatus = (status: number | string): string => {
  const statusMap: Record<string | number, string> = {
    [ProjectStatus.UNDER_STUDY]: 'قيد الدراسة',
    [ProjectStatus.IN_PROGRESS]: 'قيد التنفيذ',
    [ProjectStatus.SUSPENDED]: 'متوقف',
    [ProjectStatus.COMPLETED]: 'منجز',
    [ProjectStatus.CANCELLED]: 'ملغي',
  };

  return statusMap[status] || 'قيد التنفيذ';
};

/**
 * Maps project status to UI variant for styling
 */
const getStatusVariant = (status: number | string): string => {
  const variantMap: Record<string | number, string> = {
    [ProjectStatus.UNDER_STUDY]: 'info',
    [ProjectStatus.IN_PROGRESS]: 'warning',
    [ProjectStatus.SUSPENDED]: 'secondary',
    [ProjectStatus.COMPLETED]: 'success',
    [ProjectStatus.CANCELLED]: 'danger',
  };

  return variantMap[status] || 'warning';
};

/**
 * Calculate project progress based on components
 */
export const calculateProgress = (project: FundedProject): number => {
  if (!project.components || project.components.length === 0) return 0;

  return Math.min(
    100,
    Math.round(
      project.components.reduce(
        (sum: number, component: Component) => sum + (component.targetPercentage || 0),
        0
      )
    )
  );
};

/**
 * Transform API project to UI project format
 */
export const transformProject = (
  project: FundedProject | RegionalProject | null
): TransformedProject | null => {
  if (!project) {
    console.warn('Attempted to transform undefined project');
    return null;
  }

  // Helper to safely access properties that might exist on one type but not another
  const getProp = (obj: any, key: string, defaultValue: any = '') =>
    obj?.[key] === undefined ? defaultValue : obj[key];

  try {
    // Create a base transformed project with default values
    const transformedProject: TransformedProject = {
      id: project.id?.toString() || '',
      title: project.name || '',
      // Use getProp for fields that differ or might be missing
      department: getProp(project, 'executingDepartment', ''),
      status: getProjectStatus(getProp(project, 'projectStatus', 0)),
      statusVariant: getStatusVariant(getProp(project, 'projectStatus', 0)),
      progress:
        'components' in project && project.components
          ? calculateProgress(project as FundedProject)
          : getProp(
              project,
              'financialAchievement',
              getProp(project, 'calculatedCumulativeFinancialProgress', 0)
            ),
      duration: project.duration?.toString() || '0',
      cost: project.cost || 0,
      startDate: formatDate(getProp(project, 'actualStartDate')),
      endDate: formatDate(getProp(project, 'actualEndDate')),
      implementingEntity: getProp(project, 'implementingEntity', ''),
      beneficiaryEntities: getProp(
        project,
        'beneficiaries',
        getProp(project, 'beneficiaryEntities', '')
      ),
      grantingEntity: getProp(
        project,
        'grantingEntity',
        getProp(project, 'supportingEntities', '')
      ),
      fundingType: getProp(project, 'fundingType', 1),
      projectObjectives: getProp(project, 'projectObjectives', getProp(project, 'goals', '')),
      latitude: project.lat || null,
      longitude: project.lng || null,
    };

    return transformedProject;
  } catch (error) {
    console.error('Error transforming project:', error, project);
    // Return a minimal valid object to prevent UI errors
    return {
      id: project?.id?.toString() || 'error',
      title: project?.name || 'Error loading project',
      department: '',
      status: 'خطأ',
      statusVariant: 'danger',
      progress: 0,
      duration: '0',
      cost: 0,
      startDate: '',
      endDate: '',
      implementingEntity: '',
      beneficiaryEntities: '',
      grantingEntity: '',
      fundingType: 1,
      projectObjectives: '',
      latitude: null,
      longitude: null,
    };
  }
};
