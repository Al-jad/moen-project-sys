<template>
  <div
    class="p-6 transition-all duration-300 border shadow-sm rounded-xl border-border bg-background-surface hover:shadow-md"
  >
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 rounded-lg bg-success/10">
        <Icon icon="lucide:trending-up" class="w-5 h-5 text-success" />
      </div>
      <h2 class="text-xl font-semibold text-foreground-heading">إنجازات المشروع</h2>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Financial Achievement -->
      <div
        class="p-4 transition-all duration-200 border rounded-lg group border-border bg-background-card hover:border-success/30 hover:shadow-sm"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:dollar-sign" class="w-4 h-4 text-success" />
            <label class="block text-sm font-medium text-foreground-heading">
              الإنجاز المالي
            </label>
          </div>

          <div class="relative">
            <NumberInput
              type="number"
              v-model.number="financialAchievement"
              @input="updateFinancialAchievement"
              placeholder="0"
              min="0"
              max="100"
              class="pr-8"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span class="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-foreground-muted">التقدم</span>
              <span class="font-medium text-foreground-heading">{{ financialAchievement }}%</span>
            </div>
            <div class="w-full h-2 overflow-hidden rounded-full bg-border">
              <div
                class="h-full transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-success to-success/80"
                :style="{ width: `${Math.min(financialAchievement, 100)}%` }"
              ></div>
            </div>
            <div class="flex items-center gap-1 text-xs">
              <Icon
                :icon="getStatusIcon(financialAchievement)"
                :class="getStatusColor(financialAchievement)"
                class="w-3 h-3"
              />
              <span :class="getStatusColor(financialAchievement)">
                {{ getStatusText(financialAchievement) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Achievement (Premium) -->
      <PremiumMask>
        <div
          class="p-4 transition-all duration-200 border rounded-lg group border-border bg-background-card opacity-60 hover:border-info/30 hover:shadow-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:settings" class="w-4 h-4 text-info" />
              <label class="block text-sm font-medium text-foreground-heading">
                الإنجاز الفني
              </label>
              <div class="rounded-full bg-warning/10 px-2 py-0.5">
                <span class="text-xs font-medium text-warning">مميز</span>
              </div>
            </div>

            <div class="relative">
              <NumberInput
                type="number"
                :value="technicalAchievement"
                disabled
                placeholder="0"
                class="pr-8"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span class="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <!-- Disabled Progress Bar -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-foreground-muted">التقدم</span>
                <span class="font-medium text-foreground-muted">{{ technicalAchievement }}%</span>
              </div>
              <div class="w-full h-2 overflow-hidden rounded-full bg-border">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-muted to-muted/60"
                  :style="{ width: `${Math.min(technicalAchievement, 100)}%` }"
                ></div>
              </div>
              <div class="flex items-center gap-1 text-xs text-foreground-muted">
                <Icon icon="lucide:lock" class="w-3 h-3" />
                <span>متاح في النسخة المميزة</span>
              </div>
            </div>
          </div>
        </div>
      </PremiumMask>
    </div>

    <!-- Summary Section -->
    <div
      v-if="financialAchievement > 0"
      class="p-4 mt-6 border rounded-lg border-primary/20 bg-primary/5"
    >
      <div class="flex items-center gap-2 mb-2">
        <Icon icon="lucide:bar-chart-3" class="w-4 h-4 text-primary" />
        <span class="text-sm font-medium text-primary">ملخص الإنجازات</span>
      </div>
      <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
        <div class="flex justify-between">
          <span class="text-foreground-muted">الإنجاز المالي:</span>
          <span class="font-medium text-foreground-heading">{{ financialAchievement }}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-foreground-muted">الحالة:</span>
          <span :class="getStatusColor(financialAchievement)" class="font-medium">
            {{ getStatusText(financialAchievement) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import NumberInput from '@/components/NumberInput.vue';
  import PremiumMask from '@/components/PremiumMask.vue';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import { Icon } from '@iconify/vue';
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

  const getStatusText = (achievement) => {
    if (achievement >= 90) return 'ممتاز';
    if (achievement >= 70) return 'جيد جداً';
    if (achievement >= 50) return 'جيد';
    if (achievement >= 25) return 'مقبول';
    if (achievement > 0) return 'ضعيف';
    return 'لم يبدأ';
  };

  const getStatusColor = (achievement) => {
    if (achievement >= 90) return 'text-success';
    if (achievement >= 70) return 'text-info';
    if (achievement >= 50) return 'text-warning';
    if (achievement >= 25) return 'text-warning';
    if (achievement > 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getStatusIcon = (achievement) => {
    if (achievement >= 90) return 'lucide:check-circle';
    if (achievement >= 70) return 'lucide:trending-up';
    if (achievement >= 50) return 'lucide:activity';
    if (achievement >= 25) return 'lucide:clock';
    if (achievement > 0) return 'lucide:alert-triangle';
    return 'lucide:circle';
  };
</script>
