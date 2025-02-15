import { defineStore } from 'pinia';

const defaultForm = {
  projectName: '',
  executingDepartment: '',
  climateChangeDepartment: '',
  executingEntity: '',
  totalCost: '',
  beneficiaries: '',
  fundingType: '',
  internationalFunding: '',
  duration: '',
  durationType: 'months',
  periodType: 'weekly',
  actualStartDate: null,
  projectGoal: '',
  components: [
    {
      name: '',
      totalTarget: '',
      activities: [
        {
          name: '',
          totalTarget: '',
          weeks: [],
          notes: '',
        },
      ],
    },
  ],
};

export const useFundedProjectStore = defineStore('fundedProject', {
  state: () => ({
    form: { ...defaultForm },
    isSaving: false,
    hasUnsavedChanges: false,
  }),

  getters: {
    totalPeriods: (state) => {
      if (!state.form.duration) return 0;

      if (state.form.durationType === 'weeks') {
        return state.form.periodType === 'weekly'
          ? parseInt(state.form.duration)
          : Math.ceil(parseInt(state.form.duration) / 4);
      } else if (state.form.durationType === 'months') {
        return state.form.periodType === 'weekly'
          ? parseInt(state.form.duration) * 4
          : parseInt(state.form.duration);
      }
      return 0;
    },
  },

  actions: {
    initializeForm() {
      // No need to manually load from localStorage anymore
      if (Object.keys(this.form).length === 0) {
        this.form = { ...defaultForm };
      }
    },

    updateForm(newForm) {
      this.form = newForm;
      this.hasUnsavedChanges = true;

      // Clear weeks that are beyond the total periods when duration changes
      this.form.components.forEach((component) => {
        component.activities.forEach((activity) => {
          if (activity.weeks) {
            activity.weeks = activity.weeks.filter((week) => week <= this.totalPeriods);
          }
        });
      });
    },

    clearForm() {
      this.form = { ...defaultForm };
      this.hasUnsavedChanges = false;
    },

    async saveProject() {
      this.isSaving = true;
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear the form after successful save
        this.clearForm();

        return { success: true };
      } catch (error) {
        console.error('Error saving project:', error);
        return { success: false, error };
      } finally {
        this.isSaving = false;
      }
    },
  },

  persist: {
    key: 'funded-project',
    storage: localStorage,
    paths: ['form'], // Only persist the form data
  },
});
