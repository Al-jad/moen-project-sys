import projectService from '@/services/projectService';
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
  latitude: '',
  longitude: '',
};

export const useFundedProjectStore = defineStore(
  'fundedProject',
  () => {
    const form = ref(deepClone(defaultForm));

    const totalPeriods = computed(() => {
      if (!form.value.duration) return 0;
      const duration = parseInt(form.value.duration) || 0;
      if (form.value.durationType === 'weeks') {
        return form.value.periodType === 1 ? duration : Math.ceil(duration / 4);
      } else if (form.value.durationType === 'months') {
        return form.value.periodType === 1 ? duration * 4 : duration;
      }
      return 0;
    });

    const isSaving = ref(false);
    const hasUnsavedChanges = ref(false);

    const initializeForm = () => {
      form.value = deepClone(defaultForm);
    };

    const updateForm = (newForm) => {
      const oldTotalPeriods = totalPeriods.value;
      form.value = deepClone(newForm);
      hasUnsavedChanges.value = true;
      if (oldTotalPeriods !== totalPeriods.value) {
        updateActivityPeriods();
      }
    };

    const updateActivityPeriods = () => {
      const totalPeriods = totalPeriods.value;
      form.value.components = form.value.components.map((component) => ({
        ...component,
        activities: component.activities.map((activity) => ({
          ...activity,
          weeks: activity.weeks ? activity.weeks.filter((week) => week <= totalPeriods) : [],
        })),
      }));
    };

    const addComponent = () => {
      if (!form.value.components) {
        form.value.components = [];
      }
      const newComponent = {
        name: '',
        totalTarget: 0,
        activities: [],
      };
      form.value.components.push(newComponent);
      hasUnsavedChanges.value = true;
    };

    const removeComponent = (index) => {
      form.value.components.splice(index, 1);
      hasUnsavedChanges.value = true;
    };

    const addActivity = (componentIndex) => {
      const newActivity = {
        name: '',
        totalTarget: null,
        notes: '',
        weeks: [],
      };
      if (!form.value.components[componentIndex].activities) {
        form.value.components[componentIndex].activities = [];
      }
      form.value.components[componentIndex].activities.push(newActivity);
      hasUnsavedChanges.value = true;
    };

    const removeActivity = (componentIndex, activityIndex) => {
      form.value.components[componentIndex].activities.splice(activityIndex, 1);
      hasUnsavedChanges.value = true;
    };

    const toggleActivityWeek = (activity, period) => {
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
      hasUnsavedChanges.value = true;
    };

    const clearForm = () => {
      form.value = deepClone(defaultForm);
      hasUnsavedChanges.value = false;
    };

    const saveProject = async () => {
      form.value.isSaving = true;

      try {
        const projectData = {
          fundingType: form.value.fundingType,
          periodType: form.value.periodType,
          duration: parseInt(form.value.duration) || 0,
          name: form.value.name,
          executingDepartment: form.value.executingDepartment,
          implementingEntity: form.value.implementingEntity,
          grantingEntity: form.value.grantingEntity,
          lng: form.value.longitude ? parseFloat(form.value.longitude) : 0,
          lat: form.value.latitude ? parseFloat(form.value.latitude) : 0,
          beneficiaryEntities: Array.isArray(form.value.beneficiaryEntities)
            ? form.value.beneficiaryEntities.filter(
                (entity) => entity && entity.trim && entity.trim() !== ''
              )
            : [],
          projectStatus: 1,
          cost: parseFloat(form.value.cost) || 0,
          actualStartDate: form.value.actualStartDate,
          projectObjectives: form.value.projectObjectives || '',
        };

        const response = await projectService.createProject(projectData);

        form.value.hasUnsavedChanges = false;
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Detailed error saving project:', error);
        throw error;
      } finally {
        form.value.isSaving = false;
      }
    };

    return {
      form,
      totalPeriods,
      isSaving,
      hasUnsavedChanges,
      initializeForm,
      updateForm,
      updateActivityPeriods,
      addComponent,
      removeComponent,
      addActivity,
      removeActivity,
      toggleActivityWeek,
      clearForm,
      saveProject,
    };
  },
  {
    persist: {
      key: 'funded-project',
      storage: localStorage,
      paths: ['form'],
    },
  }
);
