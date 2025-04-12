<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="flex max-h-[90vh] flex-col dark:bg-gray-800 sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle class="text-right">{{
          isEdit ? 'تعديل الاجراء التنفيذي' : 'اضافة اجراء تنفيذي'
        }}</DialogTitle>
      </DialogHeader>

      <div class="custom-scrollbar flex-1 overflow-y-auto">
        <!-- Non-editable fields -->
        <div class="mx-4 grid grid-cols-2 gap-4 border-b py-4 dark:border-gray-700">
          <div class="grid items-center gap-2">
            <Label class="text-right text-gray-500 dark:text-gray-400">العقد</Label>
            <div class="text-right">{{ contractInfo.name }}</div>
          </div>
          <div class="grid items-center gap-2">
            <Label class="text-right text-gray-500 dark:text-gray-400">المشروع</Label>
            <div class="text-right">{{ contractInfo.project }}</div>
          </div>
        </div>

        <!-- Editable fields -->
        <div class="mx-4 grid gap-y-6 py-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-2 gap-4">
            <FormField label="اسم الاجراء">
              <CustomInput v-model="form.name" dir="rtl" />
            </FormField>
            <FormField label="التفاصيل">
              <CustomInput v-model="form.details" type="textarea" dir="rtl" />
            </FormField>
          </div>

          <!-- Timing and Weight -->
          <div class="grid grid-cols-3 gap-4">
            <FormField label="الوزن">
              <div class="flex items-center gap-2">
                <CustomInput v-model="form.weight" type="number" dir="rtl" />
                <span class="dark:text-gray-400">%</span>
              </div>
            </FormField>

            <FormField label="مدة الاجراء">
              <div class="flex items-center gap-2">
                <CustomInput v-model="form.duration" type="number" dir="rtl" />
                <span class="dark:text-gray-400">يوم</span>
              </div>
            </FormField>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <FormField label="تاريخ البداية">
              <CustomInput v-model="form.startDate" type="date" dir="rtl" />
            </FormField>

            <FormField label="تاريخ النهاية">
              <CustomInput v-model="form.endDate" type="date" dir="rtl" />
            </FormField>
          </div>

          <!-- Progress Section -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <h3 class="text-right font-medium">التقدم المالي</h3>
              <FormField label="التقدم المالي المخطط">
                <div class="flex items-center gap-2">
                  <CustomInput v-model="form.plannedFinancialProgress" type="number" dir="rtl" />
                  <span class="dark:text-gray-400">%</span>
                </div>
              </FormField>

              <div
                class="mt-6 grid grid-cols-1 gap-6 rounded-lg border border-red-200 bg-red-50/30 p-6 dark:border-red-900/50 dark:bg-red-950/20"
              >
                <div class="space-y-4">
                  <div class="mb-4 flex items-center gap-2">
                    <Icon icon="lucide:crown" class="h-5 w-5 text-red-500" />
                    <h3 class="font-medium text-red-600 dark:text-red-400">الميزات المتقدمة</h3>
                  </div>
                  <PremiumMask>
                    <FormField label="التقدم المالي الفعلي">
                      <div class="flex items-center gap-2">
                        <CustomInput
                          v-model="form.actualFinancialProgress"
                          type="number"
                          dir="rtl"
                        />
                        <span class="dark:text-gray-400">%</span>
                      </div>
                    </FormField>
                  </PremiumMask>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <h3 class="text-right font-medium">نسب الإنجاز</h3>
              <FormField label="نسبة الانجاز المخطط">
                <div class="flex items-center gap-2">
                  <CustomInput
                    disabled
                    v-model="form.plannedCompletionPercentage"
                    type="number"
                    dir="rtl"
                  />
                  <span class="dark:text-gray-400">%</span>
                </div>
              </FormField>
            </div>
          </div>

          <!-- Premium Features Section -->
          <div
            class="mt-6 grid grid-cols-2 gap-6 rounded-lg border border-red-200 bg-red-50/30 p-6 dark:border-red-900/50 dark:bg-red-950/20"
          >
            <div class="space-y-4">
              <div class="mb-4 flex items-center gap-2">
                <Icon icon="lucide:crown" class="h-5 w-5 text-red-500" />
                <h3 class="font-medium text-red-600 dark:text-red-400">الميزات المتقدمة</h3>
              </div>
              <PremiumMask>
                <FormField label="نسبة الانجاز الفعلي">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      disabled
                      v-model="form.actualCompletionPercentage"
                      type="number"
                      dir="rtl"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>
              </PremiumMask>
            </div>

            <div class="space-y-4">
              <div class="h-6"></div>
              <PremiumMask>
                <FormField label="الانحراف الفني">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      disabled
                      v-model="form.technicalDeviation"
                      type="number"
                      dir="rtl"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>
              </PremiumMask>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-4 flex justify-between border-t pt-4 dark:border-gray-700">
        <PrimaryButton variant="outline" @click="$emit('update:isOpen', false)">
          الغاء
        </PrimaryButton>
        <PrimaryButton type="submit" @click="handleSubmit">
          <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
          {{ isEdit ? 'تعديل' : 'إضافة' }}
        </PrimaryButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    procedure: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    contractInfo: {
      type: Object,
      default: () => ({
        name: 'عقد تجهيز محطات المراقبة 25 لسنة 2025',
        project: 'مشروع A',
      }),
    },
  });

  const emit = defineEmits(['update:isOpen', 'save']);

  const form = ref({
    name: '',
    details: '',
    weight: 0,
    duration: 0,
    startDate: '',
    endDate: '',
    plannedCompletionPercentage: 0,
    actualCompletionPercentage: 0,
    technicalDeviation: 0,
    plannedFinancialProgress: 0,
    actualFinancialProgress: 0,
  });

  watch(
    () => props.procedure,
    (newVal) => {
      if (newVal) {
        form.value = {
          name: newVal.name || '',
          details: newVal.details || '',
          weight: newVal.weight || 0,
          duration: newVal.duration || 0,
          startDate: newVal.startDate ? new Date(newVal.startDate).toISOString().split('T')[0] : '',
          endDate: newVal.endDate ? new Date(newVal.endDate).toISOString().split('T')[0] : '',
          plannedCompletionPercentage: newVal.plannedCompletionPercentage || 0,
          actualCompletionPercentage: newVal.actualCompletionPercentage || 0,
          technicalDeviation: newVal.technicalDeviation || 0,
          plannedFinancialProgress: newVal.plannedFinancialProgress || 0,
          actualFinancialProgress: newVal.actualFinancialProgress || 0,
        };
      } else {
        // Reset form to default values
        form.value = {
          name: '',
          details: '',
          weight: 0,
          duration: 0,
          startDate: '',
          endDate: '',
          plannedCompletionPercentage: 0,
          actualCompletionPercentage: 0,
          technicalDeviation: 0,
          plannedFinancialProgress: 0,
          actualFinancialProgress: 0,
        };
      }
    },
    { immediate: true }
  );

  const handleSubmit = () => {
    // Format the form data to match API expectations
    const formattedData = {
      name: form.value.name,
      details: form.value.details,
      weight: Number(form.value.weight),
      duration: Number(form.value.duration),
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      plannedCompletionPercentage: Number(form.value.plannedCompletionPercentage),
      actualCompletionPercentage: Number(form.value.actualCompletionPercentage),
      technicalDeviation: Number(form.value.technicalDeviation),
      plannedFinancialProgress: Number(form.value.plannedFinancialProgress),
      actualFinancialProgress: Number(form.value.actualFinancialProgress),
    };

    emit('save', formattedData);
    emit('update:isOpen', false);
  };
</script>

<style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
    direction: ltr;
    margin-left: 1rem;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 0.5rem;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 0.25rem;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 0.25rem;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }

  /* Fix for RTL content with LTR scrollbar */
  .custom-scrollbar > * {
    direction: rtl;
  }
</style>
