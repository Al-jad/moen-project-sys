<template>
  <div
    class="rounded-xl border border-border bg-background-surface p-6 shadow-sm transition-all duration-300 hover:shadow-md"
  >
    <div class="mb-6 flex items-center gap-3">
      <div class="rounded-lg bg-info/10 p-2">
        <Icon icon="lucide:map-pin" class="h-5 w-5 text-info" />
      </div>
      <h2 class="text-xl font-semibold text-foreground-heading">موقع المشروع</h2>
    </div>

    <div class="space-y-4">
      <!-- Location Input Section -->
      <div class="rounded-lg border border-border bg-background-card p-4">
        <div class="flex gap-3">
          <CustomInput
            v-model="location"
            dir="rtl"
            placeholder="ادخل الموقع الجغرافي"
            class="flex-1"
          />
          <PrimaryButton
            @click="showLocationPicker = true"
            variant="accent"
            class="flex items-center gap-2"
          >
            <Icon icon="lucide:map-pin" class="h-4 w-4" />
            اختر على الخريطة
          </PrimaryButton>
        </div>
      </div>

      <!-- Coordinates Display -->
      <div
        v-if="store.form.latitude && store.form.longitude"
        class="rounded-lg border border-success/20 bg-success/5 p-4"
      >
        <div class="mb-2 flex items-center gap-2">
          <Icon icon="lucide:check-circle" class="h-4 w-4 text-success" />
          <span class="text-sm font-medium text-success">تم تحديد الموقع بنجاح</span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-foreground-muted">خط العرض:</span>
            <span class="font-mono text-foreground-heading">{{
              parseFloat(store.form.latitude).toFixed(6)
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-foreground-muted">خط الطول:</span>
            <span class="font-mono text-foreground-heading">{{
              parseFloat(store.form.longitude).toFixed(6)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-lg border border-warning/20 bg-warning/5 p-4">
        <div class="mb-2 flex items-center gap-2">
          <Icon icon="lucide:alert-circle" class="h-4 w-4 text-warning" />
          <span class="text-sm font-medium text-warning">لم يتم تحديد الموقع بعد</span>
        </div>
        <p class="text-xs text-foreground-muted">يرجى اختيار موقع المشروع على الخريطة</p>
      </div>
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
  import { useFundedProjectStore } from '@/stores/funded-project-store';
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
