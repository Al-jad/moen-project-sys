<template>
  <TooltipProvider>
    <RouterView />
  </TooltipProvider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { TooltipProvider } from '@/components/ui/tooltip'
</script>
