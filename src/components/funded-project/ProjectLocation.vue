<template>
  <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">موقع المشروع</h2>
    <div class="flex gap-2">
      <CustomInput v-model="location" dir="rtl" placeholder="ادخل الموقع الجغرافي" class="flex-1" />
      <Button
        @click="showLocationPicker = true"
        variant="outline"
        class="flex items-center gap-2 dark:border-gray-700 dark:text-gray-100"
      >
        <Icon icon="lucide:map-pin" class="h-4 w-4" />
        اختر على الخريطة
      </Button>
    </div>
    <LocationPicker
      v-model:show="showLocationPicker"
      :initial-location="initialLocation"
      @location-selected="handleLocationSelected"
    />
  </div>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import LocationPicker from '@/components/LocationPicker.vue';
  import { Button } from '@/components/ui/button';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';

  const store = useFundedProjectStore();
  const showLocationPicker = ref(false);
  const location = ref('');

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
        lng: parseFloat(store.form.longitude),
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

  // Handle location selected from the LocationPicker
  const handleLocationSelected = (selectedLocation) => {
    store.form.latitude = selectedLocation.lat.toFixed(6);
    store.form.longitude = selectedLocation.lng.toFixed(6);
    store.hasUnsavedChanges = true;

    // Center map on the new marker
    center.value = [selectedLocation.lat, selectedLocation.lng];
    zoom.value = 12;

    // Reverse geocode to get address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.display_name) {
          location.value = data.display_name;
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
