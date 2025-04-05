<template>
  <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">إنجازات المشروع</h2>
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          الإنجاز المالي
        </label>
        <div class="relative">
          <NumberInput
            type="number"
            v-model.number="financialAchievement"
            @input="updateFinancialAchievement"
            placeholder="0"
            min="0"
            max="100"
          />
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
      </div>
      <PremiumMask>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الإنجاز الفني
          </label>
          <div class="relative">
            <NumberInput type="number" :value="technicalAchievement" disabled placeholder="0" />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>
      </PremiumMask>
    </div>
  </div>
</template>
<script setup>
  import NumberInput from '@/components/NumberInput.vue';
  import PremiumMask from '@/components/PremiumMask.vue';
  import { useFundedProjectStore } from '@/stores/fundedProject';
  import { onMounted, ref } from 'vue';

  const store = useFundedProjectStore();
  const technicalAchievement = ref(0);
  const financialAchievement = ref(0);

  onMounted(() => {
    if (store.form.financialAchievement !== undefined && store.form.financialAchievement !== null) {
      financialAchievement.value = Number(store.form.financialAchievement);
    } else {
      financialAchievement.value = 0;
      store.form.financialAchievement = 0;
    }
  });

  const updateFinancialAchievement = () => {
    const value = Math.min(Math.max(financialAchievement.value, 0), 100);
    financialAchievement.value = value;
    store.form.financialAchievement = Number(value);
  };
</script>
