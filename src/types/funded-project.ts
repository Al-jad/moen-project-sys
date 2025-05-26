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
  id?: number;
  name: string;
  executingDepartment?: string;
  implementingEntity?: string;
  beneficiaryEntities?: string;
  grantingEntity?: string;
  projectObjectives?: string;
  isGovernment?: boolean;
  status: number;
  progress: number;
  duration: number;
  durationType: 'weeks' | 'months';
  cost: number;
  actualStartDate?: string;
  actualEndDate?: string;
  components: FundedProjectComponent[];
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateFundedProjectRequest extends Omit<FundedProject, 'id' | 'progress'> {}

export interface UpdateFundedProjectRequest extends Partial<CreateFundedProjectRequest> {}

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
  STUDY = 0,
  IN_PROGRESS = 1,
  STOPPED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export const FundedProjectStatusMap: Record<FundedProjectStatus, string> = {
  [FundedProjectStatus.STUDY]: 'قيد الدراسة',
  [FundedProjectStatus.IN_PROGRESS]: 'قيد التنفيذ',
  [FundedProjectStatus.STOPPED]: 'متوقف',
  [FundedProjectStatus.COMPLETED]: 'منجز',
  [FundedProjectStatus.CANCELLED]: 'ملغي',
};

export const FundedProjectStatusVariantMap: Record<FundedProjectStatus, string> = {
  [FundedProjectStatus.STUDY]: 'info',
  [FundedProjectStatus.IN_PROGRESS]: 'warning',
  [FundedProjectStatus.STOPPED]: 'secondary',
  [FundedProjectStatus.COMPLETED]: 'success',
  [FundedProjectStatus.CANCELLED]: 'danger',
};
