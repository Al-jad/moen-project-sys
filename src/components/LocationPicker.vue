<template>
  <Dialog :open="show" @update:open="$emit('update:show', $event)">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle class="text-right">اختر الموقع على الخريطة</DialogTitle>
        <DialogDescription class="text-right">
          انقر على الخريطة لتحديد الموقع او ابحث عن عنوان
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <Input
            v-model="searchQuery"
            dir="rtl"
            placeholder="ابحث عن موقع..."
            class="flex-1"
            @keyup.enter="searchLocation"
          />
          <Button @click="searchLocation" variant="secondary">
            <Icon icon="lucide:search" class="h-4 w-4" />
            بحث
          </Button>
        </div>
        <div class="relative h-[400px] overflow-hidden rounded-lg">
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
      <DialogFooter class="flex-row-reverse gap-2">
        <Button variant="outline" @click="$emit('update:show', false)">الغاء</Button>
        <Button @click="confirmLocation" class="w-1/4">تأكيد</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Icon } from '@iconify/vue';
  import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import 'leaflet/dist/leaflet.css';

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

<style>
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
</style>
