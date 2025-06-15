import axiosInstance from '@/plugins/axios';
import type { Contract } from '@/types/contract';
import type { Procedure } from '@/types/procedure';
import type { RegionalProject } from '@/types/regional-project';

class RegionalProjectService {
  // Project Methods
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

  // Contract Methods
  async getAllContracts() {
    const response = await axiosInstance.get('/api/RegionalProject/Contract');
    return response.data as Contract[];
  }

  async getContractById(id: string) {
    const response = await axiosInstance.get(`/api/RegionalProject/Contract/${id}`);
    return response.data as Contract;
  }

  async getContractsByProjectId(projectId: string) {
    const response = await axiosInstance.get(`/api/RegionalProject/Contract/Project/${projectId}`);
    return response.data as Contract[];
  }

  async createContract(contract: Partial<Contract>) {
    const response = await axiosInstance.post('/api/RegionalProject/Contract', contract);
    return response.data as Contract;
  }

  async updateContract(id: string, contract: Partial<Contract>) {
    const response = await axiosInstance.put(`/api/RegionalProject/Contract/${id}`, contract);
    return response.data as Contract;
  }

  async deleteContract(id: string) {
    return await axiosInstance.delete(`/api/RegionalProject/Contract/${id}`);
  }

  // Procedure Methods
  async getAllProcedures() {
    const response = await axiosInstance.get('/api/RegionalProject/Procedure');
    return response.data as Procedure[];
  }

  async getProceduresByContractId(contractId: string) {
    const response = await axiosInstance.get(
      `/api/RegionalProject/Procedure/Contract/${contractId}`
    );
    return response.data as Procedure[];
  }

  async createProcedure(procedure: Partial<Procedure>) {
    const response = await axiosInstance.post('/api/RegionalProject/Procedure', procedure);
    return response.data as Procedure;
  }

  async updateProcedure(id: string, procedure: Partial<Procedure>) {
    const response = await axiosInstance.put(`/api/RegionalProject/Procedure/${id}`, procedure);
    return response.data as Procedure;
  }

  async deleteProcedure(id: string) {
    return await axiosInstance.delete(`/api/RegionalProject/Procedure/${id}`);
  }
}

export const regionalProjectService = new RegionalProjectService();
