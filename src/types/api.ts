// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Beneficiary Types
export interface Beneficiary {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  referenceEntity?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
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
  id: number;
}

export interface UpdateBeneficiaryNameRequest {
  name: string;
}

// Regional Project Types
export interface RegionalProject {
  id: number;
  name: string;
  directorate?: string;
  goals?: string;
  sustainableDevelopment?: string;
  beneficiaryEntities?: number[];
  supportingEntities?: string[];
  address?: string;
  duration: number;
  plannedStartDate?: string;
  actualStartDate?: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  cumulativeExpenditure?: string;
  cumulativeFinancialProgress?: number;
  calculatedCumulativeFinancialProgress?: number;
  projectStatus: number;
  notes?: string;
  lng: number;
  lat: number;
  cost: number;
  isGovernment: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRegionalProjectRequest {
  name: string;
  directorate?: string;
  goals?: string;
  sustainableDevelopment?: string;
  beneficiaryEntities?: number[];
  supportingEntities?: string[];
  address?: string;
  duration: number;
  plannedStartDate?: string;
  actualStartDate?: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  cumulativeExpenditure?: string;
  cumulativeFinancialProgress?: number;
  calculatedCumulativeFinancialProgress?: number;
  projectStatus: number;
  notes?: string;
  lng: number;
  lat: number;
  cost: number;
  isGovernment: boolean;
}

export interface UpdateRegionalProjectRequest extends Partial<CreateRegionalProjectRequest> {
  id: number;
}

// Contract Types (for Regional Projects)
export interface Contract {
  id: number;
  name: string;
  projectId: number;
  executingDepartment: string;
  cost: number;
  referralDate?: string;
  signingDate?: string;
  contractNumber?: string;
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
  contractNumber?: string;
}

export interface UpdateContractRequest extends Partial<CreateContractRequest> {
  id: number;
}

// Procedure Types (for Contracts)
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

// Funded Project Types
export interface FundedProject {
  id: number;
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
  projectStatus: number;
  lat: number;
  lng: number;
  isGovernment: boolean;
  financialAchievement: number;
  components?: Component[];
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
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

// Component Types (for Funded Projects)
export interface Component {
  id: number;
  projectId: number;
  name: string;
  targetPercentage: number;
  activities?: Activity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComponentRequest {
  projectId: number;
  name: string;
  targetPercentage: number;
}

export interface UpdateComponentRequest extends Partial<CreateComponentRequest> {
  id: number;
}

// Activity Types (for Components)
export interface Activity {
  id: number;
  componentId: number;
  name: string;
  targetPercentage: number;
  notes?: string;
  selectedPeriods: number[];
  periodType?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityRequest {
  componentId: number;
  name: string;
  targetPercentage: number;
  notes?: string;
  selectedPeriods: number[];
  periodType?: number;
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  id: number;
}

// Attachment Types
export interface Attachment {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttachmentRequest {
  projectId: number;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface UpdateAttachmentRequest extends Partial<CreateAttachmentRequest> {
  id: number;
}

// Legacy Project Types (keeping for backward compatibility)
export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  projectTypeId?: number;
  beneficiaryId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  projectTypeId?: number;
  beneficiaryId?: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
}

// Project Type Types
export interface ProjectType {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectTypeRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProjectTypeRequest extends Partial<CreateProjectTypeRequest> {
  id: number;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  id: number;
  isActive?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// Action Audit Types (for History Log)
export interface ActionAudit {
  id: number;
  tableName: string;
  action: 'create' | 'update' | 'delete';
  recordId: number;
  userId?: number;
  userName?: string;
  changes?: any;
  timestamp: string;
  ipAddress?: string;
}

// Common Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Service Response Type
export type ServiceResponse<T> = Promise<ApiResponse<T>>;

// Project Status Enums (for both project types)
export enum FundedProjectStatus {
  CANCELLED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  DELAYED = 3,
}

export enum RegionalProjectStatus {
  CANCELLED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  DELAYED = 3,
}

// Funding Types
export enum FundingType {
  GRANT = 1,
  LOAN = 2,
  MIXED = 3,
}

// Period Types
export enum PeriodType {
  WEEKLY = 1,
  MONTHLY = 2,
}
