<template>
  <div>
    <PrimaryButton
      variant="link"
      @click="$router.push('/')"
      class=""
    >
      <ArrowRight class="w-4 h-4" />
      الرئيسية
    </PrimaryButton>
  </div>
</template>

<script setup>
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { ArrowRight } from 'lucide-vue-next';
</script>
