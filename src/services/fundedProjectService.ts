import axiosInstance from '../plugins/axios';
import type {
  Activity,
  Attachment,
  Component,
  CreateActivityRequest,
  CreateAttachmentRequest,
  CreateComponentRequest,
  CreateFundedProjectRequest,
  FundedProject,
  QueryParams,
  UpdateActivityRequest,
  UpdateAttachmentRequest,
  UpdateComponentRequest,
  UpdateFundedProjectRequest,
} from '../types';

class FundedProjectService {
  async getAllProjects(params?: QueryParams): Promise<FundedProject[]> {
    const response = await axiosInstance.get('/funded', { params });
    return response.data;
  }

  async getProjectById(id: string): Promise<FundedProject> {
    const response = await axiosInstance.get(`/funded/${id}`);
    return response.data;
  }

  async createProject(projectData: CreateFundedProjectRequest): Promise<FundedProject> {
    const response = await axiosInstance.post('/funded', projectData);
    return response.data;
  }

  async updateProject(
    id: number | string,
    projectData: UpdateFundedProjectRequest
  ): Promise<FundedProject> {
    const response = await axiosInstance.put(`/funded/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id: number | string): Promise<void> {
    await axiosInstance.delete(`/funded`, { params: { pId: id } });
  }

  // Component CRUD Operations
  async getAllComponents(projectId?: number): Promise<Component[]> {
    const params = projectId ? { projectId } : {};
    const response = await axiosInstance.get('/components', { params });
    return response.data;
  }

  async getComponentById(id: number): Promise<Component> {
    const response = await axiosInstance.get(`/components/${id}`);
    return response.data;
  }

  async getComponentsByProjectId(projectId: number): Promise<Component[]> {
    const response = await axiosInstance.get(`/components/Project/${projectId}`);
    return response.data;
  }

  async createComponent(componentData: CreateComponentRequest): Promise<Component> {
    const response = await axiosInstance.post('/components', componentData);
    return response.data;
  }

  async updateComponent(id: number, componentData: UpdateComponentRequest): Promise<Component> {
    const response = await axiosInstance.put(`/components/${id}`, componentData);
    return response.data;
  }

  async deleteComponent(id: number): Promise<void> {
    await axiosInstance.delete(`/components/${id}`);
  }

  // Activity CRUD Operations
  async getAllActivities(componentId?: number): Promise<Activity[]> {
    const params = componentId ? { componentId } : {};
    const response = await axiosInstance.get('/activities', { params });
    return response.data;
  }

  async getActivityById(id: number): Promise<Activity> {
    const response = await axiosInstance.get(`/activities/${id}`);
    return response.data;
  }

  async getActivitiesByComponentId(componentId: number): Promise<Activity[]> {
    const response = await axiosInstance.get(`/activities/component/${componentId}`);
    return response.data;
  }

  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    const response = await axiosInstance.post('/activities', activityData);
    return response.data;
  }

  async updateActivity(id: number, activityData: UpdateActivityRequest): Promise<Activity> {
    const response = await axiosInstance.put(`/activities/${id}`, activityData);
    return response.data;
  }

  async deleteActivity(id: number): Promise<void> {
    await axiosInstance.delete(`/activities/${id}`);
  }

  // Attachment CRUD Operations
  async getAllAttachments(projectId?: number): Promise<Attachment[]> {
    const params = projectId ? { projectId } : {};
    const response = await axiosInstance.get('/attachments', { params });
    return response.data;
  }

  async getAttachmentById(id: number): Promise<Attachment> {
    const response = await axiosInstance.get(`/attachments/${id}`);
    return response.data;
  }

  async getAttachmentsByProjectId(projectId: number): Promise<Attachment[]> {
    const response = await axiosInstance.get(`/attachments/Project/${projectId}`);
    return response.data;
  }

  async createAttachment(attachmentData: CreateAttachmentRequest): Promise<Attachment> {
    const response = await axiosInstance.post('/attachments', attachmentData);
    return response.data;
  }

  async updateAttachment(id: number, attachmentData: UpdateAttachmentRequest): Promise<Attachment> {
    const response = await axiosInstance.put(`/attachments/${id}`, attachmentData);
    return response.data;
  }

  async deleteAttachment(id: number): Promise<void> {
    await axiosInstance.delete(`/attachments/${id}`);
  }

  // Utility Methods
  async searchProjects(searchTerm: string): Promise<FundedProject[]> {
    const response = await axiosInstance.get('/funded', {
      params: { search: searchTerm },
    });
    return response.data;
  }

  async getProjectsByStatus(status: number): Promise<FundedProject[]> {
    const response = await axiosInstance.get('/funded', {
      params: { status },
    });
    return response.data;
  }

  async getProjectsByFundingType(fundingType: number): Promise<FundedProject[]> {
    const response = await axiosInstance.get('/funded', {
      params: { fundingType },
    });
    return response.data;
  }

  async getGovernmentProjects(): Promise<FundedProject[]> {
    const response = await axiosInstance.get('/funded', {
      params: { isGovernment: true },
    });
    return response.data;
  }

  async getProjectStatistics(): Promise<{
    total: number;
    inProgress: number;
    completed: number;
    delayed: number;
    cancelled: number;
    government: number;
    nonGovernment: number;
  }> {
    const response = await axiosInstance.get('/funded/statistics');
    return response.data;
  }

  // Bulk Operations
  async createProjectWithComponents(
    projectData: CreateFundedProjectRequest,
    components: CreateComponentRequest[]
  ): Promise<FundedProject> {
    // First create the project
    const project = await this.createProject(projectData);
    const projectId = project.id;

    // Then create components
    for (const componentData of components) {
      await this.createComponent({
        ...componentData,
        projectId: projectId as unknown as number,
      });
    }

    // Return the complete project with components
    return this.getProjectById(projectId);
  }

  async updateProjectFinancialAchievement(
    id: number,
    financialAchievement: number
  ): Promise<FundedProject> {
    const response = await axiosInstance.put(`/funded/${id}`, {
      financialAchievement: Number(financialAchievement) || 0,
    });
    return response.data;
  }

  // Calculation method
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

export const fundedProjectService = new FundedProjectService();
export default fundedProjectService;
