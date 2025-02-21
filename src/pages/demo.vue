<template>
  <DefaultLayout>
    <div class="p-6">
      <h1 class="mb-6 text-2xl font-bold">API Demo</h1>

      <!-- Project Form -->
      <div class="mb-6 max-w-md rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">Create Project</h2>
        <div class="space-y-4">
          <div>
            <label class="mb-1 block font-medium">Project Name</label>
            <input v-model="projectName" class="w-full rounded border p-2" />
          </div>
          <div>
            <label class="mb-1 block font-medium">Department</label>
            <input v-model="executingDepartment" class="w-full rounded border p-2" />
          </div>
          <button
            @click="createProject"
            class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">API Response</h2>
        <pre class="rounded bg-gray-100 p-4">{{ JSON.stringify(response, null, 2) }}</pre>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axios from 'axios';
  import { ref } from 'vue';

  const projectName = ref('');
  const executingDepartment = ref('');
  const response = ref(null);

  // Create a custom axios instance with base URL and headers
  const api = axios.create({
    baseURL: 'https://pmsapi.alfakharco.com/api',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Add any required authorization headers here
      // 'Authorization': 'Bearer your-token'
    },
    // Enable CORS
    withCredentials: true,
  });

  const createProject = async () => {
    try {
      const projectData = {
        name: projectName.value,
        executingDepartment: executingDepartment.value,
        executingEntity: 'Demo Entity',
        beneficiaries: ['Demo Beneficiary'],
        fundingType: 'Demo Funding',
        totalCost: 1000,
        actualStartDate: new Date().toISOString(),
        projectGoal: 'Demo Goal',
        duration: 6,
        durationType: 'months',
        periodType: 'weekly',
      };

      const res = await api.post('/project', projectData);
      response.value = res.data;

      // Clear form on success
      if (res.data.success) {
        projectName.value = '';
        executingDepartment.value = '';
      }
    } catch (error) {
      console.error('API Error:', error);
      response.value = {
        error: error.message,
        details: error.response?.data || 'No additional details',
      };
    }
  };
</script>

<style scoped>
  /* Add any custom styles here */
</style>
