<template>
  <div class="relative z-0 h-[30rem] w-full">
    <l-map
      ref="map"
      :zoom="zoom"
      markerZoomAnimation="true"
      zoomAnimation="true"
      :center="centerLatLng"
      :options="{ attributionControl: false }"
      @update:zoom="zoomUpdate"
      @update:center="centerUpdate"
    >
      <div class="leaflet-control-fullscreen leaflet-bar leaflet-control"></div>
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      >
      </l-tile-layer>
      <template v-for="project in filteredProjects" :key="project.id">
        <l-marker
          v-if="project.lat && project.lng"
          :lat-lng="[project.lat, project.lng]"
          :icon="getMarkerIcon(project.projectStatus)"
        >
          <l-popup class="custom-popup !w-[24rem]">
            <div
              class="overflow-hidden rounded-xl bg-white shadow-sm dark:border dark:border-gray-700/50 dark:bg-gray-800/95"
            >
              <div class="space-y-4 p-4">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{
                    project.name
                  }}</h3>
                  <div
                    :class="getStatusBadgeClass(project.projectStatus)"
                    class="rounded-full px-3 py-1 text-xs font-medium dark:bg-opacity-20"
                  >
                    {{ getStatusText(project.projectStatus) }}
                  </div>
                </div>

                <div class="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">الجهة المنفذة</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ project.implementingEntity || 'غير متوفر' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">الجهة المستفيدة</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ project.executingDepartment || 'غير متوفر' }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">التكلفة</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{
                        formatCurrency(project.cost)
                      }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">المدة</p>
                      <p class="font-medium text-gray-900 dark:text-white"
                        >{{ project.duration }} شهر</p
                      >
                    </div>
                  </div>

                  <div class="text-sm">
                    <p class="text-gray-500 dark:text-gray-400">الأهداف</p>
                    <p class="line-clamp-2 font-medium text-gray-900 dark:text-white">
                      {{ project.projectObjectives || 'غير متوفر' }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700"
                >
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    تاريخ البدء: {{ formatDate(project.actualStartDate) }}
                  </div>
                  <button
                    class="inline-flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    @click="viewProjectDetails(project.id)"
                  >
                    عرض التفاصيل
                    <Icon name="lucide:arrow-left" class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </template>
    </l-map>
    <div
      v-if="filteredProjects.length === 0"
      class="absolute left-0 right-0 top-0 bg-white bg-opacity-80 p-4 text-center"
    >
      لا توجد مشاريع لعرضها
    </div>
    <div
      v-else-if="projectsWithCoordinates.length === 0"
      class="absolute left-0 right-0 top-0 bg-white bg-opacity-80 p-4 text-center"
    >
      لا توجد مشاريع بإحداثيات لعرضها على الخريطة
    </div>
    <div class="absolute bottom-4 right-4 z-10 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800">
      <div class="mb-1 text-sm font-bold">مفتاح الخريطة</div>
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1">
          <div class="h-4 w-4 rounded-full bg-green-500"></div>
          <span class="text-xs">منجزة</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="h-4 w-4 rounded-full bg-yellow-500"></div>
          <span class="text-xs">قيد التنفيذ</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="h-4 w-4 rounded-full bg-red-500"></div>
          <span class="text-xs">متلكئة</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="h-4 w-4 rounded-full bg-gray-500"></div>
          <span class="text-xs">ملغاة</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { computed, defineProps, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const zoom = ref(10);
  const centerLatLng = ref([33.3152, 44.3661]); // Default center in Baghdad

  const props = defineProps({
    projects: {
      type: Array,
      required: true,
    },
    selectedStatus: {
      type: String,
      default: 'all',
    },
  });

  const statusMapping = {
    all: null,
    completed: 2,
    inProgress: 1,
    delayed: 3,
    cancelled: 0,
  };

  const filteredProjects = computed(() => {
    if (props.selectedStatus === 'all') return props.projects;
    return props.projects.filter((p) => p.projectStatus === statusMapping[props.selectedStatus]);
  });

  const projectsWithCoordinates = computed(() => {
    return filteredProjects.value.filter((p) => p.lat && p.lng);
  });

  // Create custom marker icons for different project statuses
  const markerIcons = {
    0: L.icon({
      // Cancelled
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    1: L.icon({
      // In Progress
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    2: L.icon({
      // Completed
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    3: L.icon({
      // Delayed
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  };

  function getMarkerIcon(status) {
    return markerIcons[status] || markerIcons[1]; // Default to in-progress icon
  }

  function getStatusClass(status) {
    const statusClasses = {
      0: 'text-gray-600',
      1: 'text-yellow-600',
      2: 'text-green-600',
      3: 'text-red-600',
    };
    return statusClasses[status] || '';
  }

  function formatCurrency(value) {
    return value ? `${value.toLocaleString()} دينار` : 'غير متوفر';
  }

  function getStatusText(status) {
    const statusMap = {
      0: 'ملغاة',
      1: 'قيد التنفيذ',
      2: 'منجزة',
      3: 'متلكئة',
    };
    return statusMap[status] || 'غير معروف';
  }

  function zoomUpdate(newZoom) {
    zoom.value = newZoom;
  }

  function centerUpdate(newCenter) {
    centerLatLng.value = newCenter;
  }

  // Adjust map center if there are projects with coordinates
  onMounted(() => {
    if (projectsWithCoordinates.value.length > 0) {
      const firstProject = projectsWithCoordinates.value[0];
      centerLatLng.value = [firstProject.lat, firstProject.lng];
    }
  });

  const router = useRouter();

  function getStatusBadgeClass(status) {
    const statusClasses = {
      0: 'bg-gray-100 text-gray-700 dark:bg-gray-500 dark:text-gray-100',
      1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500 dark:text-yellow-100',
      2: 'bg-green-100 text-green-700 dark:bg-green-500 dark:text-green-100',
      3: 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-red-100',
    };
    return statusClasses[status] || '';
  }

  function formatDate(dateString) {
    if (!dateString) return 'غير متوفر';
    return new Date(dateString).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function viewProjectDetails(projectId) {
    // Navigate to project details page
    router.push(`/funded-projects/${projectId}`);
  }
</script>

<style scoped>
  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 20px;
    z-index: 0;
  }

  :deep(.leaflet-popup-content-wrapper) {
    padding: 0;
    border-radius: 0.75rem;
    overflow: hidden;
    background: transparent;
    box-shadow: none;
  }

  :deep(.leaflet-popup-tip) {
    @apply bg-white dark:bg-gray-800/95;
  }

  :deep(.leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }

  :deep(.leaflet-popup-close-button) {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.25rem;
    line-height: 1;
    color: #6b7280;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 9999px;
    backdrop-filter: blur(4px);
    transition: all 0.2s;
    z-index: 10;
  }

  :deep(.leaflet-popup-close-button:hover) {
    color: #111827;
    background: rgba(255, 255, 255, 0.95);
    transform: scale(1.05);
  }

  :deep(.leaflet-popup-close-button span) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  :deep(.leaflet-top),
  :deep(.leaflet-bottom) {
    z-index: 0;
  }

  @media (prefers-color-scheme: dark) {
    :deep(.leaflet-popup-close-button) {
      color: #e5e7eb;
      background: rgba(31, 41, 55, 0.8);
    }

    :deep(.leaflet-popup-close-button:hover) {
      color: #f3f4f6;
      background: rgba(31, 41, 55, 0.95);
    }
  }
</style>
