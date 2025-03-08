<template>
  <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">موقع المشروع</h2>
    
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="latitude">خط العرض</Label>
          <Input
            id="latitude"
            v-model="store.form.latitude"
            type="text"
            placeholder="33.315241"
            readonly
          />
        </div>
        <div class="space-y-2">
          <Label for="longitude">خط الطول</Label>
          <Input
            id="longitude"
            v-model="store.form.longitude"
            type="text"
            placeholder="44.366197"
            readonly
          />
        </div>
      </div>
      
      <div class="mt-4">
        <div class="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <LMap
            ref="mapRef"
            v-model:zoom="zoom"
            v-model:center="center"
            :use-global-leaflet="false"
            class="h-full w-full z-0"
            @click="handleMapClick"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            />
            <LMarker v-if="markerPosition" :lat-lng="markerPosition">
              <LPopup>موقع المشروع</LPopup>
            </LMarker>
          </LMap>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          انقر على الخريطة لتحديد موقع المشروع
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFundedProjectStore } from '@/stores/fundedProject';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

const store = useFundedProjectStore();
const mapRef = ref(null);

// Default center on Iraq
const center = ref([33.315241, 44.366197]);
const zoom = ref(6);
const markerPosition = computed(() => {
  if (store.form.latitude && store.form.longitude) {
    return [parseFloat(store.form.latitude), parseFloat(store.form.longitude)];
  }
  return null;
});

// Initialize form values if they don't exist
onMounted(() => {
  if (!store.form.latitude) store.form.latitude = '';
  if (!store.form.longitude) store.form.longitude = '';
  
  // If coordinates already exist, set the marker
  if (store.form.latitude && store.form.longitude) {
    center.value = [parseFloat(store.form.latitude), parseFloat(store.form.longitude)];
    zoom.value = 12;
  }
});

// Handle map click to set marker position
const handleMapClick = (event) => {
  const { lat, lng } = event.latlng;
  store.form.latitude = lat.toFixed(6);
  store.form.longitude = lng.toFixed(6);
  store.hasUnsavedChanges = true;
  
  // Center map on the new marker
  center.value = [lat, lng];
  zoom.value = 12;
};

// Watch for changes in marker position to update the map
watch(markerPosition, (newPosition) => {
  if (newPosition) {
    center.value = newPosition;
  }
});
</script>

<style scoped>
/* Ensure the map container has proper z-index handling */
:deep(.leaflet-container) {
  z-index: 0;
}
:deep(.leaflet-control) {
  z-index: 1;
}
:deep(.leaflet-pane) {
  z-index: 0;
}
</style> 