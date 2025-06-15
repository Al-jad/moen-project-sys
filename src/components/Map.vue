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
          <l-popup class="custom-popup !w-[23rem]">
            <div
              class="overflow-hidden rounded-xl border border-border/40 bg-background-surface/95 pt-4 shadow-lg backdrop-blur-sm transition-all duration-300"
            >
              <div class="mt-6 space-y-4 p-4">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-base font-bold leading-tight text-foreground-heading">{{
                    project.name || 'لا يوجد اسم'
                  }}</h3>
                  <div
                    :class="getStatusBadgeClass(project.projectStatus)"
                    class="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm dark:bg-opacity-20"
                  >
                    {{ getStatusText(project.projectStatus) }}
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                  <div
                    :class="[getMapFundingTypeClass(project)]"
                    class="rounded-full px-2.5 py-1 shadow-sm"
                  >
                    {{ getMapFundingTypeText(project) }}
                  </div>
                  <div
                    v-if="checkIsFunded(project) && project.isGovernment"
                    class="rounded-full bg-blue-500/10 px-2.5 py-1 text-blue-600 shadow-sm dark:bg-blue-500/20 dark:text-blue-300"
                  >
                    ضمن البرنامج الحكومي
                  </div>
                </div>
                <div class="space-y-3 border-t border-border/40 pt-3">
                  <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div class="flex items-center gap-2">
                      <div class="rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                        <Icon
                          icon="lucide:calendar-days"
                          class="h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <div>
                        <p class="text-xs text-foreground-muted">تاريخ البدء</p>
                        <p class="font-medium text-foreground-heading">
                          {{ formatDate(project.actualStartDate) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                        <Icon
                          icon="lucide:timer"
                          class="h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <div>
                        <p class="text-xs text-foreground-muted">فترة التنفيذ</p>
                        <p class="font-medium text-foreground-heading">
                          {{ project.duration }} {{ getPeriodTypeText(project.periodType) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-end border-t border-border/40 pt-3">
                  <button
                    class="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95"
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
      class="absolute left-0 right-0 top-0 bg-info p-4 text-center font-bold text-white"
    >
      لا توجد مشاريع لعرضها
    </div>
    <div
      v-else-if="projectsWithCoordinates.length === 0"
      class="absolute left-0 right-0 top-0 bg-background-card p-4 text-center"
    >
      لا توجد مشاريع بإحداثيات لعرضها على الخريطة
    </div>
    <div
      class="absolute right-4 top-4 z-10 rounded-xl border border-border/40 bg-background-surface/95 p-4 shadow-lg backdrop-blur-sm"
    >
      <div class="mb-2 font-bold text-foreground-heading">مفتاح الخريطة</div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-green-500 shadow-sm"></div>
          <span class="text-foreground-base text-sm">منجزة</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-yellow-500 shadow-sm"></div>
          <span class="text-foreground-base text-sm">قيد التنفيذ</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-red-500 shadow-sm"></div>
          <span class="text-foreground-base text-sm">متلكئة</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-gray-500 shadow-sm"></div>
          <span class="text-foreground-base text-sm">ملغاة</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import {
    determineFundingType,
    getProjectTypeClass,
    getProjectTypeText,
    ProjectType,
  } from '@/services/projectTypeService';
  import { Icon } from '@iconify/vue';
  import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { computed, defineProps, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  const zoom = ref(10);
  const centerLatLng = ref([33.3152, 44.3661]);
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
  const markerIcons = {
    0: L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    1: L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    2: L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    3: L.icon({
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
    return markerIcons[status] || markerIcons[1];
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
  onMounted(() => {
    if (projectsWithCoordinates.value.length > 0) {
      const firstProject = projectsWithCoordinates.value[0];
      centerLatLng.value = [firstProject.lat, firstProject.lng];
    }
  });
  const router = useRouter();
  function getStatusBadgeClass(status) {
    const statusClasses = {
      0: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-300',
      1: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-300',
      2: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-300',
      3: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-300',
    };
    return statusClasses[status] || '';
  }
  function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'تاريخ غير صالح';
      }
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'تاريخ غير صالح';
    }
  }
  function viewProjectDetails(projectId) {
    router.push(`/funded-projects/${projectId}`);
  }
  const projectType = computed(() => {
    return null;
  });
  function checkIsFunded(project) {
    return determineFundingType(project) === ProjectType.FUNDED;
  }
  function getMapFundingTypeText(project) {
    const type = determineFundingType(project);
    return getProjectTypeText(type);
  }
  function getMapFundingTypeClass(project) {
    const type = determineFundingType(project);
    return getProjectTypeClass(type);
  }
  function getPeriodTypeText(periodType) {
    if (!periodType) return '';
    return periodType === 1 ? 'أسبوع' : 'شهر';
  }
  function formatCost(value) {
    if (value === null || value === undefined) return 'غير متوفر';
    return value.toLocaleString();
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
    border-radius: 1rem;
    overflow: hidden;
    background: transparent;
    box-shadow: none;
  }
  :deep(.leaflet-popup-tip) {
    @apply bg-background-surface/95 backdrop-blur-sm;
  }
  :deep(.leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }
  :deep(.leaflet-popup-close-button) {
    position: absolute;
    top: 2rem;
    right: 70%;
    padding: 0.375rem;
    width: 1.75rem;
    height: 1.75rem;
    font-size: 1rem;
    line-height: 1;
    transform: translate(-50%, 50%);
    color: #6b7280;
    background: rgba(255, 255, 255, 0.7) !important;
    border-radius: 9999px;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb !important;
  }
  :deep(.leaflet-popup-close-button:hover) {
    color: #111827;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  :deep(.leaflet-popup-close-button span) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin-top: -2px;
  }
  :deep(.leaflet-top),
  :deep(.leaflet-bottom) {
    z-index: 0;
  }
  @media (prefers-color-scheme: dark) {
    :deep(.leaflet-popup-close-button) {
      color: #e5e7eb;
      background: rgba(31, 41, 55, 0.9);
    }
    :deep(.leaflet-popup-close-button:hover) {
      color: #f3f4f6;
      background: rgba(31, 41, 55, 0.95);
    }
  }
</style>
