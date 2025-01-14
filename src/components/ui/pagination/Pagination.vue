<script setup>
defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    class="mx-auto flex w-full justify-center"
  >
    <slot />
  </nav>
</template> 