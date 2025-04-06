/**
 * Project Type Constants
 */
export const ProjectType = {
  FUNDED: 'funded',
  REGIONAL: 'regional',
};

/**
 * Determines the funding type of a project based on its properties
 * @param {Object} project - The project object
 * @returns {string} - Returns 'funded' or 'regional'
 */
export const determineFundingType = (project) => {
  if (!project) return ProjectType.REGIONAL;

  // For funded projects
  if (project.isFunded === true || project.fundingType === 1) {
    return ProjectType.FUNDED;
  }

  // For regional development projects
  if (project.directorate || project.projectType || project.isFunded === false) {
    return ProjectType.REGIONAL;
  }

  // If we have components array, it's likely a funded project
  if (Array.isArray(project.components)) {
    return ProjectType.FUNDED;
  }

  // If we have sustainableDevelopment array, it's likely a regional project
  if (Array.isArray(project.sustainableDevelopment)) {
    return ProjectType.REGIONAL;
  }

  // Default based on the most reliable indicator
  return project.isFunded === true ? ProjectType.FUNDED : ProjectType.REGIONAL;
};

/**
 * Gets the display text for a project type
 * @param {string} type - The project type ('funded' or 'regional')
 * @returns {string} - Returns the display text in Arabic
 */
export const getProjectTypeText = (type) => {
  const types = {
    [ProjectType.FUNDED]: 'مشروع ممول',
    [ProjectType.REGIONAL]: 'مشروع تنمية الأقاليم',
  };
  return types[type] || 'غير معروف';
};

/**
 * Gets the CSS classes for a project type badge
 * @param {string} type - The project type ('funded' or 'regional')
 * @returns {string} - Returns the CSS classes
 */
export const getProjectTypeClass = (type) => {
  const classes = {
    [ProjectType.FUNDED]:
      'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300',
    [ProjectType.REGIONAL]: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
  };
  return classes[type] || '';
};
