import axiosInstance from '@/plugins/axios';
import { defineStore } from 'pinia';
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
      const newComponent = {
        name: '',
        totalTarget: 0,
        activities: [],
      };
      this.form.components.push(newComponent);
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
        totalTarget: 0,
        weeks: [],
        notes: '',
      });
      this.hasUnsavedChanges = true;
    },
    removeActivity(componentIndex, activityIndex) {
      this.form.components[componentIndex].activities.splice(activityIndex, 1);
      this.hasUnsavedChanges = true;
    },
    toggleActivityWeek(activity, period) {
      if (!activity.weeks) {
        activity.weeks = [];
      }
      const weekIndex = activity.weeks.indexOf(period);
      if (weekIndex === -1) {
        activity.weeks.push(period);
      } else {
        activity.weeks.splice(weekIndex, 1);
      }
      activity.weeks.sort((a, b) => a - b);
      this.hasUnsavedChanges = true;
    },
    clearForm() {
      this.form = deepClone(defaultForm);
      this.hasUnsavedChanges = false;
    },
    async saveProject() {
      this.isSaving = true;
      try {
        console.log('Starting project save...');
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
        console.log('Project data to save:', projectData);
        const projectResponse = await axiosInstance.post('/project', projectData);
        console.log('Project saved successfully:', projectResponse.data);
        console.log('Number of components:', this.form.components.length);
        if (this.form.components.length > 0 && projectResponse.data?.id) {
          console.log('Creating components for project:', projectResponse.data.id);
          const componentResults = await Promise.all(
            this.form.components.map(async (component) => {
              const componentData = {
                projectId: projectResponse.data.id,
                name: component.name || '',
                targetPercentage: Number(component.totalTarget) || 0,
              };
              console.log('Creating component:', componentData);
              const componentResponse = await axiosInstance.post('/Component', componentData);
              return {
                originalComponent: component,
                response: componentResponse.data,
              };
            })
          );
          console.log('Components created:', componentResults);
          const activityPromises = componentResults.flatMap(
            ({ originalComponent, response: componentResponse }) => {
              return originalComponent.activities.map((activity) => {
                const activityData = {
                  componentId: componentResponse.id,
                  name: activity.name || '',
                  targetPercentage: Number(activity.totalTarget) || 0,
                  notes: activity.notes || '',
                  selectedPeriods: activity.weeks || [],
                };
                console.log('Creating activity:', activityData);
                return axiosInstance.post('/Activity', activityData);
              });
            }
          );
          if (activityPromises.length > 0) {
            const activityResults = await Promise.all(activityPromises);
            console.log('Activities created:', activityResults);
          } else {
            console.log('No activities to create');
          }
        } else {
          console.log('No components to create or missing project ID');
        }
        this.hasUnsavedChanges = false;
        return { success: true, data: projectResponse.data };
      } catch (error) {
        console.error('Error in saveProject:', error);
        throw error;
      } finally {
        this.isSaving = false;
        console.log('Save process completed');
      }
    },
  },
  persist: {
    key: 'funded-project',
    storage: localStorage,
    paths: ['form'],
  },
});
