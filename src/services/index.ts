// Export all services
export * from './authService';
export { beneficiaryService } from './beneficiaryService';
export { projectService } from './projectService';
export {
  ProjectType,
  determineFundingType,
  getProjectTypeClass,
  getProjectTypeText,
  projectTypeService,
} from './projectTypeService';
export { userService } from './userService';

// Export base service for extending
export { BaseApiService } from './base/BaseApiService';

// Export axios instances
export { API_CONFIG, default as axiosInstance, fileUploadInstance } from '@/plugins/axios';

// Export types
export type * from '@/types/api';
