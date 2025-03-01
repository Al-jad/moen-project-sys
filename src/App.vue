<template>
  <TooltipProvider>
    <RouterView />
    <Footer v-if="!isLoginPage" />
  </TooltipProvider>
</template>

<script setup>
  import Footer from '@/components/Footer.vue';
  import { TooltipProvider } from '@/components/ui/tooltip';
  import { computed } from 'vue';
  import { RouterView, useRoute } from 'vue-router';
  const route = useRoute();
  const isLoginPage = computed(() => route.path === '/login');
</script>
