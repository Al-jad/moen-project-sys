// Types
interface Units {
  CURRENCY: {
    USD: string;
    IQD: string;
  };
  PERCENTAGE: string;
  DAY: string;
  MONTH: string;
  YEAR: string;
}

interface CurrencyConversion {
  USD_TO_IQD: number;
  IQD_TO_USD: number;
  PRECISION: {
    USD: number;
    IQD: number;
  };
}

interface ProjectStatus {
  value: 'ongoing' | 'completed' | 'stopped';
  label: string;
}

interface DurationType {
  value: 'days' | 'months' | 'years';
  label: string;
}

interface DefaultForm {
  projectName: string;
  plan: string;
  projectGoal: string;
  beneficiary: string;
  duration: string;
  durationType: 'days' | 'months' | 'years';
}

interface Api {
  PROJECTS: string;
  CONTRACTS: string;
}

// Units & Formats
export const UNITS: Units = {
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
export const CURRENCY_CONVERSION: CurrencyConversion = {
  USD_TO_IQD: 1320,
  IQD_TO_USD: 1 / 1320,
  PRECISION: {
    USD: 2,
    IQD: 0,
  },
};

// Common Options
export const PROJECT_STATUSES: ProjectStatus[] = [
  { value: 'ongoing', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'منجز' },
  { value: 'stopped', label: 'متوقف' },
];

export const DURATION_TYPES: DurationType[] = [
  { value: 'days', label: UNITS.DAY },
  { value: 'months', label: UNITS.MONTH },
  { value: 'years', label: UNITS.YEAR },
];

// Form Defaults
export const DEFAULT_FORM: DefaultForm = {
  projectName: '',
  plan: '',
  projectGoal: '',
  beneficiary: '',
  duration: '',
  durationType: 'days',
};

// API Routes
export const API: Api = {
  PROJECTS: '/api/projects',
  CONTRACTS: '/api/contracts',
};
