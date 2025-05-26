import axiosInstance from '../plugins/axios';
import type {
  Contract,
  CreateContractRequest,
  CreateProcedureRequest,
  CreateRegionalProjectRequest,
  Procedure,
  QueryParams,
  RegionalProject,
  ServiceResponse,
  UpdateContractRequest,
  UpdateProcedureRequest,
  UpdateRegionalProjectRequest,
} from '../types';

class RegionalProjectService {
  // Regional Project CRUD Operations
  async getAllRegionalProjects(params?: QueryParams): ServiceResponse<RegionalProject[]> {
    const response = await axiosInstance.get('/api/RegionalProject', { params });
    return response;
  }

  async getRegionalProjectById(id: number): ServiceResponse<RegionalProject> {
    const response = await axiosInstance.get(`/api/RegionalProject/${id}`);
    return response;
  }

  async createRegionalProject(
    projectData: CreateRegionalProjectRequest
  ): ServiceResponse<RegionalProject> {
    const response = await axiosInstance.post('/api/RegionalProject', projectData);
    return response;
  }

  async updateRegionalProject(
    id: number,
    projectData: UpdateRegionalProjectRequest
  ): ServiceResponse<RegionalProject> {
    const response = await axiosInstance.put(`/api/RegionalProject/${id}`, projectData);
    return response;
  }

  async deleteRegionalProject(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/RegionalProject/${id}`);
    return response;
  }

  // Contract CRUD Operations
  async getAllContracts(params?: QueryParams): ServiceResponse<Contract[]> {
    const response = await axiosInstance.get('/api/RegionalProject/Contract', { params });
    return response;
  }

  async getContractById(id: number): ServiceResponse<Contract> {
    const response = await axiosInstance.get(`/api/RegionalProject/Contract/${id}`);
    return response;
  }

  async getContractsByProjectId(projectId: number): ServiceResponse<Contract[]> {
    const response = await axiosInstance.get(`/api/RegionalProject/Contract/Project/${projectId}`);
    return response;
  }

  async createContract(contractData: CreateContractRequest): ServiceResponse<Contract> {
    const response = await axiosInstance.post('/api/RegionalProject/Contract', contractData);
    return response;
  }

  async updateContract(id: number, contractData: UpdateContractRequest): ServiceResponse<Contract> {
    const response = await axiosInstance.put(`/api/RegionalProject/Contract/${id}`, contractData);
    return response;
  }

  async deleteContract(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/RegionalProject/Contract/${id}`);
    return response;
  }

  // Procedure CRUD Operations
  async getAllProcedures(contractId?: number): ServiceResponse<Procedure[]> {
    const params = contractId ? { contractId } : {};
    const response = await axiosInstance.get('/api/RegionalProject/Procedure', { params });
    return response;
  }

  async getProcedureById(id: number): ServiceResponse<Procedure> {
    const response = await axiosInstance.get(`/api/RegionalProject/Procedure/${id}`);
    return response;
  }

  async createProcedure(procedureData: CreateProcedureRequest): ServiceResponse<Procedure> {
    const response = await axiosInstance.post('/api/RegionalProject/Procedure', procedureData);
    return response;
  }

  async updateProcedure(
    id: number,
    procedureData: UpdateProcedureRequest
  ): ServiceResponse<Procedure> {
    const response = await axiosInstance.put(`/api/RegionalProject/Procedure/${id}`, procedureData);
    return response;
  }

  async deleteProcedure(id: number): ServiceResponse<void> {
    const response = await axiosInstance.delete(`/api/RegionalProject/Procedure/${id}`);
    return response;
  }

  // Utility Methods
  async searchRegionalProjects(searchTerm: string): ServiceResponse<RegionalProject[]> {
    const response = await axiosInstance.get('/api/RegionalProject', {
      params: { search: searchTerm },
    });
    return response;
  }

  async getRegionalProjectsByStatus(status: number): ServiceResponse<RegionalProject[]> {
    const response = await axiosInstance.get('/api/RegionalProject', {
      params: { status },
    });
    return response;
  }

  async getRegionalProjectStatistics(): ServiceResponse<{
    total: number;
    inProgress: number;
    completed: number;
    delayed: number;
    cancelled: number;
  }> {
    const response = await axiosInstance.get('/api/RegionalProject/statistics');
    return response;
  }
}

export const regionalProjectService = new RegionalProjectService();
export default regionalProjectService;
