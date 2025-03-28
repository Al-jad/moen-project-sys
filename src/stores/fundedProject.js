import axiosInstance from '@/plugins/axios';
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
  beneficiaryEntities: [],
  grantingEntity: '',
  fundingType: 1,
  cost: null,
  actualStartDate: null,
  isGovernment: false,
  projectObjectives: '',
  duration: 0,
  durationType: 'weeks',
  periodType: 1,
  components: [],
  isSaving: false,
  hasUnsavedChanges: false,
  latitude: '',
  longitude: '',
  financialAchievement: 0,
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
        // Ensure beneficiaryEntities is properly formatted for the API
        let beneficiaryEntitiesData = form.value.beneficiaryEntities;

        // Make sure it's an array
        if (!Array.isArray(beneficiaryEntitiesData)) {
          beneficiaryEntitiesData = beneficiaryEntitiesData ? [beneficiaryEntitiesData] : [];
        }

        // If it contains objects with value property (from CustomMultiSelect), extract the values
        if (beneficiaryEntitiesData.length > 0 && typeof beneficiaryEntitiesData[0] === 'object') {
          beneficiaryEntitiesData = beneficiaryEntitiesData.map((b) => b.value || b.id || b);
        }

        // Ensure isGovernment is properly set as a boolean
        const isGovernment =
          form.value.isGovernment === true ||
          form.value.isGovernment === 'true' ||
          form.value.isGovernment === 1;

        console.log('Saving project with isGovernment:', isGovernment);

        const projectData = {
          fundingType: form.value.fundingType,
          periodType: form.value.periodType,
          duration: parseInt(form.value.duration) || 0,
          name: form.value.name,
          isGovernment: isGovernment, // Use the properly converted boolean
          executingDepartment: form.value.executingDepartment,
          implementingEntity: form.value.implementingEntity,
          grantingEntity: form.value.grantingEntity,
          lng: form.value.longitude ? parseFloat(form.value.longitude) : 0,
          lat: form.value.latitude ? parseFloat(form.value.latitude) : 0,
          beneficiaryEntities: beneficiaryEntitiesData,
          projectStatus: form.value.projectStatus || 1,
          cost: parseFloat(form.value.cost) || 0,
          actualStartDate: form.value.actualStartDate,
          projectObjectives: form.value.projectObjectives || '',
          financialAchievement: Number(form.value.financialAchievement) || 0,
        };

        const response = await projectService.createProject(projectData);

        // Make sure to update the form with the response data INCLUDING isGovernment
        if (response.data) {
          form.value = {
            ...form.value,
            ...response.data,
            isGovernment: Boolean(response.data.isGovernment),
          };
          console.log('Updated form after save with isGovernment:', form.value.isGovernment);
        }

        form.value.hasUnsavedChanges = false;
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Detailed error saving project:', error);
        throw error;
      } finally {
        form.value.isSaving = false;
      }
    };

    const updateProjectComponents = async (projectId, components) => {
      isSaving.value = true;
      try {
        const componentsData = JSON.parse(JSON.stringify(components));

        const response = await axiosInstance.post(`/api/Component/${projectId}`, {
          components: componentsData,
        });

        if (!response.ok) {
          throw new Error('Failed to update components');
        }

        const data = await response.json();
        isSaving.value = false;
        return {
          success: true,
          data: data,
        };
      } catch (error) {
        isSaving.value = false;
        throw error;
      }
    };

    const addProjectComponent = async (projectId, component) => {
      isSaving.value = true;
      try {
        const payload = {
          projectId: projectId,
          name: component.name || '',
          targetPercentage: component.targetPercentage || 0,
        };

        const response = await axiosInstance.post('/api/Component', payload);

        if (response.status >= 400) {
          throw new Error('Failed to add component');
        }

        isSaving.value = false;
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        isSaving.value = false;
        throw error;
      }
    };

    const updateProjectComponent = async (projectId, componentId, component) => {
      isSaving.value = true;
      try {
        const payload = {
          projectId: projectId,
          name: component.name || '',
          targetPercentage: component.targetPercentage || 0,
        };

        const response = await axiosInstance.put(`/api/Component/${componentId}`, payload);

        if (response.status >= 400) {
          throw new Error('Failed to update component');
        }

        isSaving.value = false;
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        isSaving.value = false;
        throw error;
      }
    };

    const createProjectActivity = async (componentId, activity) => {
      isSaving.value = true;
      try {
        console.log('Creating activity for component ID:', componentId, 'with data:', activity);

        const payload = {
          componentId: componentId,
          name: activity.name || '',
          targetPercentage: activity.targetPercentage || 0,
          notes: activity.notes || '',
          selectedPeriods: activity.selectedPeriods || [],
          periodType: activity.periodType || 1,
        };

        const response = await axiosInstance.post('/api/Activity', payload);

        console.log('API response for activity creation:', response);

        isSaving.value = false;
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error('Error in createProjectActivity:', error);
        isSaving.value = false;
        throw error;
      }
    };

    const updateProjectActivity = async (activityId, activity) => {
      isSaving.value = true;
      try {
        console.log('Updating activity ID:', activityId, 'with data:', activity);

        const payload = {
          componentId: activity.componentId,
          name: activity.name || '',
          targetPercentage: activity.targetPercentage || 0,
          notes: activity.notes || '',
          selectedPeriods: activity.selectedPeriods || [],
        };

        const response = await axiosInstance.put(`/api/Activity/${activityId}`, payload);

        console.log('API response for activity update:', response);

        isSaving.value = false;
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error('Error in updateProjectActivity:', error);
        isSaving.value = false;
        throw error;
      }
    };

    const deleteProjectActivity = async (activityId) => {
      isSaving.value = true;
      try {
        console.log('Deleting activity ID:', activityId);

        const response = await axiosInstance.delete(`/api/Activity/${activityId}`);

        console.log('API response for activity deletion:', response);

        isSaving.value = false;
        return {
          success: true,
        };
      } catch (error) {
        console.error('Error in deleteProjectActivity:', error);
        isSaving.value = false;
        throw error;
      }
    };

    const getProject = async (id) => {
      try {
        const response = await axiosInstance.get(`/api/projects/${id}`);
        console.log('Raw API response for project:', response.data);

        if (response.data) {
          // Force convert isGovernment to boolean
          const isGovernment =
            response.data.isGovernment === true ||
            response.data.isGovernment === 'true' ||
            response.data.isGovernment === 1;

          console.log(
            'API isGovernment value:',
            response.data.isGovernment,
            typeof response.data.isGovernment
          );
          console.log('Converted isGovernment value:', isGovernment);

          // Update the form
          form.value = {
            ...response.data,
            isGovernment: isGovernment,
          };

          console.log('Store form updated with isGovernment:', form.value.isGovernment);
          return form.value;
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
    };

    const loadProject = async (id) => {
      try {
        console.log('Loading project with ID:', id);
        const response = await projectService.getProject(id);

        console.log('API response for project:', response.data);

        if (response.data) {
          // Ensure isGovernment is properly converted to boolean
          const isGovernment =
            response.data.isGovernment === true ||
            response.data.isGovernment === 'true' ||
            response.data.isGovernment === 1;

          console.log('API isGovernment:', response.data.isGovernment);
          console.log('Converted isGovernment:', isGovernment);

          // Update form with all project data
          form.value = {
            ...defaultForm,
            ...response.data,
            isGovernment: isGovernment, // Use the properly converted value
          };

          console.log('Form updated with isGovernment:', form.value.isGovernment);
          return form.value;
        }
      } catch (error) {
        console.error('Error loading project:', error);
        throw error;
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
      updateProjectComponents,
      addProjectComponent,
      updateProjectComponent,
      createProjectActivity,
      updateProjectActivity,
      deleteProjectActivity,
      getProject,
      loadProject,
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
