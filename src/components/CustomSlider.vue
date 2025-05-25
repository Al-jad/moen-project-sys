<template>
  <div class="custom-slider-container">
    <label
      v-if="label"
      :for="sliderId"
      class="mb-2 block text-sm font-medium text-foreground-heading"
    >
      {{ label }}
    </label>

    <!-- Dual Range Slider -->
    <div v-if="isDualRange" class="relative h-2 w-full">
      <!-- Track Background -->
      <div class="absolute inset-0 rounded-lg bg-background-hover"></div>

      <!-- Active Track -->
      <div
        class="absolute h-full rounded-lg bg-primary transition-all duration-200"
        :style="{
          left: `${((modelValue[0] - min) / (max - min)) * 100}%`,
          width: `${((modelValue[1] - modelValue[0]) / (max - min)) * 100}%`,
        }"
      ></div>

      <!-- Min Thumb -->
      <div
        class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-primary bg-primary transition-all duration-200 hover:scale-110 hover:bg-primary-hover"
        :class="{ 'cursor-not-allowed opacity-50': disabled }"
        :style="{ left: `${((modelValue[0] - min) / (max - min)) * 100}%` }"
        @mousedown="startDrag('min', $event)"
        @touchstart="startDrag('min', $event)"
      ></div>

      <!-- Max Thumb -->
      <div
        class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-primary bg-primary transition-all duration-200 hover:scale-110 hover:bg-primary-hover"
        :class="{ 'cursor-not-allowed opacity-50': disabled }"
        :style="{ left: `${((modelValue[1] - min) / (max - min)) * 100}%` }"
        @mousedown="startDrag('max', $event)"
        @touchstart="startDrag('max', $event)"
      ></div>

      <!-- Hidden inputs for accessibility -->
      <input
        :id="sliderId + '-min'"
        type="range"
        :min="min"
        :max="max"
        :value="modelValue[0]"
        :step="step"
        :disabled="disabled"
        class="sr-only"
        @input="updateMin"
      />
      <input
        :id="sliderId + '-max'"
        type="range"
        :min="min"
        :max="max"
        :value="modelValue[1]"
        :step="step"
        :disabled="disabled"
        class="sr-only"
        @input="updateMax"
      />
    </div>

    <!-- Single Range Slider (original) -->
    <input
      v-else
      :id="sliderId"
      type="range"
      :min="min"
      :max="max"
      :value="modelValue"
      :step="step"
      :disabled="disabled"
      class="slider-track h-2 w-full cursor-pointer appearance-none rounded-lg"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      :style="{
        background: `linear-gradient(to right,
          hsl(var(--background-hover)) ${100 - ((modelValue - min) / (max - min)) * 100}%,
          hsl(var(--primary)) ${100 - ((modelValue - min) / (max - min)) * 100}%)`,
      }"
      @input="handleInput"
    />

    <div v-if="showValue" class="mt-2 text-sm text-foreground-muted">
      <span v-if="isDualRange"> Range: {{ modelValue[0] }} - {{ modelValue[1] }} </span>
      <span v-else> Value: {{ modelValue }} </span>
    </div>
  </div>
</template>

<script setup>
  import { computed, onUnmounted, ref } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [Number, Array],
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: '',
    },
    sliderId: {
      type: String,
      default: () => `slider-${Math.random().toString(36).substring(7)}`,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  // Determine if this is a dual range slider
  const isDualRange = computed(() => Array.isArray(props.modelValue));

  // Drag state
  const isDragging = ref(false);
  const dragType = ref(null); // 'min' or 'max'
  const sliderRect = ref(null);

  const handleInput = (event) => {
    emit('update:modelValue', Number(event.target.value));
  };

  const updateMin = (event) => {
    const newMin = Number(event.target.value);
    const currentMax = props.modelValue[1];
    if (newMin <= currentMax - props.step) {
      emit('update:modelValue', [newMin, currentMax]);
    }
  };

  const updateMax = (event) => {
    const newMax = Number(event.target.value);
    const currentMin = props.modelValue[0];
    if (newMax >= currentMin + props.step) {
      emit('update:modelValue', [currentMin, newMax]);
    }
  };

  const startDrag = (type, event) => {
    if (props.disabled) return;

    event.preventDefault();
    isDragging.value = true;
    dragType.value = type;

    // Get slider container rect
    const container = event.target.closest('.custom-slider-container');
    const track = container.querySelector('.relative.h-2');
    sliderRect.value = track.getBoundingClientRect();

    // Add event listeners
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const handleDrag = (event) => {
    if (!isDragging.value || !sliderRect.value) return;

    event.preventDefault();

    // Get mouse/touch position
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;

    // Calculate percentage
    const rect = sliderRect.value;
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    // Calculate new value
    const range = props.max - props.min;
    const rawValue = props.min + percentage * range;
    const steppedValue = Math.round(rawValue / props.step) * props.step;
    const clampedValue = Math.max(props.min, Math.min(props.max, steppedValue));

    // Update appropriate value
    if (dragType.value === 'min') {
      const newMin = Math.min(clampedValue, props.modelValue[1] - props.step);
      emit('update:modelValue', [newMin, props.modelValue[1]]);
    } else {
      const newMax = Math.max(clampedValue, props.modelValue[0] + props.step);
      emit('update:modelValue', [props.modelValue[0], newMax]);
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
    dragType.value = null;
    sliderRect.value = null;

    // Remove event listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
  };

  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
  });
</script>

<style scoped>
  .slider-track {
    background-color: hsl(var(--background-hover));
  }

  .slider-track::-webkit-slider-thumb {
    @apply h-4 w-4 cursor-pointer appearance-none rounded-full border-2;
    background-color: hsl(var(--primary));
    border-color: hsl(var(--primary));
    transition: transform 0.1s ease-in-out;
  }

  .slider-track::-moz-range-thumb {
    @apply h-4 w-4 cursor-pointer appearance-none rounded-full border-2;
    background-color: hsl(var(--primary));
    border-color: hsl(var(--primary));
    transition: transform 0.1s ease-in-out;
  }

  .slider-track:not(:disabled)::-webkit-slider-thumb:hover {
    @apply scale-110;
    background-color: hsl(var(--primary-hover));
  }

  .slider-track:not(:disabled)::-webkit-slider-thumb:active {
    background-color: hsl(var(--primary));
  }

  .slider-track:not(:disabled)::-moz-range-thumb:hover {
    @apply scale-110;
    background-color: hsl(var(--primary-hover));
  }

  .slider-track:not(:disabled)::-moz-range-thumb:active {
    background-color: hsl(var(--primary));
  }

  .slider-track {
    accent-color: hsl(var(--primary));
  }

  /* Prevent text selection during drag */
  .custom-slider-container {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
