import type { Attachment } from './attachment';
import type { Beneficiary } from './beneficiary';
export interface FundedProjectComponent {
  name: string;
  targetPercentage: number;
  activities: FundedProjectActivity[];
  projectId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundedProjectActivity {
  name: string;
  targetPercentage: number;
  notes: string;
  selectedPeriods: number[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundedProject {
  fundingType: number;
  periodType: number;
  duration: number;
  name: null;
  executingDepartment: null;
  implementingEntity: null;
  grantingEntity: null;
  cost: null;
  actualStartDate: string;
  projectObjectives: null;
  lng: null;
  lat: null;
  projectStatus: number;
  isFunded: null;
  isGovernment: null;
  currency: number;
  financialAchievement: null;
  components: FundedProjectComponent[];
  attachments: Attachment[];
  beneficiaries: Beneficiary[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFundedProjectRequest {
  fundingType: number;
  periodType: number;
  duration: number;
  name: string;
  isGovernment: boolean;
  executingDepartment: string;
  implementingEntity: string;
  grantingEntity: string;
  lat: number;
  lng: number;
  beneficiaryEntities: string[];
  projectStatus: number;
  cost: number;
  actualStartDate?: string;
  projectObjectives: string;
  components: FundedProjectComponentRequest[];
}

export interface UpdateFundedProjectRequest extends Partial<CreateFundedProjectRequest> {
  id: number;
}

export interface FundedProjectComponentRequest {
  name: string;
  targetPercentage: number;
  activities: FundedProjectActivityRequest[];
}

export interface FundedProjectActivityRequest {
  name: string;
  description?: string;
  selectedPeriods?: number[];
}

export enum FundedProjectStatus {
  CANCELLED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  DELAYED = 3,
}

export enum FundingType {
  GRANT = 1,
  LOAN = 2,
  MIXED = 3,
}

export enum PeriodType {
  WEEKLY = 1,
  MONTHLY = 2,
}

export const FundedProjectStatusMap: Record<FundedProjectStatus, string> = {
  [FundedProjectStatus.CANCELLED]: 'ملغي',
  [FundedProjectStatus.IN_PROGRESS]: 'قيد التنفيذ',
  [FundedProjectStatus.COMPLETED]: 'منجز',
  [FundedProjectStatus.DELAYED]: 'متأخر',
};

export const FundedProjectStatusVariantMap: Record<FundedProjectStatus, string> = {
  [FundedProjectStatus.CANCELLED]: 'danger',
  [FundedProjectStatus.IN_PROGRESS]: 'warning',
  [FundedProjectStatus.COMPLETED]: 'success',
  [FundedProjectStatus.DELAYED]: 'secondary',
};
