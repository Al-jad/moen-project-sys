export interface Activity {
  id: number;
  name: string;
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
