/**
 * Utility functions for project-related operations
 */

/**
 * Status mapping from API status codes to UI display values
 */
export const statusMap = {
  1: { status: 'منجز', variant: 'success' },
  2: { status: 'قيد الانجاز', variant: 'warning' },
  3: { status: 'متلكئ', variant: 'destructive' },
};

/**
 * Format date from ISO to DD.MM.YYYY
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString();
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Calculate end date based on start date and duration
 * @param {string} startDate - Start date in ISO format
 * @param {number} duration - Duration in months
 * @returns {string} End date in DD.MM.YYYY format
 */
export const calculateEndDate = (startDate, duration) => {
  if (!startDate) return '';
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + Number(duration));
  return formatDate(date);
};

/**
 * Calculate project progress based on components
 * @param {Object} project - Project object
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (project) => {
  if (!project.components || project.components.length === 0) return 0;
  
  // Simple calculation - can be enhanced based on actual requirements
  return Math.min(100, Math.round(
    project.components.reduce((sum, component) => sum + component.targetPercentage, 0)
  ));
};

/**
 * Transform API project to UI project format
 * @param {Object} project - Project object from API
 * @returns {Object} Transformed project for UI
 */
export const transformProject = (project) => {
  if (!project) {
    console.warn('Attempted to transform undefined project');
    return null;
  }

  try {
    // Create a base transformed project with default values
    const transformedProject = {
      id: project.id?.toString() || '',
      title: project.name || '',
      department: project.executingDepartment || '',
      status: getProjectStatus(project.status) || 'قيد التنفيذ',
      statusVariant: getStatusVariant(project.status) || 'warning',
      progress: project.progress || 0,
      duration: project.duration?.toString() || '0',
      cost: project.cost || 0,
      // Default values for dates
      startDate: '',
      endDate: '',
      // Add other fields with safe defaults
      implementingEntity: project.implementingEntity || '',
      beneficiaryEntities: project.beneficiaryEntities || '',
      grantingEntity: project.grantingEntity || '',
      fundingType: project.fundingType || 1,
      projectObjectives: project.projectObjectives || '',
      latitude: project.latitude || null,
      longitude: project.longitude || null,
    };

    // Safely format dates if they exist
    if (project.actualStartDate) {
      transformedProject.startDate = formatDate(new Date(project.actualStartDate));
    }

    if (project.actualEndDate) {
      transformedProject.endDate = formatDate(new Date(project.actualEndDate));
    } else if (project.actualStartDate && project.duration) {
      // Calculate end date if not provided
      const startDate = new Date(project.actualStartDate);
      const endDate = calculateEndDate(startDate, project.duration, project.durationType || 'weeks');
      transformedProject.endDate = formatDate(endDate);
    }

    return transformedProject;
  } catch (error) {
    console.error('Error transforming project:', error, project);
    // Return a minimal valid object to prevent UI errors
    return {
      id: project?.id?.toString() || 'error',
      title: project?.name || 'Error loading project',
      department: '',
      status: 'خطأ',
      statusVariant: 'danger',
      progress: 0,
      duration: '0',
      startDate: '',
      endDate: '',
    };
  }
};

/**
 * Maps project status to UI-friendly status text
 * @param {number|string} status - Project status code
 * @returns {string} UI-friendly status text
 */
const getProjectStatus = (status) => {
  const statusMap = {
    0: 'قيد الدراسة',
    1: 'قيد التنفيذ',
    2: 'متوقف',
    3: 'منجز',
    4: 'ملغي'
  };
  
  return statusMap[status] || 'قيد التنفيذ';
};

/**
 * Maps project status to UI variant for styling
 * @param {number|string} status - Project status code
 * @returns {string} UI variant (primary, success, warning, danger, etc.)
 */
const getStatusVariant = (status) => {
  const variantMap = {
    0: 'info',
    1: 'warning',
    2: 'secondary',
    3: 'success',
    4: 'danger'
  };
  
  return variantMap[status] || 'warning';
};

export default {
  statusMap,
  formatDate,
  calculateEndDate,
  calculateProgress,
  transformProject,
  getProjectStatus,
  getStatusVariant
}; 