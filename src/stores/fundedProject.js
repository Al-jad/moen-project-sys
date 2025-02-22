import axiosInstance from '@/plugins/axios';
import { defineStore } from 'pinia';

// Simple deep clone function
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, deepClone(value)]));
};

const defaultForm = {
  name: '',
  executingDepartment: '',
  implementingEntity: '',
  beneficiaryEntities: '',
  grantingEntity: '',
  fundingType: 1,
  cost: null,
  actualStartDate: null,
  projectObjectives: '',
  duration: 0,
  durationType: 'weeks',
  periodType: 1,
  components: [],
  isSaving: false,
  hasUnsavedChanges: false,
};

export const useFundedProjectStore = defineStore('fundedProject', {
  state: () => ({
    form: deepClone(defaultForm),
  }),

  getters: {
    totalPeriods: (state) => {
      if (!state.form.duration) return 0;

      const duration = parseInt(state.form.duration) || 0;

      if (state.form.durationType === 'weeks') {
        return state.form.periodType === 1 ? duration : Math.ceil(duration / 4);
      } else if (state.form.durationType === 'months') {
        return state.form.periodType === 1 ? duration * 4 : duration;
      }
      return 0;
    },
  },

  actions: {
    initializeForm() {
      this.form = deepClone(defaultForm);
    },

    updateForm(newForm) {
      const oldTotalPeriods = this.totalPeriods;
      this.form = deepClone(newForm);
      this.hasUnsavedChanges = true;

      if (oldTotalPeriods !== this.totalPeriods) {
        this.updateActivityPeriods();
      }
    },

    updateActivityPeriods() {
      const totalPeriods = this.totalPeriods;
      this.form.components = this.form.components.map((component) => ({
        ...component,
        activities: component.activities.map((activity) => ({
          ...activity,
          weeks: activity.weeks ? activity.weeks.filter((week) => week <= totalPeriods) : [],
        })),
      }));
    },

    addComponent() {
      if (!this.form.components) {
        this.form.components = [];
      }
      this.form.components.push({
        name: '',
        totalTarget: '',
        activities: [],
      });
      this.hasUnsavedChanges = true;
    },

    removeComponent(index) {
      this.form.components.splice(index, 1);
      this.hasUnsavedChanges = true;
    },

    addActivity(componentIndex) {
      if (!this.form.components[componentIndex].activities) {
        this.form.components[componentIndex].activities = [];
      }

      this.form.components[componentIndex].activities.push({
        name: '',
        totalTarget: '',
        weeks: [],
        notes: '',
      });
      this.hasUnsavedChanges = true;
    },

    removeActivity(componentIndex, activityIndex) {
      this.form.components[componentIndex].activities.splice(activityIndex, 1);
      this.hasUnsavedChanges = true;
    },

    toggleActivityWeek(componentIndex, activityIndex, period) {
      const activity = this.form.components[componentIndex].activities[activityIndex];
      if (!activity.weeks) {
        activity.weeks = [];
      }

      const index = activity.weeks.indexOf(period);
      if (index === -1) {
        activity.weeks.push(period);
        activity.weeks.sort((a, b) => a - b);
      } else {
        activity.weeks.splice(index, 1);
      }
      this.hasUnsavedChanges = true;
    },

    clearForm() {
      this.form = deepClone(defaultForm);
      this.hasUnsavedChanges = false;
    },

    async saveProject() {
      this.isSaving = true;
      try {
        const formattedDate = this.form.actualStartDate
          ? new Date(this.form.actualStartDate).toISOString()
          : null;

        const projectData = {
          name: this.form.name,
          executingDepartment: this.form.executingDepartment,
          implementingEntity: this.form.implementingEntity,
          beneficiaryEntities: this.form.beneficiaryEntities || '',
          grantingEntity: this.form.grantingEntity,
          fundingType: Number(this.form.fundingType),
          cost: Number(this.form.cost),
          actualStartDate: formattedDate,
          projectObjectives: this.form.projectObjectives,
          duration: Number(this.form.duration),
          durationType: this.form.durationType,
          periodType: Number(this.form.periodType),
        };

        console.log('Final payload being sent:', JSON.stringify(projectData, null, 2));

        const response = await axiosInstance.post('/project', projectData);

        console.log('API Response:', response.data);

        this.hasUnsavedChanges = false;
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error saving project:', error);
        throw error;
      } finally {
        this.isSaving = false;
      }
    },
  },

  persist: {
    key: 'funded-project',
    storage: localStorage,
    paths: ['form'],
  },
});
