<script setup>
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Array,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    dir: {
      type: String,
      default: 'ltr',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const sliderRef = ref(null);
  const isDragging = ref(false);
  const activeThumb = ref(null);

  const values = computed({
    get: () => props.modelValue,
    set: (newValue) => {
      // Ensure values are within bounds and properly formatted
      const validatedValues = newValue.map((val) => {
        const numVal = Number(val);
        return Math.min(Math.max(numVal, props.min), props.max);
      });
      emit('update:modelValue', validatedValues);
    },
  });

  const percentages = computed(() => {
    return values.value.map((value) => {
      const percentage = ((value - props.min) / (props.max - props.min)) * 100;
      return Math.max(0, Math.min(100, percentage));
    });
  });

  const getValueFromPosition = (position) => {
    if (!sliderRef.value) return 0;

    const rect = sliderRef.value.getBoundingClientRect();
    const isRTL = props.dir === 'rtl';

    let percentage;
    if (isRTL) {
      percentage = ((rect.right - position) / rect.width) * 100;
    } else {
      percentage = ((position - rect.left) / rect.width) * 100;
    }

    percentage = Math.max(0, Math.min(100, percentage));

    let value = (percentage / 100) * (props.max - props.min) + props.min;

    // Snap to step
    value = Math.round(value / props.step) * props.step;

    return Number(value.toFixed(2));
  };

  const startDragging = (event, index) => {
    if (props.disabled) return;

    event.preventDefault();
    isDragging.value = true;
    activeThumb.value = index;

    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', stopDragging);
  };

  const handleDragging = (event) => {
    if (!isDragging.value || props.disabled) return;

    const newValue = getValueFromPosition(event.clientX);
    const newValues = [...values.value];

    // Ensure values stay in order and respect step
    if (activeThumb.value === 0) {
      newValues[0] = Math.min(newValue, values.value[1] - props.step);
    } else {
      newValues[1] = Math.max(newValue, values.value[0] + props.step);
    }

    values.value = newValues;
  };

  const stopDragging = () => {
    isDragging.value = false;
    activeThumb.value = null;
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', stopDragging);
  };

  const handleTrackClick = (event) => {
    if (props.disabled) return;

    const clickValue = getValueFromPosition(event.clientX);
    const distances = values.value.map((v) => Math.abs(v - clickValue));
    const closestIndex = distances.indexOf(Math.min(...distances));

    const newValues = [...values.value];
    newValues[closestIndex] = clickValue;

    // Ensure values stay in order
    if (closestIndex === 0 && clickValue > values.value[1]) {
      newValues[0] = values.value[1] - props.step;
    } else if (closestIndex === 1 && clickValue < values.value[0]) {
      newValues[1] = values.value[0] + props.step;
    }

    values.value = newValues;
  };

  const handleInput = (event) => {
    const value = Number(event.target.value);
    const newValues = [...props.modelValue];
    newValues[0] = value;
    // Ensure second value stays ahead of first value
    newValues[1] = Math.max(value + props.step, newValues[1]);
    emit('update:modelValue', newValues);
  };

  // Watch for external value changes
  watch(
    () => props.modelValue,
    (newValue) => {
      if (!isDragging.value && JSON.stringify(newValue) !== JSON.stringify(values.value)) {
        values.value = newValue;
      }
    },
    { deep: true }
  );

  onMounted(() => {
    // Initial validation
    if (!Array.isArray(values.value) || values.value.length !== 2) {
      values.value = [props.min, props.max];
    }
  });
</script>

<template>
  <div class="relative w-full">
    <input
      type="range"
      :value="modelValue[0]"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-background-hover disabled:cursor-not-allowed disabled:opacity-50"
      :class="{
        'range-rtl': dir === 'rtl',
      }"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
  input[type='range'] {
    @apply accent-primary;
  }

  input[type='range']::-webkit-slider-thumb {
    @apply h-4 w-4 appearance-none rounded-full border-2 border-primary bg-background-surface transition-all hover:scale-110 hover:bg-background-hover hover:shadow-md;
  }

  input[type='range']::-moz-range-thumb {
    @apply h-4 w-4 appearance-none rounded-full border-2 border-primary bg-background-surface transition-all hover:scale-110 hover:bg-background-hover hover:shadow-md;
  }

  .range-rtl {
    direction: rtl;
  }
</style>
