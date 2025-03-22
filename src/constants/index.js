// Units & Formats
export const UNITS = {
  CURRENCY: {
    USD: 'USD',
    IQD: 'د.ع',
  },
  PERCENTAGE: '%',
  DAY: 'يوم',
  MONTH: 'شهر',
  YEAR: 'سنة',
};

// Currency Conversion
export const CURRENCY_CONVERSION = {
  USD_TO_IQD: 1320,
  IQD_TO_USD: 1 / 1320,
  PRECISION: {
    USD: 2,
    IQD: 0,
  },
};

// Common Options
export const PROJECT_STATUSES = [
  { value: 'ongoing', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'منجز' },
  { value: 'stopped', label: 'متوقف' },
];

export const DURATION_TYPES = [
  { value: 'days', label: UNITS.DAY },
  { value: 'months', label: UNITS.MONTH },
  { value: 'years', label: UNITS.YEAR },
];

// Form Defaults
export const DEFAULT_FORM = {
  projectName: '',
  plan: '',
  projectGoal: '',
  beneficiary: '',
  duration: '',
  durationType: 'days',
};

// API Routes
export const API = {
  PROJECTS: '/api/projects',
  CONTRACTS: '/api/contracts',
};
