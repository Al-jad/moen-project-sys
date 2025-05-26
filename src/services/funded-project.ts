import axiosInstance from '@/plugins/axios';
import { BaseApiService } from '@/services/base/BaseApiService';
import type { Activity, CreateActivityRequest } from '@/types/activity';
import type { ServiceResponse } from '@/types/api-base';
import type { Component, CreateComponentRequest } from '@/types/component';
import type {
  CreateFundedProjectRequest,
  FundedProject,
  TransformedFundedProject,
  UpdateFundedProjectRequest,
} from '@/types/funded-project';
import { formatDate } from '@/utils/dateUtils';

// Import enums and constants
import { FundedProjectStatus, FundedProjectStatusVariantMap } from '@/types/funded-project';

// Type aliases for clarity
type FundedProjectActivity = Activity;
type FundedProjectComponent = Component;
type FundedProjectActivityRequest = CreateActivityRequest;
type FundedProjectComponentRequest = CreateComponentRequest;

class FundedProjectService extends BaseApiService<
  FundedProject,
  CreateFundedProjectRequest,
  UpdateFundedProjectRequest
> {
  constructor() {
    super(axiosInstance, '/api/project');
  }

  /**
   * Get all funded projects
   */
  async getAllProjects(): ServiceResponse<FundedProject[]> {
    return this.getAll();
  }

  /**
   * Get a funded project by ID
   */
  async getProjectById(id: number | string): ServiceResponse<FundedProject> {
    return this.getById(id);
  }

  /**
   * Create a new funded project
   */
  async createProject(projectData: CreateFundedProjectRequest): ServiceResponse<FundedProject> {
    return this.create(projectData);
  }

  /**
   * Update a funded project
   */
  async updateProject(
    id: number | string,
    projectData: UpdateFundedProjectRequest
  ): ServiceResponse<FundedProject> {
    return this.update(id, projectData);
  }

  /**
   * Delete a funded project
   */
  async deleteProject(id: number | string): ServiceResponse<void> {
    return this.delete(id);
  }

  /**
   * Get funded projects by status
   */
  async getProjectsByStatus(status: FundedProjectStatus): ServiceResponse<FundedProject[]> {
    return this.getAll({ status: status.toString() });
  }

  /**
   * Add a component to a project
   */
  async addComponent(
    projectId: number | string,
    component: FundedProjectComponentRequest
  ): ServiceResponse<FundedProjectComponent> {
    return axiosInstance.post(`${this.baseEndpoint}/${projectId}/components`, component);
  }

  /**
   * Update a project component
   */
  async updateComponent(
    projectId: number | string,
    componentId: number | string,
    component: FundedProjectComponentRequest
  ): ServiceResponse<FundedProjectComponent> {
    return axiosInstance.put(
      `${this.baseEndpoint}/${projectId}/components/${componentId}`,
      component
    );
  }

  /**
   * Delete a project component
   */
  async deleteComponent(
    projectId: number | string,
    componentId: number | string
  ): ServiceResponse<void> {
    return axiosInstance.delete(`${this.baseEndpoint}/${projectId}/components/${componentId}`);
  }

  /**
   * Add an activity to a component
   */
  async addActivity(
    projectId: number | string,
    componentId: number | string,
    activity: FundedProjectActivityRequest
  ): ServiceResponse<FundedProjectActivity> {
    return axiosInstance.post(
      `${this.baseEndpoint}/${projectId}/components/${componentId}/activities`,
      activity
    );
  }

  /**
   * Update a component activity
   */
  async updateActivity(
    projectId: number | string,
    componentId: number | string,
    activityId: number | string,
    activity: FundedProjectActivityRequest
  ): ServiceResponse<FundedProjectActivity> {
    return axiosInstance.put(
      `${this.baseEndpoint}/${projectId}/components/${componentId}/activities/${activityId}`,
      activity
    );
  }

  /**
   * Delete a component activity
   */
  async deleteActivity(
    projectId: number | string,
    componentId: number | string,
    activityId: number | string
  ): ServiceResponse<void> {
    return axiosInstance.delete(
      `${this.baseEndpoint}/${projectId}/components/${componentId}/activities/${activityId}`
    );
  }

  /**
   * Transform API project to UI project format
   */
  transformProject(project: FundedProject | null): TransformedFundedProject | null {
    if (!project) {
      console.warn('Attempted to transform undefined project');
      return null;
    }

    try {
      console.log('Transforming project:', project); // Debug log
      const projectStatus = project.projectStatus ?? FundedProjectStatus.IN_PROGRESS;

      const transformedProject: TransformedFundedProject = {
        id: project.id?.toString() || '',
        title: project.name || '',
        department: project.executingDepartment || '',
        status: projectStatus.toString(),
        statusVariant: FundedProjectStatusVariantMap[projectStatus as FundedProjectStatus],
        progress: project.financialAchievement || 0,
        duration: project.duration?.toString() || '0',
        cost: project.cost || 0,
        startDate: formatDate(project.actualStartDate || ''),
        endDate: formatDate(project.actualStartDate || ''), // Using startDate as endDate is not in API
        implementingEntity: project.implementingEntity || '',
        beneficiaryEntities: project.beneficiaries?.map((b) => b.name).join(', ') || '',
        grantingEntity: project.grantingEntity || '',
        isGovernment: project.isGovernment || false,
        projectObjectives: project.projectObjectives || '',
        components:
          project.components?.map((component) => ({
            id: component.id?.toString(),
            name: component.name,
            targetPercentage: component.targetPercentage || 0,
            activities:
              component.activities?.map((activity) => ({
                id: activity.id?.toString(),
                name: activity.name,
                description: '',
                selectedPeriods: [],
              })) || [],
          })) || [],
        latitude: project.lat || null,
        longitude: project.lng || null,
      };

      console.log('Transformed project:', transformedProject); // Debug log
      return transformedProject;
    } catch (error) {
      console.error('Error transforming project:', error);
      return null;
    }
  }

  /**
   * Calculate total progress of a project based on its components
   */
  calculateProgress(project: FundedProject): number {
    if (!project.components || project.components.length === 0) return 0;

    return Math.min(
      100,
      Math.round(
        project.components.reduce((sum, component) => sum + (component.targetPercentage || 0), 0)
      )
    );
  }
}

// Export singleton instance
export const fundedProjectService = new FundedProjectService();
export default fundedProjectService;
