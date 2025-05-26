import { CURRENCY_CONVERSION, UNITS } from '../constants';

export const formatLargeNumber = (value: number): string => {
  if (!value) return '0';

  const trillion = 1000000000000;
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;

  const absValue = Math.abs(value);

  if (absValue >= trillion) {
    return `${(value / trillion).toFixed(1)} ترليون`;
  } else if (absValue >= billion) {
    return `${(value / billion).toFixed(1)} مليار`;
  } else if (absValue >= million) {
    return `${(value / million).toFixed(1)} مليون`;
  } else if (absValue >= thousand) {
    return `${(value / thousand).toFixed(1)} الف`;
  }

  return value.toString();
};

export const convertCurrency = (
  value: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (!value) return 0;
  if (fromCurrency === toCurrency) return value;

  let convertedValue;
  if (fromCurrency === 'USD') {
    convertedValue = value * CURRENCY_CONVERSION.USD_TO_IQD;
  } else {
    convertedValue = value * CURRENCY_CONVERSION.IQD_TO_USD;
  }

  const precision = CURRENCY_CONVERSION.PRECISION[toCurrency as keyof typeof CURRENCY_CONVERSION.PRECISION];
  return Number(convertedValue.toFixed(precision));
};

export const formatCost = (value: number, selectedCurrency: string): string => {
  if (!value) return '0';
  const convertedValue = convertCurrency(value, 'IQD', selectedCurrency);

  const formattedNumber = formatLargeNumber(convertedValue);
  return `${formattedNumber} ${selectedCurrency === 'USD' ? UNITS.CURRENCY.USD : UNITS.CURRENCY.IQD}`;
};

export const formatTotalCost = (projects: any[], selectedCurrency: string): string => {
  const total = projects.reduce((sum, project) => {
    return sum + (Number(project.cost) || 0);
  }, 0);
  return formatCost(total, selectedCurrency);
};
