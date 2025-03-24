<template>
  <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">إنجازات المشروع</h2>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Financial Achievement -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          الإنجاز المالي
        </label>
        <div class="relative">
          <input
            type="number"
            v-model="financialAchievement"
            @input="updateFinancialAchievement"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="0"
            min="0"
            max="100"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
      </div>

      <!-- Technical Achievement -->
      <div class="relative space-y-2 p-4">
        <div
          class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-lg bg-red-50/90 dark:bg-red-950/40"
          @click="showPremiumModal"
        >
          <div class="space-y-2 text-center">
            <Icon icon="lucide:lock" class="mx-auto h-8 w-8 text-red-500 dark:text-red-400" />
            <p class="text-sm font-medium text-red-600 dark:text-red-300">ميزة مميزة</p>
            <p class="text-xs text-red-500 dark:text-red-400">متاحة فقط في النسخة المميزة</p>
          </div>
        </div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          الإنجاز الفني
        </label>
        <div class="relative">
          <input
            type="number"
            v-model="technicalAchievement"
            disabled
            class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
            placeholder="0"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Modal -->
    <PremiumModal v-model:open="isPremiumModalOpen" />
  </div>
</template>

<script setup>
  import PremiumModal from '@/components/PremiumModal.vue';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';

  const store = useFundedProjectStore();
  const technicalAchievement = ref(0);
  const financialAchievement = ref(0);
  const isPremiumModalOpen = ref(false);

  const showPremiumModal = () => {
    isPremiumModalOpen.value = true;
  };

  onMounted(() => {
    // Initialize values from store if they exist
    if (store.form.financialAchievement !== undefined && store.form.financialAchievement !== null) {
      financialAchievement.value = Number(store.form.financialAchievement);
    } else {
      // Initialize with 0 if not set
      financialAchievement.value = 0;
      store.form.financialAchievement = 0;
    }
  });

  // Update financial achievement in store
  const updateFinancialAchievement = () => {
    // Ensure value is between 0 and 100
    const value = Math.min(Math.max(financialAchievement.value, 0), 100);
    financialAchievement.value = value;

    // Update store with explicit number type
    store.form.financialAchievement = Number(value);
  };
</script>
