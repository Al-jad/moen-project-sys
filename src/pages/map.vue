<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import Map from '@/components/Map.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { projectService } from '@/services/projectService';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  const selected = ref('all');
  const projects = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const mockupProjects = [
    {
      fundingType: 1,
      periodType: 1,
      duration: 36,
      name: 'Baghdad Green Belt Initiative',
      executingDepartment: 'Ministry of Environment',
      implementingEntity: 'Baghdad Urban Planning Authority',
      grantingEntity: 'UN Environment Programme',
      cost: 8500000,
      actualStartDate: '2024-05-10T08:00:00Z',
      projectObjectives: 'Create green spaces and improve air quality',
      lng: 44.4275,
      lat: 33.3425,
      projectStatus: 1,
      id: 101,
    },
    {
      fundingType: 2,
      periodType: 1,
      duration: 24,
      name: 'Al-Rasheed Street Renovation',
      executingDepartment: 'Ministry of Culture',
      implementingEntity: 'Baghdad Heritage Committee',
      grantingEntity: 'UNESCO',
      cost: 5200000,
      actualStartDate: '2024-03-22T08:00:00Z',
      projectObjectives: 'Restore historic buildings and improve infrastructure',
      lng: 44.4061,
      lat: 33.3352,
      projectStatus: 1,
      id: 102,
    },
    {
      fundingType: 1,
      periodType: 2,
      duration: 18,
      name: 'Tigris River Cleanup Campaign',
      executingDepartment: 'Ministry of Water Resources',
      implementingEntity: 'Baghdad Environmental Protection Agency',
      grantingEntity: 'World Bank',
      cost: 3800000,
      actualStartDate: '2023-11-15T08:00:00Z',
      projectObjectives: 'Reduce water pollution and restore river ecosystem',
      lng: 44.39,
      lat: 33.31,
      projectStatus: 2,
      id: 103,
    },
    {
      fundingType: 2,
      periodType: 1,
      duration: 12,
      name: 'Al-Karkh Solar Power Installation',
      executingDepartment: 'Ministry of Electricity',
      implementingEntity: 'Baghdad Renewable Energy Department',
      grantingEntity: 'International Renewable Energy Agency',
      cost: 7500000,
      actualStartDate: '2024-01-05T08:00:00Z',
      projectObjectives: 'Install solar panels in western Baghdad district',
      lng: 44.3461,
      lat: 33.3252,
      projectStatus: 3,
      id: 104,
    },
    {
      fundingType: 1,
      periodType: 1,
      duration: 30,
      name: 'Baghdad Metro Line Extension',
      executingDepartment: 'Ministry of Transportation',
      implementingEntity: 'Baghdad Public Transport Authority',
      grantingEntity: 'Asian Development Bank',
      cost: 125000000,
      actualStartDate: '2023-08-20T08:00:00Z',
      projectObjectives: 'Extend metro line to southern districts',
      lng: 44.3861,
      lat: 33.2752,
      projectStatus: 0,
      id: 105,
    },
    {
      fundingType: 2,
      periodType: 2,
      duration: 24,
      name: 'Al-Zawraa Park Rehabilitation',
      executingDepartment: 'Ministry of Youth and Sports',
      implementingEntity: 'Baghdad Parks and Recreation',
      grantingEntity: 'Local Government',
      cost: 4200000,
      actualStartDate: '2024-02-10T08:00:00Z',
      projectObjectives: 'Renovate facilities and add recreational areas',
      lng: 44.3561,
      lat: 33.3352,
      projectStatus: 1,
      id: 106,
    },
  ];
  onMounted(async () => {
    try {
      const response = await projectService.getAllProjects();
      const apiProjects = response.data;
      projects.value = [...apiProjects, ...mockupProjects];
    } catch (err) {
      console.error('Error fetching projects:', err);
      projects.value = [...mockupProjects];
      error.value = 'Failed to load API projects. Showing mockup data only.';
    } finally {
      loading.value = false;
    }
  });
  const statusCounts = computed(() => {
    const counts = {
      completed: projects.value.filter((p) => p.projectStatus === 2).length,
      inProgress: projects.value.filter((p) => p.projectStatus === 1).length,
      delayed: projects.value.filter((p) => p.projectStatus === 3).length,
      cancelled: projects.value.filter((p) => p.projectStatus === 0).length,
    };
    return counts;
  });
</script>
<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-4 dark:bg-darkmode">
      <div class="container mx-auto max-w-[90rem] p-4">
        <div
          class="mb-6 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0"
        >
          <div class="flex items-center gap-4">
            <BackToMainButton />
            <h1 class="text-right text-2xl font-bold text-gray-800 dark:text-white"
              >عرض المشاريع على الخارطة</h1
            >
          </div>
        </div>
        <div class="rounded-xl bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
          <div
            class="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-lg bg-white/80 p-6 shadow-sm dark:bg-gray-900/80"
          >
            <PrimaryButton
              size="lg"
              :variant="selected === 'all' ? 'primary' : 'outline'"
              icon="lucide:layout-grid"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              :class="{
                'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'all',
              }"
              @click="selected = 'all'"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:layout-grid'" class="h-5 w-5" />
                <span>عرض الكل ({{ projects.length }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-primary/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'all' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'completed' ? 'primary' : 'outline'"
              icon="lucide:check-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              :class="{
                'ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'completed',
              }"
              @click="selected = 'completed'"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:check-circle'" class="h-5 w-5 text-green-500" />
                <span>المنجزة ({{ statusCounts.completed }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-green-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'completed' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'inProgress' ? 'primary' : 'outline'"
              icon="lucide:loader"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
              :class="{
                'ring-2 ring-yellow-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'inProgress',
              }"
              @click="selected = 'inProgress'"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:loader'" class="h-5 w-5 animate-spin text-yellow-500" />
                <span>قيد التنفيذ ({{ statusCounts.inProgress }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-yellow-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'inProgress' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'delayed' ? 'primary' : 'outline'"
              icon="lucide:alert-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              :class="{
                'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'delayed',
              }"
              @click="selected = 'delayed'"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:alert-circle'" class="h-5 w-5 text-red-500" />
                <span>المتلكئة ({{ statusCounts.delayed }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-red-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'delayed' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              :variant="selected === 'cancelled' ? 'primary' : 'outline'"
              icon="lucide:x-circle"
              class="group relative min-w-[10rem] transform-gpu overflow-hidden rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20"
              :class="{
                'ring-2 ring-gray-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900':
                  selected === 'cancelled',
              }"
              @click="selected = 'cancelled'"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <Icon :name="'lucide:x-circle'" class="h-5 w-5 text-gray-500" />
                <span>الملغاة ({{ statusCounts.cancelled }})</span>
              </span>
              <div
                class="absolute inset-0 -z-10 bg-gray-500/10 transition-transform duration-300 group-hover:scale-100"
                :class="selected === 'cancelled' ? 'scale-100' : 'scale-0'"
              ></div>
            </PrimaryButton>
          </div>
          <div v-if="loading" class="flex h-[600px] items-center justify-center">
            <div class="flex flex-col items-center gap-4">
              <div
                class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
              ></div>
              <p class="text-gray-600 dark:text-gray-300">جاري تحميل البيانات...</p>
            </div>
          </div>
          <div v-else-if="error" class="flex h-[600px] items-center justify-center">
            <div class="flex flex-col items-center gap-4 text-center">
              <div class="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <Icon name="lucide:alert-circle" class="h-8 w-8 text-red-500" />
              </div>
              <p class="max-w-md text-red-500">{{ error }}</p>
            </div>
          </div>
          <Map
            v-else
            class="h-[600px] w-full overflow-hidden rounded-xl"
            :is-map-page="true"
            :projects="projects"
            :selectedStatus="selected"
          />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>
