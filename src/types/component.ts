import type { Activity } from './activity';

export interface Component {
  id: number;
  name: string;
  targetPercentage: number;
  activities?: Activity[];
}

export interface CreateComponentRequest {
  projectId: number;
  name: string;
  targetPercentage: number;
}

export interface UpdateComponentRequest extends Partial<CreateComponentRequest> {
  id: number;
}
