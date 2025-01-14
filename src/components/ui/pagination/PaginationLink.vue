<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9',
      isActive ? 'bg-accent text-accent-foreground' : ''
    ]"
  >
    <slot />
  </button>
</template> 