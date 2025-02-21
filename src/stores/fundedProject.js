import axiosInstance from '@/plugins/axios';
import { defineStore } from 'pinia';

// Simple deep clone function
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, deepClone(value)]));
};

const defaultForm = {
  projectName: '',
  executingDepartment: '',
  executingEntity: '',
  beneficiaries: [],
  fundingType: '',
  totalCost: '',
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
    form: deepClone(defaultForm),
    isSaving: false,
    hasUnsavedChanges: false,
  }),

  getters: {
    totalPeriods: (state) => {
      if (!state.form.duration) return 0;

      const duration = parseInt(state.form.duration) || 0;

      if (state.form.durationType === 'weeks') {
        return state.form.periodType === 'weekly' ? duration : Math.ceil(duration / 4);
      } else if (state.form.durationType === 'months') {
        return state.form.periodType === 'weekly' ? duration * 4 : duration;
      }
      return 0;
    },
  },

  actions: {
    initializeForm() {
      if (Object.keys(this.form).length === 0) {
        this.form = deepClone(defaultForm);
      }
    },

    updateForm(newForm) {
      const oldTotalPeriods = this.totalPeriods;
      this.form = deepClone(newForm);
      this.hasUnsavedChanges = true;

      // Only update weeks if total periods has changed
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
        const projectData = {
          name: this.form.projectName,
          executingDepartment: this.form.executingDepartment,
          executingEntity: this.form.executingEntity,
          beneficiaries: this.form.beneficiaries,
          fundingType: this.form.fundingType,
          totalCost: parseFloat(this.form.totalCost) || 0,
          actualStartDate: this.form.actualStartDate,
          projectGoal: this.form.projectGoal,
          duration: parseInt(this.form.duration) || 0,
          durationType: this.form.durationType,
          periodType: this.form.periodType,
        };

        const projectResponse = await axiosInstance.post('/project', projectData);
        const components = [];
        for (const component of this.form.components) {
          const componentData = {
            projectId: projectResponse.data.id,
            name: component.name,
            targetPercentage: parseFloat(component.totalTarget) || 0,
          };
          const componentResponse = await axiosInstance.post('/component', componentData);
          components.push({
            ...componentResponse.data,
            activities: component.activities,
          });
        }

        // 3. Create activities for each component
        for (const component of components) {
          for (const activity of component.activities) {
            try {
              const activityData = {
                componentId: component.id,
                name: activity.name,
                targetPercentage: parseFloat(activity.totalTarget) || 0,
                notes: activity.notes || '',
                selectedPeriods: activity.weeks || [],
              };

              console.log('Creating activity...', activityData);
              const activityResponse = await axiosInstance.post('/activity', activityData);
              console.log('Activity created:', activityResponse.data);
            } catch (activityError) {
              console.error('Error creating activity:', {
                activity: activity.name,
                error: activityError.response?.data || activityError.message,
              });
              throw new Error(
                `Failed to create activity "${activity.name}": ${activityError.message}`
              );
            }
          }
        }

        this.clearForm();
        return {
          success: true,
          message: 'Project created successfully',
        };
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });

        // If we have a project created but components/activities failed, we should handle cleanup
        // TODO: Implement rollback mechanism if needed

        return {
          success: false,
          error: error.response?.data?.message || error.message || 'An error occurred while saving',
          details: error.response?.data,
        };
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
