<template>
  <div
    class="relative cursor-pointer space-y-2 rounded-lg bg-red-50/90 p-4 py-6 dark:bg-red-950/40"
    @click="showPremiumModal"
  >
    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <div class="space-y-2 text-center">
        <Icon icon="lucide:lock" class="mx-auto h-8 w-8 text-red-500 dark:text-red-400" />
        <p class="text-sm font-medium text-red-600 dark:text-red-300">ميزة مميزة</p>
        <p class="text-xs text-red-500 dark:text-red-400">متاحة فقط في النسخة المميزة</p>
      </div>
    </div>
    <div class="pointer-events-none opacity-30">
      <slot />
    </div>
  </div>
  <PremiumModal v-model:open="showModal" @close="closeModal" />
</template>
<script setup>
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';
  import PremiumModal from '../components/PremiumModal.vue';

  const showModal = ref(false);

  const showPremiumModal = () => {
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
  };
</script>
