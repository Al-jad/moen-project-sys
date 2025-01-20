<template>
  <div class="flex" dir="rtl">
    <Sidebar />
    
    <div class="mr-[60px] mt-[80px] flex-1">
      <Header />
      <slot></slot>
    </div>
    <Toaster />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Toaster from '@/components/ui/toaster.vue'
</script> 