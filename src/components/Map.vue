<template>
  <div class="w-full h-[30rem] relative z-0">
    <l-map ref="map" :zoom="zoom" markerZoomAnimation="true" zoomAnimation="true" :center="centerLatLng"
      :options="{ attributionControl: false }" @update:zoom="zoomUpdate" @update:center="centerUpdate">
      <div class="leaflet-control-fullscreen leaflet-bar leaflet-control"></div>
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
        name="OpenStreetMap">
      </l-tile-layer>
      <template v-for="project in filteredProjects" :key="project.id">
        <l-marker v-if="project.lat && project.lng" :lat-lng="[project.lat, project.lng]" :icon="getMarkerIcon(project.projectStatus)">
          <l-popup class="text-black !w-72">
            <div class="p-2">
              <div class="space-y-3 text-right">
                <h3 class="text-lg font-semibold text-slate-800">{{ project.name }}</h3>
                <div class="space-y-2">
                  <p class="flex items-center gap-2 text-gray-600">
                    <span>المستفيد:</span>
                    <span class="font-medium">
                      {{ project.executingDepartment || "غير متوفر" }}
                    </span>
                  </p>
                  <p class="flex items-center gap-2 text-gray-600">
                    <span>التكلفة:</span>
                    <span class="font-medium">{{ formatCurrency(project.cost) }}</span>
                  </p>
                  <p class="flex items-center gap-2 text-gray-600">
                    <span>الحالة:</span>
                    <span class="font-medium" :class="getStatusClass(project.projectStatus)">
                      {{ getStatusText(project.projectStatus) }}
                    </span>
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium">المدة: {{ project.duration }} شهر</span>
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </template>
    </l-map>
    <div v-if="filteredProjects.length === 0" class="absolute top-0 left-0 right-0 bg-white bg-opacity-80 p-4 text-center">
      لا توجد مشاريع لعرضها
    </div>
    <div v-else-if="projectsWithCoordinates.length === 0" class="absolute top-0 left-0 right-0 bg-white bg-opacity-80 p-4 text-center">
      لا توجد مشاريع بإحداثيات لعرضها على الخريطة
    </div>
    <div class="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md z-10 dark:bg-gray-800">
      <div class="text-sm font-bold mb-1">مفتاح الخريطة</div>
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 rounded-full bg-green-500"></div>
          <span class="text-xs">منجزة</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 rounded-full bg-blue-500"></div>
          <span class="text-xs">قيد التنفيذ</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span class="text-xs">متلكئة</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 rounded-full bg-red-500"></div>
          <span class="text-xs">ملغاة</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';
import { ref, computed, defineProps, onMounted, watch } from 'vue';

const zoom = ref(10);
const centerLatLng = ref([33.3152, 44.3661]); // Default center in Baghdad

const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  selectedStatus: {
    type: String,
    default: "all"
  }
});

const statusMapping = {
  all: null,
  completed: 2,
  inProgress: 1,
  delayed: 3,
  cancelled: 0
};

const filteredProjects = computed(() => {
  if (props.selectedStatus === "all") return props.projects;
  return props.projects.filter(p => p.projectStatus === statusMapping[props.selectedStatus]);
});

const projectsWithCoordinates = computed(() => {
  return filteredProjects.value.filter(p => p.lat && p.lng);
});

// Create custom marker icons for different project statuses
const markerIcons = {
  0: L.icon({ // Cancelled
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  1: L.icon({ // In Progress
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  2: L.icon({ // Completed
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  3: L.icon({ // Delayed
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

function getMarkerIcon(status) {
  return markerIcons[status] || markerIcons[1]; // Default to in-progress icon
}

function getStatusClass(status) {
  const statusClasses = {
    0: 'text-red-600',
    1: 'text-blue-600',
    2: 'text-green-600',
    3: 'text-yellow-600'
  };
  return statusClasses[status] || '';
}

// Log projects for debugging
watch(() => props.projects, (newProjects) => {
  console.log('Projects in Map component:', newProjects);
  console.log('Projects with coordinates:', projectsWithCoordinates.value);
}, { immediate: true });

function formatCurrency(value) {
  return value ? `${value.toLocaleString()} دينار` : "غير متوفر";
}

function getStatusText(status) {
  const statusMap = {
    0: "ملغاة",
    1: "قيد التنفيذ",
    2: "منجزة",
    3: "متلكئة"
  };
  return statusMap[status] || "غير معروف";
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
</script>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
  border-radius: 20px;
  z-index: 0;
}

:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 0;
}
</style>
