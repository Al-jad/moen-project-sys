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
  ServiceResponse,
  UpdateActivityRequest,
  UpdateAttachmentRequest,
  UpdateComponentRequest,
  UpdateFundedProjectRequest,
} from '../types/api';

class FundedProjectService {
  // Funded Project CRUD Operations
  async getAllFundedProjects(params?: QueryParams): ServiceResponse<FundedProject[]> {
    const response = await axiosInstance.get('/api/Project', { params });
    return response;
  }

  async getFundedProjectById(id: number): ServiceResponse<FundedProject> {
    const response = await axiosInstance.get(`/api/Project/${id}`);
    return response;
  }

  async createFundedProject(
    projectData: CreateFundedProjectRequest
  ): ServiceResponse<FundedProject> {
    const response = await axiosInstance.post('/api/Project', projectData);
    return response;
  }

  async updateFundedProject(
    id: number,
    projectData: UpdateFundedProjectRequest
  ): ServiceResponse<FundedProject> {
    const response = await axiosInstance.put(`/api/Project/${id}`, projectData);
    return response;
  }

  async deleteFundedProject(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/Project/${id}`);
    return response;
  }

  // Component CRUD Operations
  async getAllComponents(projectId?: number): ServiceResponse<Component[]> {
    const params = projectId ? { projectId } : {};
    const response = await axiosInstance.get('/api/Component', { params });
    return response;
  }

  async getComponentById(id: number): ServiceResponse<Component> {
    const response = await axiosInstance.get(`/api/Component/${id}`);
    return response;
  }

  async getComponentsByProjectId(projectId: number): ServiceResponse<Component[]> {
    const response = await axiosInstance.get(`/api/Component/Project/${projectId}`);
    return response;
  }

  async createComponent(componentData: CreateComponentRequest): ServiceResponse<Component> {
    const response = await axiosInstance.post('/api/Component', componentData);
    return response;
  }

  async updateComponent(
    id: number,
    componentData: UpdateComponentRequest
  ): ServiceResponse<Component> {
    const response = await axiosInstance.put(`/api/Component/${id}`, componentData);
    return response;
  }

  async deleteComponent(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/Component/${id}`);
    return response;
  }

  // Activity CRUD Operations
  async getAllActivities(componentId?: number): ServiceResponse<Activity[]> {
    const params = componentId ? { componentId } : {};
    const response = await axiosInstance.get('/api/Activity', { params });
    return response;
  }

  async getActivityById(id: number): ServiceResponse<Activity> {
    const response = await axiosInstance.get(`/api/Activity/${id}`);
    return response;
  }

  async getActivitiesByComponentId(componentId: number): ServiceResponse<Activity[]> {
    const response = await axiosInstance.get(`/api/Activity/Component/${componentId}`);
    return response;
  }

  async createActivity(activityData: CreateActivityRequest): ServiceResponse<Activity> {
    const response = await axiosInstance.post('/api/Activity', activityData);
    return response;
  }

  async updateActivity(id: number, activityData: UpdateActivityRequest): ServiceResponse<Activity> {
    const response = await axiosInstance.put(`/api/Activity/${id}`, activityData);
    return response;
  }

  async deleteActivity(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/Activity/${id}`);
    return response;
  }

  // Attachment CRUD Operations
  async getAllAttachments(projectId?: number): ServiceResponse<Attachment[]> {
    const params = projectId ? { projectId } : {};
    const response = await axiosInstance.get('/api/Attachment', { params });
    return response;
  }

  async getAttachmentById(id: number): ServiceResponse<Attachment> {
    const response = await axiosInstance.get(`/api/Attachment/${id}`);
    return response;
  }

  async getAttachmentsByProjectId(projectId: number): ServiceResponse<Attachment[]> {
    const response = await axiosInstance.get(`/api/Attachment/Project/${projectId}`);
    return response;
  }

  async createAttachment(attachmentData: CreateAttachmentRequest): ServiceResponse<Attachment> {
    const response = await axiosInstance.post('/api/Attachment', attachmentData);
    return response;
  }

  async updateAttachment(
    id: number,
    attachmentData: UpdateAttachmentRequest
  ): ServiceResponse<Attachment> {
    const response = await axiosInstance.put(`/api/Attachment/${id}`, attachmentData);
    return response;
  }

  async deleteAttachment(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/Attachment/${id}`);
    return response;
  }

  // Utility Methods
  async searchFundedProjects(searchTerm: string): ServiceResponse<FundedProject[]> {
    const response = await axiosInstance.get('/api/Project', {
      params: { search: searchTerm },
    });
    return response;
  }

  async getFundedProjectsByStatus(status: number): ServiceResponse<FundedProject[]> {
    const response = await axiosInstance.get('/api/Project', {
      params: { status },
    });
    return response;
  }

  async getFundedProjectsByFundingType(fundingType: number): ServiceResponse<FundedProject[]> {
    const response = await axiosInstance.get('/api/Project', {
      params: { fundingType },
    });
    return response;
  }

  async getGovernmentProjects(): ServiceResponse<FundedProject[]> {
    const response = await axiosInstance.get('/api/Project', {
      params: { isGovernment: true },
    });
    return response;
  }

  async getFundedProjectStatistics(): ServiceResponse<{
    total: number;
    inProgress: number;
    completed: number;
    delayed: number;
    cancelled: number;
    government: number;
    nonGovernment: number;
  }> {
    const response = await axiosInstance.get('/api/Project/statistics');
    return response;
  }

  // Bulk Operations
  async createProjectWithComponents(
    projectData: CreateFundedProjectRequest,
    components: CreateComponentRequest[]
  ): ServiceResponse<FundedProject> {
    // First create the project
    const projectResponse = await this.createFundedProject(projectData);
    const projectId = projectResponse.data.id;

    // Then create components
    for (const componentData of components) {
      await this.createComponent({
        ...componentData,
        projectId,
      });
    }

    // Return the complete project with components
    return this.getFundedProjectById(projectId);
  }

  async updateProjectFinancialAchievement(
    id: number,
    financialAchievement: number
  ): ServiceResponse<FundedProject> {
    const response = await axiosInstance.put(`/api/Project/${id}`, {
      financialAchievement: Number(financialAchievement) || 0,
    });
    return response;
  }
}

export const fundedProjectService = new FundedProjectService();
export default fundedProjectService;
