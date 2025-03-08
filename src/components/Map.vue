<template>
  <div class="w-full h-[30rem] relative z-0">
    <l-map ref="map" :zoom="zoom" markerZoomAnimation="true" zoomAnimation="true" :center="centerLatLng"
      :options="{ attributionControl: false }" @update:zoom="zoomUpdate" @update:center="centerUpdate">
      <div class="leaflet-control-fullscreen leaflet-bar leaflet-control"></div>
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
        name="OpenStreetMap">
      </l-tile-layer>
      <l-marker :lat-lng="centerLatLng">
        <l-popup class="text-black !w-72">
          <div class="p-2">
            <template v-if="isMapPage">
              <div class="space-y-3 text-right">
                <h3 class="text-lg font-semibold text-slate-800">مشروع تطوير شارع 14 رمضان</h3>
                <div class="space-y-2 ">
                  <p class="flex items-center gap-2 text-gray-600">
                    <span>المستفيد:</span>
                    <span class="font-medium">بلدية المنصور</span>
                  </p>
                  <p class="flex items-center gap-2 text-gray-600">
                    <span>التكلفة:</span>
                    <span class="font-medium">500,000 دينار</span>
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium">نسبة الإنجاز: 75%</span>
                  <div class="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-300 bg-green-500 rounded-full" style="width: 75%"></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="text-right">
                <h3 class="font-medium">بغداد المنصور شارع 14 رمضان</h3>
              </div>
            </template>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const zoom = ref(13);
const centerLatLng = ref([33.3152, 44.3661]);
const map = ref(null);

const props = defineProps({
  isMapPage: {
    type: Boolean,
    default: false
  }
});

function zoomUpdate(newZoom) {
  zoom.value = newZoom;
}

function centerUpdate(newCenter) {
  centerLatLng.value = newCenter;
}

onMounted(() => {
  nextTick(() => {
    if (map.value && map.value.mapObject) {
      map.value.mapObject.addControl(new L.Control.FullScreen());
    }
  });
});
</script>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
  border-radius: 20px;
  z-index: 0;
}

/* Fix map controls z-index */
:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 0;
}
</style>
