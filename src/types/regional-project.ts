import type { Activity } from './activity';
import type { Component } from './component';
import type { Procedure } from './procedure';

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
  components?: Component[];
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

export enum RegionalProjectStatus {
  CANCELLED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  DELAYED = 3,
}

export interface Beneficiary {
  id: string;
  name: string;
}

export type { Activity, Component, Procedure };
