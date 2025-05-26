import axiosInstance from '@/plugins/axios';
import type { Contract } from '@/types/contract';
import type { Procedure } from '@/types/procedure';
import type { RegionalProject } from '@/types/regional-project';

class RegionalProjectService {
  async getAllProjects() {
    const response = await axiosInstance.get('/api/RegionalProject');
    return response.data as RegionalProject[];
  }

  async getProjectById(id: string) {
    const response = await axiosInstance.get(`/api/RegionalProject/${id}`);
    return response.data as RegionalProject;
  }

  async createProject(project: Partial<RegionalProject>) {
    const response = await axiosInstance.post('/api/RegionalProject', project);
    return response.data as RegionalProject;
  }

  async updateProject(id: string, project: Partial<RegionalProject>) {
    const response = await axiosInstance.put(`/api/RegionalProject/${id}`, project);
    return response.data as RegionalProject;
  }

  async deleteProject(id: string) {
    return await axiosInstance.delete(`/api/RegionalProject/${id}`);
  }

  async getAllContracts() {
    const response = await axiosInstance.get('/api/RegionalProject/Contract');
    return response.data as Contract[];
  }

  async getAllProcedures() {
    const response = await axiosInstance.get('/api/RegionalProject/Procedure');
    return response.data as Procedure[];
  }
}

export const regionalProjectService = new RegionalProjectService();
