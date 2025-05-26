/**
 * Format date to DD.MM.YYYY format in Arabic
 */
export const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Calculate end date based on start date and duration
 */
export const calculateEndDate = (
  startDate: string | Date,
  duration: number | string,
  durationType: 'weeks' | 'months' = 'months'
): string => {
  if (!startDate || !duration) return '';

  try {
    const start = new Date(startDate);
    const durationNum = parseInt(duration.toString());

    if (durationType === 'weeks') {
      start.setDate(start.getDate() + durationNum * 7);
    } else {
      start.setMonth(start.getMonth() + durationNum);
    }

    return formatDate(start);
  } catch (error) {
    console.error('Error calculating end date:', error);
    return '';
  }
};
