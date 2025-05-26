export interface Beneficiary {
  id: string;
  name: string;
  referenceEntity: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  referenceEntity?: string;
  location?: string;
}

export interface UpdateBeneficiaryRequest extends Partial<CreateBeneficiaryRequest> {
  id: string;
}

export interface UpdateBeneficiaryNameRequest {
  name: string;
}
