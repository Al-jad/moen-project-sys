// Units & Formats
export const UNITS = {
  CURRENCY: 'د.ع',
  PERCENTAGE: '%',
  DAY: 'يوم',
  MONTH: 'شهر',
  YEAR: 'سنة'
}

// Common Options
export const PROJECT_STATUSES = [
  { value: 'ongoing', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'منجز' },
  { value: 'stopped', label: 'متوقف' }
]

export const DURATION_TYPES = [
  { value: 'days', label: UNITS.DAY },
  { value: 'months', label: UNITS.MONTH },
  { value: 'years', label: UNITS.YEAR }
]

// Form Defaults
export const DEFAULT_FORM = {
  projectName: '',
  plan: '',
  projectGoal: '',
  beneficiary: '',
  duration: '',
  durationType: 'days'
}

// API Routes
export const API = {
  PROJECTS: '/api/projects',
  CONTRACTS: '/api/contracts'
}