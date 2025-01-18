<template>
  <TooltipProvider>
    <RouterView />
    <Footer />
  </TooltipProvider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import Footer from '@/components/Footer.vue'
</script>
