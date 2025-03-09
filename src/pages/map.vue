<script setup>
import { ref, onMounted, computed } from "vue";
import BackToMainButton from "@/components/BackToMainButton.vue";
import Map from "@/components/Map.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { projectService } from "@/services/projectService";

const selected = ref("all");
const projects = ref([]);
const loading = ref(true);
const error = ref(null);

// Baghdad mockup data with various statuses and locations
const mockupProjects = [
  {
    fundingType: 1,
    periodType: 1,
    duration: 36,
    name: "Baghdad Green Belt Initiative",
    executingDepartment: "Ministry of Environment",
    implementingEntity: "Baghdad Urban Planning Authority",
    grantingEntity: "UN Environment Programme",
    cost: 8500000,
    actualStartDate: "2024-05-10T08:00:00Z",
    projectObjectives: "Create green spaces and improve air quality",
    lng: 44.4275, // East Baghdad
    lat: 33.3425,
    projectStatus: 1, // In Progress
    id: 101
  },
  {
    fundingType: 2,
    periodType: 1,
    duration: 24,
    name: "Al-Rasheed Street Renovation",
    executingDepartment: "Ministry of Culture",
    implementingEntity: "Baghdad Heritage Committee",
    grantingEntity: "UNESCO",
    cost: 5200000,
    actualStartDate: "2024-03-22T08:00:00Z",
    projectObjectives: "Restore historic buildings and improve infrastructure",
    lng: 44.4061, // Central Baghdad
    lat: 33.3352,
    projectStatus: 1, // In Progress
    id: 102
  },
  {
    fundingType: 1,
    periodType: 2,
    duration: 18,
    name: "Tigris River Cleanup Campaign",
    executingDepartment: "Ministry of Water Resources",
    implementingEntity: "Baghdad Environmental Protection Agency",
    grantingEntity: "World Bank",
    cost: 3800000,
    actualStartDate: "2023-11-15T08:00:00Z",
    projectObjectives: "Reduce water pollution and restore river ecosystem",
    lng: 44.3900, // Along Tigris River
    lat: 33.3100,
    projectStatus: 2, // Completed
    id: 103
  },
  {
    fundingType: 2,
    periodType: 1,
    duration: 12,
    name: "Al-Karkh Solar Power Installation",
    executingDepartment: "Ministry of Electricity",
    implementingEntity: "Baghdad Renewable Energy Department",
    grantingEntity: "International Renewable Energy Agency",
    cost: 7500000,
    actualStartDate: "2024-01-05T08:00:00Z",
    projectObjectives: "Install solar panels in western Baghdad district",
    lng: 44.3461, // West Baghdad
    lat: 33.3252,
    projectStatus: 3, // Delayed
    id: 104
  },
  {
    fundingType: 1,
    periodType: 1,
    duration: 30,
    name: "Baghdad Metro Line Extension",
    executingDepartment: "Ministry of Transportation",
    implementingEntity: "Baghdad Public Transport Authority",
    grantingEntity: "Asian Development Bank",
    cost: 125000000,
    actualStartDate: "2023-08-20T08:00:00Z",
    projectObjectives: "Extend metro line to southern districts",
    lng: 44.3861, // South Baghdad
    lat: 33.2752,
    projectStatus: 0, // Cancelled
    id: 105
  },
  {
    fundingType: 2,
    periodType: 2,
    duration: 24,
    name: "Al-Zawraa Park Rehabilitation",
    executingDepartment: "Ministry of Youth and Sports",
    implementingEntity: "Baghdad Parks and Recreation",
    grantingEntity: "Local Government",
    cost: 4200000,
    actualStartDate: "2024-02-10T08:00:00Z",
    projectObjectives: "Renovate facilities and add recreational areas",
    lng: 44.3561, // Central-West Baghdad
    lat: 33.3352,
    projectStatus: 1, // In Progress
    id: 106
  }
];

onMounted(async () => {
  try {
    // Fetch data from the API using the project service
    const response = await projectService.getAllProjects();
    const apiProjects = response.data;
    
    // Combine API data with mockup data
    projects.value = [...apiProjects, ...mockupProjects];
    
    console.log('Projects loaded:', projects.value);
    console.log('Total projects:', projects.value.length);
    console.log('API projects:', apiProjects.length);
    console.log('Mockup projects:', mockupProjects.length);
  } catch (err) {
    console.error('Error fetching projects:', err);
    // If API fails, at least show mockup data
    projects.value = [...mockupProjects];
    error.value = 'Failed to load API projects. Showing mockup data only.';
  } finally {
    loading.value = false;
  }
});

// Count projects by status
const statusCounts = computed(() => {
  const counts = {
    completed: projects.value.filter(p => p.projectStatus === 2).length,
    inProgress: projects.value.filter(p => p.projectStatus === 1).length,
    delayed: projects.value.filter(p => p.projectStatus === 3).length,
    cancelled: projects.value.filter(p => p.projectStatus === 0).length
  };
  return counts;
});
</script>

<template>
  <DefaultLayout>
    <main class="bg-gray-200 p-4 dark:bg-darkmode">
      <div class="container mx-auto p-4">
        <div class="mb-8 flex flex-col items-center justify-between md:flex-row">
          <div class="flex items-center gap-4">
            <BackToMainButton />
            <h1 class="text-right text-xl font-bold">عرض المشاريع على الخارطة</h1>
          </div>
        </div>
        <div class="rounded-lg p-4 shadow-sm">
          <div class="mb-4 flex flex-wrap items-center gap-6 p-4">
            <PrimaryButton size="lg" :variant="selected === 'all' ? 'primary' : 'outline'" icon="lucide:layout-grid"
              @click="selected = 'all'">
              عرض الكل ({{ projects.length }})
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'completed' ? 'primary' : 'outline'"
              icon="lucide:check-circle" @click="selected = 'completed'">
              المنجزة ({{ statusCounts.completed }})
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'inProgress' ? 'primary' : 'outline'" icon="lucide:loader"
              @click="selected = 'inProgress'">
              قيد التنفيذ ({{ statusCounts.inProgress }})
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'delayed' ? 'primary' : 'outline'"
              icon="lucide:alert-circle" @click="selected = 'delayed'">
              المتلكئة ({{ statusCounts.delayed }})
            </PrimaryButton>
            <PrimaryButton size="lg" :variant="selected === 'cancelled' ? 'primary' : 'outline'"
              icon="lucide:x-circle" @click="selected = 'cancelled'">
              الملغاة ({{ statusCounts.cancelled }})
            </PrimaryButton>
          </div>
          <div v-if="loading" class="flex justify-center items-center h-[600px]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <div v-else-if="error" class="flex justify-center items-center h-[600px] text-red-500 text-center p-4">
            {{ error }}
          </div>
          <Map v-else class="mb-4 h-[600px] w-full rounded-lg" :is-map-page="true" :projects="projects"
            :selectedStatus="selected" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
