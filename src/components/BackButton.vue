<template>
  <div>
    <PrimaryButton variant="ghost" @click="$router.back()" class="flex items-center gap-2">
      <ArrowRight class="w-4 h-4" />
      رجوع
    </PrimaryButton>
  </div>
</template>

<script setup>
  import { ArrowRight } from 'lucide-vue-next';
  import PrimaryButton from '@/components/PrimaryButton.vue';
</script>
