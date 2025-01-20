<template>
  <Toaster 
    expand 
    richColors 
    position="bottom-left"
    :toasterOptions="{
      style: { direction: 'rtl' }
    }"
  />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
</script> 