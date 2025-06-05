<template>
  <BaseModal
    :open="show"
    @update:open="$emit('update:show', $event)"
    @close="$emit('update:show', false)"
    @confirm="confirmLocation"
    content-class="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
    header-class="pb-0 flex-shrink-0"
    title-class="text-xl font-bold text-foreground-heading"
    footer-class="flex justify-center gap-3 pt-6 mt-6 border-t border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm"
    :cancel-text="'إلغاء'"
    :confirm-text="'تأكيد الموقع'"
    :show-confirm="true"
    confirm-button-class="bg-primary hover:bg-primary/90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <template #title>
      <div class="space-y-3 p-6 pb-4 text-center">
        <!-- Icon Header -->
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 shadow-lg transition-all duration-300"
            >
              <Icon icon="lucide:map-pin" class="h-6 w-6 text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-foreground-heading"> اختر الموقع على الخريطة </h3>
          </div>
          <p class="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
            انقر على الخريطة لتحديد الموقع او ابحث عن عنوان
          </p>
        </div>
      </div>
    </template>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto px-6 pb-2">
      <div class="space-y-6">
        <!-- Search Bar -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:search"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Label class="text-sm font-semibold text-foreground-body">البحث عن موقع</Label>
          </div>
          <div class="flex gap-2">
            <Input
              @keyup.enter="searchLocation"
              v-model="searchQuery"
              dir="rtl"
              placeholder="ابحث عن موقع..."
              class="h-12 rounded-xl border-2 border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
            />
            <Button
              @click="searchLocation"
              variant="secondary"
              class="h-12 min-w-[5rem] bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Icon icon="lucide:search" class="ml-2 h-4 w-4" />
              بحث
            </Button>
          </div>
        </div>

        <!-- Map Container -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:map" class="h-5 w-5 text-muted-foreground" />
            <Label class="text-sm font-semibold text-foreground-body">الخريطة</Label>
          </div>
          <div class="relative h-[400px] overflow-hidden rounded-xl border-2 border-border/60">
            <LMap
              v-model:zoom="zoom"
              :center="[selectedLocation.lat, selectedLocation.lng]"
              @click="handleMapClick"
              class="cursor-crosshair"
            >
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <LMarker
                :lat-lng="[selectedLocation.lat, selectedLocation.lng]"
                draggable
                @dragend="handleMarkerDrag"
              />
            </LMap>
          </div>
        </div>

        <!-- Selected Location Info -->
        <div class="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20"
            >
              <Icon icon="lucide:map-pin" class="h-5 w-5 text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-foreground-body">الموقع المحدد</p>
              <div class="mt-1 flex items-center gap-2">
                <div class="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                <p class="text-xs font-medium text-primary">
                  {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center gap-3 px-6">
        <Button
          variant="outline"
          @click="$emit('update:show', false)"
          class="h-11 min-w-[7rem] border-2 border-border/60 transition-all duration-300 hover:border-border hover:bg-muted/50"
        >
          إلغاء
        </Button>
        <Button
          @click="confirmLocation"
          class="h-11 min-w-[7rem] bg-gradient-to-r from-primary to-primary/90 px-6 text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-primary hover:shadow-xl"
        >
          <Icon icon="lucide:check" class="mr-2 h-4 w-4" />
          تأكيد الموقع
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Icon } from '@iconify/vue';
  import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import 'leaflet/dist/leaflet.css';
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';

  const props = defineProps({
    show: Boolean,
    initialLocation: {
      type: Object,
      default: () => ({ lat: 33.3152, lng: 44.3661 }), // Baghdad coordinates as default
    },
  });

  const emit = defineEmits(['update:show', 'locationSelected']);

  const searchQuery = ref('');
  const selectedLocation = ref({ ...props.initialLocation });
  const zoom = ref(13);

  const handleMapClick = (e) => {
    selectedLocation.value = { lat: e.latlng.lat, lng: e.latlng.lng };
  };

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    selectedLocation.value = { lat, lng };
  };

  const searchLocation = async () => {
    if (!searchQuery.value) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        selectedLocation.value = { lat: parseFloat(lat), lng: parseFloat(lon) };
        zoom.value = 13;
      } else {
        toast.error('لم يتم العثور على الموقع');
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء البحث');
    }
  };

  const confirmLocation = () => {
    emit('locationSelected', selectedLocation.value);
    emit('update:show', false);
  };
</script>

<style scoped>
  .leaflet-container {
    width: 100%;
    height: 100%;
  }

  /* Custom cursor styles */
  .leaflet-grab {
    cursor: grab;
  }

  .leaflet-dragging .leaflet-grab {
    cursor: grabbing;
  }

  .leaflet-marker-icon {
    cursor: move; /* Fallback */
    cursor: grab;
  }

  .leaflet-marker-icon:active {
    cursor: grabbing;
  }

  .cursor-crosshair {
    cursor: crosshair;
  }

  @keyframes animate-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: animate-pulse 2s infinite;
  }
</style>
