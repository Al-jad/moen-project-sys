import axiosInstance from '../plugins/axios';
import type {
  Beneficiary,
  CreateBeneficiaryRequest,
  QueryParams,
  ServiceResponse,
  UpdateBeneficiaryRequest,
} from '../types';

class BeneficiaryService {
  // Beneficiary CRUD Operations
  async getAllBeneficiaries(params?: QueryParams): ServiceResponse<Beneficiary[]> {
    const response = await axiosInstance.get('/beneficiaries', { params });
    return response;
  }

  async getBeneficiaryById(id: string): ServiceResponse<Beneficiary> {
    const response = await axiosInstance.get(`/beneficiaries/${id}`);
    return response;
  }

  async createBeneficiary(beneficiaryData: CreateBeneficiaryRequest): ServiceResponse<Beneficiary> {
    const response = await axiosInstance.post('/beneficiaries', beneficiaryData);
    return response;
  }

  async updateBeneficiary(
    id: string,
    beneficiaryData: UpdateBeneficiaryRequest
  ): ServiceResponse<Beneficiary> {
    const response = await axiosInstance.put(`/beneficiaries/${id}`, beneficiaryData);
    return response;
  }

  async deleteBeneficiary(id: string): ServiceResponse<void> {
    const response = await axiosInstance.delete(
      `https://moenapi.idara-iq.com/beneficiaries?beneficiaryId=${id}`
    );
    return response;
  }

  // Utility Methods
  async searchBeneficiaries(searchTerm: string): ServiceResponse<Beneficiary[]> {
    const response = await axiosInstance.get('/beneficiaries', {
      params: { search: searchTerm },
    });
    return response;
  }

  async getBeneficiariesByLocation(location: string): ServiceResponse<Beneficiary[]> {
    const response = await axiosInstance.get('/beneficiaries', {
      params: { location },
    });
    return response;
  }

  async getBeneficiariesByReferenceEntity(referenceEntity: string): ServiceResponse<Beneficiary[]> {
    const response = await axiosInstance.get('/beneficiaries', {
      params: { referenceEntity },
    });
    return response;
  }
}

export const beneficiaryService = new BeneficiaryService();
export default beneficiaryService;
