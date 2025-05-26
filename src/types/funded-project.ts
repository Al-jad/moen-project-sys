import type { Attachment } from './attachment';
import type { Beneficiary } from './beneficiary';
import type { Component } from './component';

export interface FundedProjectComponent {
  id?: number;
  name: string;
  targetPercentage: number;
  activities?: FundedProjectActivity[];
}

export interface FundedProjectActivity {
  id?: number;
  name: string;
  description?: string;
  selectedPeriods?: number[];
}

export interface FundedProject {
  id: number;
  name: string;
  executingDepartment: string;
  implementingEntity: string;
  beneficiaries: Beneficiary[];
  grantingEntity: string;
  fundingType: number;
  cost: number;
  actualStartDate?: string;
  projectObjectives: string;
  duration: number;
  periodType: number;
  projectStatus: number;
  lat: number;
  lng: number;
  isGovernment: boolean;
  financialAchievement: number;
  components: Component[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  currency: number;
  isFunded: boolean | null;
}

export interface CreateFundedProjectRequest {
  name: string;
  executingDepartment: string;
  implementingEntity: string;
  beneficiaryEntities: number[];
  grantingEntity: string;
  fundingType: number;
  cost: number;
  actualStartDate?: string;
  projectObjectives: string;
  duration: number;
  periodType: number;
  projectStatus?: number;
  lat: number;
  lng: number;
  isGovernment: boolean;
  financialAchievement?: number;
}

export interface UpdateFundedProjectRequest extends Partial<CreateFundedProjectRequest> {
  id: number;
}

export interface FundedProjectComponentRequest {
  name: string;
  targetPercentage: number;
}

export interface FundedProjectActivityRequest {
  name: string;
  description?: string;
  selectedPeriods?: number[];
}

// UI transformed types
export interface TransformedFundedProject {
  id: string;
  title: string;
  department: string;
  status: string;
  statusVariant: string;
  progress: number;
  duration: string;
  cost: number;
  startDate: string;
  endDate: string;
  implementingEntity: string;
  beneficiaryEntities: string;
  grantingEntity: string;
  isGovernment: boolean;
  projectObjectives: string;
  components: TransformedFundedProjectComponent[];
  latitude: number | null;
  longitude: number | null;
}

export interface TransformedFundedProjectComponent {
  id?: string;
  name: string;
  targetPercentage: number;
  activities: TransformedFundedProjectActivity[];
}

export interface TransformedFundedProjectActivity {
  id?: string;
  name: string;
  description: string;
  selectedPeriods: number[];
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
