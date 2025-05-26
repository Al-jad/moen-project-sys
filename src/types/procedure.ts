export interface Procedure {
  id: number;
  contractId: number;
  name: string;
  weight: number;
  duration: number;
  startDate?: string;
  endDate?: string;
  plannedCompletionPercentage: number;
  actualCompletionPercentage: number;
  technicalDeviation: number;
  plannedFinancialProgress: number;
  actualFinancialProgress: number;
  calculatedPlannedCompletionPercentage?: number;
  calculatedActualCompletionPercentage?: number;
  calculatedTechnicalDeviation?: number;
  calculatedPlannedFinancialProgress?: number;
  calculatedActualFinancialProgress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProcedureRequest {
  contractId: number;
  name: string;
  weight: number;
  duration: number;
  startDate?: string;
  endDate?: string;
  plannedCompletionPercentage: number;
  actualCompletionPercentage: number;
  technicalDeviation: number;
  plannedFinancialProgress: number;
  actualFinancialProgress: number;
  calculatedPlannedCompletionPercentage?: number;
  calculatedActualCompletionPercentage?: number;
  calculatedTechnicalDeviation?: number;
  calculatedPlannedFinancialProgress?: number;
  calculatedActualFinancialProgress?: number;
}

export interface UpdateProcedureRequest extends Partial<CreateProcedureRequest> {
  id: number;
}
