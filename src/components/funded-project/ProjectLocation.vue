<template>
  <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">موقع المشروع</h2>
    <Button @click="showLocationPicker = true">اختر على الخريطة</Button>
    <LocationPicker
      v-model:show="showLocationPicker"
      :initial-location="initialLocation"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup>
import { useFundedProjectStore } from '@/stores/fundedProject';
import LocationPicker from '@/components/LocationPicker.vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
const store = useFundedProjectStore();
const mapRef = ref(null);
const showLocationPicker = ref(false);

// Default center on Iraq
const center = ref([33.315241, 44.366197]);
const zoom = ref(6);
const markerPosition = computed(() => {
  if (store.form.latitude && store.form.longitude) {
    return [parseFloat(store.form.latitude), parseFloat(store.form.longitude)];
  }
  return null;
});

// Computed property for initial location
const initialLocation = computed(() => {
  if (store.form.latitude && store.form.longitude) {
    return {
      lat: parseFloat(store.form.latitude),
      lng: parseFloat(store.form.longitude)
    };
  }
  return { lat: 33.315241, lng: 44.366197 }; // Default to Baghdad
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

// Handle location selected from the LocationPicker
const handleLocationSelected = (location) => {
  store.form.latitude = location.lat.toFixed(6);
  store.form.longitude = location.lng.toFixed(6);
  store.hasUnsavedChanges = true;
  
  // Center map on the new marker
  center.value = [location.lat, location.lng];
  zoom.value = 12;
  
  // Reverse geocode to get address
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.display_name) {
        // If you have a location field in your form, you can set it here
        // store.form.location = data.display_name;
        toast.success('تم تحديد الموقع بنجاح');
      }
    })
    .catch(() => {
      toast.error('حدث خطأ في تحديد العنوان');
    });
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