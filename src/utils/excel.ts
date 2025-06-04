import * as XLSX from 'xlsx';

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  locale?: string;
}

const defaultOptions: ExportOptions = {
  fileName: 'export.xlsx',
  sheetName: 'Sheet1',
  dateFormat: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  locale: 'ar',
};

/**
 * Formats date values in the data object
 */
const formatDates = (data: any, options: ExportOptions): any => {
  if (data instanceof Date) {
    return data.toLocaleDateString(options.locale, options.dateFormat);
  }

  if (typeof data === 'string') {
    const date = new Date(data);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString(options.locale, options.dateFormat)
      : data;
  }

  return data;
};

/**
 * Recursively process data objects to format dates and handle nested structures
 */
const processData = (data: any[], options: ExportOptions): any[] => {
  return data.map((item) => {
    const processed: any = {};

    Object.entries(item).forEach(([key, value]) => {
      processed[key] = formatDates(value, options);
    });

    return processed;
  });
};

/**
 * Export data to Excel with customizable options
 * @param data Array of objects to export
 * @param options Export configuration options
 */
export const exportToExcel = (data: any[], options?: Partial<ExportOptions>): void => {
  try {
    const mergedOptions = { ...defaultOptions, ...options };
    const processedData = processData(data, mergedOptions);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(processedData, {
      header: Object.keys(processedData[0] || {}),
    });

    // Auto-adjust column widths
    const maxWidth = 50;
    const colWidths: { [key: string]: number } = {};

    processedData.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        const valueLength = String(value).length;
        colWidths[key] = Math.min(maxWidth, Math.max(colWidths[key] || 0, valueLength, key.length));
      });
    });

    ws['!cols'] = Object.values(colWidths).map((width) => ({ width }));

    XLSX.utils.book_append_sheet(wb, ws, mergedOptions.sheetName || 'Sheet1');
    XLSX.writeFile(wb, mergedOptions.fileName || 'export.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data to Excel');
  }
};
