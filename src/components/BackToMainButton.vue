<template>
  <div>
    <PrimaryButton
      variant="link"
      @click="$router.push('/')"
      class="flex items-center text-blue-600 dark:text-blue-400"
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
