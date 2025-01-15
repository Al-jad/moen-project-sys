<template>
  <div class="flex" dir="rtl">
    <Sidebar />
    
    <div class="mr-[60px] mt-[92px] flex-1">
      <Header />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
</script> 