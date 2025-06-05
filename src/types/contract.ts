import type { Procedure } from './procedure';

export interface Contract {
  id: number;
  name: string;
  projectId: number;
  executingDepartment: string;
  cost: number;
  referralDate: string;
  signingDate: string;
  contractNumber: number;
  procedures?: Procedure[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContractRequest {
  name: string;
  projectId: number;
  executingDepartment: string;
  cost: number;
  referralDate?: string;
  signingDate?: string;
  contractNumber: number;
}

export interface UpdateContractRequest extends Partial<CreateContractRequest> {
  id: number;
}
