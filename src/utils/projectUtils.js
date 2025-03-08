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
  const statusInfo = statusMap[project.projectStatus] || { status: 'غير معروف', variant: 'default' };
  
  return {
    id: project.id,
    title: project.name,
    department: project.executingDepartment,
    startDate: formatDate(project.actualStartDate),
    endDate: calculateEndDate(project.actualStartDate, project.duration),
    status: statusInfo.status,
    statusVariant: statusInfo.variant,
    progress: calculateProgress(project),
    duration: project.duration.toString(),
    cost: project.cost,
    attachments: Array.isArray(project.attachments) 
      ? project.attachments.map(attachment => ({
          id: attachment.id,
          title: attachment.title || 'Untitled',
          description: attachment.description || '',
          url: attachment.url || '',
          date: formatDate(attachment.createdAt) || formatDate(new Date()),
        }))
      : [],
  };
};

export default {
  statusMap,
  formatDate,
  calculateEndDate,
  calculateProgress,
  transformProject
}; 