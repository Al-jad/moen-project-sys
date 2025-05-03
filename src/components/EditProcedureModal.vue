<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="flex max-h-[90vh] flex-col dark:bg-gray-800 sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle class="text-right">{{
          isEdit ? 'تعديل الاجراء التنفيذي' : 'اضافة اجراء تنفيذي'
        }}</DialogTitle>
      </DialogHeader>

      <div class="custom-scrollbar flex-1 overflow-y-auto">
        <!-- Contract Info Header -->
        <div class="mx-4 border-b py-4 dark:border-gray-700">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">معلومات العقد</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">تفاصيل العقد والمشروع</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="grid items-center gap-2">
              <Label class="text-right text-gray-500 dark:text-gray-400">العقد</Label>
              <div class="text-right font-medium text-gray-900 dark:text-gray-100">{{
                contractInfo.name
              }}</div>
            </div>
            <div class="grid items-center gap-2">
              <Label class="text-right text-gray-500 dark:text-gray-400">المشروع</Label>
              <div class="text-right font-medium text-gray-900 dark:text-gray-100">{{
                contractInfo.project
              }}</div>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="mx-4 border-b py-4 dark:border-gray-700">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >المعلومات الأساسية</h3
            >
            <p class="text-sm text-gray-500 dark:text-gray-400">تفاصيل الإجراء الأساسية</p>
          </div>
          <div class="grid gap-y-6">
            <div class="grid grid-cols-2 gap-4">
              <FormField label="اسم الاجراء">
                <CustomInput v-model="form.name" dir="rtl" placeholder="ادخل اسم الاجراء" />
              </FormField>
              <FormField label="التفاصيل">
                <CustomInput
                  v-model="form.details"
                  type="textarea"
                  dir="rtl"
                  placeholder="ادخل تفاصيل الاجراء"
                />
              </FormField>
            </div>

            <!-- Timing and Weight -->
            <div class="grid grid-cols-3 gap-4">
              <FormField label="الوزن">
                <div class="flex items-center gap-2">
                  <CustomInput
                    v-model="form.weight"
                    type="number"
                    dir="rtl"
                    placeholder="ادخل الوزن"
                    min="0"
                    max="100"
                  />
                  <span class="dark:text-gray-400">%</span>
                </div>
              </FormField>

              <FormField label="مدة الاجراء">
                <div class="flex items-center gap-2">
                  <CustomInput
                    v-model="form.duration"
                    type="number"
                    dir="rtl"
                    placeholder="المدة"
                    :readonly="form.startDate && form.endDate"
                  />
                  <span class="dark:text-gray-400">يوم</span>
                </div>
              </FormField>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <FormField label="تاريخ البداية">
                <DateInput v-model="form.startDate" />
              </FormField>

              <FormField label="تاريخ النهاية">
                <DateInput v-model="form.endDate" />
              </FormField>
            </div>
          </div>
        </div>

        <!-- Manual Progress Section -->
        <div class="mx-4 border-b py-4 dark:border-gray-700">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >نسب الإنجاز المدخلة</h3
            >
            <p class="text-sm text-gray-500 dark:text-gray-400">النسب المدخلة يدوياً</p>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <!-- Financial Progress -->
            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                  <Icon icon="lucide:trending-up" class="h-4 w-4 text-blue-500" />
                  المعلومات المالية
                </h6>
              </div>
              <div class="space-y-3">
                <FormField label="نسبة الإنجاز المالي المخطط له">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      v-model="form.plannedFinancialProgress"
                      type="number"
                      dir="rtl"
                      min="0"
                      max="100"
                      placeholder="ادخل النسبة"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>

                <FormField label="نسبة الإنجاز المالي الفعلي">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      v-model="form.actualFinancialProgress"
                      type="number"
                      dir="rtl"
                      min="0"
                      max="100"
                      placeholder="ادخل النسبة"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>
              </div>
            </div>

            <!-- Technical Progress -->
            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                  <Icon icon="lucide:settings" class="h-4 w-4 text-purple-500" />
                  المعلومات الفنية
                </h6>
              </div>
              <div class="space-y-3">
                <FormField label="نسبة الإنجاز الفني المخطط له">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      v-model="form.plannedCompletionPercentage"
                      type="number"
                      dir="rtl"
                      min="0"
                      max="100"
                      placeholder="ادخل النسبة"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>

                <FormField label="نسبة الإنجاز الفني الفعلي">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      v-model="form.actualCompletionPercentage"
                      type="number"
                      dir="rtl"
                      min="0"
                      max="100"
                      placeholder="ادخل النسبة"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>

                <FormField label="نسبة الإنحراف الفني">
                  <div class="flex items-center gap-2">
                    <CustomInput
                      v-model="form.technicalDeviation"
                      type="number"
                      dir="rtl"
                      readonly
                      :class="{
                        'text-green-600': form.technicalDeviation >= 0,
                        'text-red-600': form.technicalDeviation < 0,
                      }"
                    />
                    <span class="dark:text-gray-400">%</span>
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Calculated Progress Section -->
        <div class="mx-4 py-4">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">النسب المحسوبة</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400"
              >النسب المحسوبة تلقائياً من النظام</p
            >
          </div>
          <div class="grid grid-cols-2 gap-6">
            <!-- Calculated Financial Progress -->
            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                  <Icon icon="lucide:calculator" class="h-4 w-4 text-blue-500" />
                  المعلومات المالية المحسوبة
                </h6>
              </div>
              <div class="space-y-3">
                <FormField label="نسبة الانجاز المالي المخطط المحسوب">
                  <NumberInput
                    v-model="form.calculatedPlannedFinancialProgress"
                    placeholder="القيمة المحسوبة"
                    unit="%"
                    min="0"
                    max="100"
                  />
                </FormField>

                <FormField label="نسبة الانجاز المالي الفعلي المحسوب">
                  <NumberInput
                    v-model="form.calculatedActualFinancialProgress"
                    placeholder="القيمة المحسوبة"
                    unit="%"
                    min="0"
                    max="100"
                  />
                </FormField>
              </div>
            </div>

            <!-- Calculated Technical Progress -->
            <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <h6 class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                  <Icon icon="lucide:calculator" class="h-4 w-4 text-purple-500" />
                  المعلومات الفنية المحسوبة
                </h6>
              </div>
              <div class="space-y-3">
                <FormField label="نسبة الانجاز الفني المخطط المحسوب">
                  <NumberInput
                    v-model="form.calculatedPlannedCompletionPercentage"
                    placeholder="القيمة المحسوبة"
                    unit="%"
                    min="0"
                    max="100"
                  />
                </FormField>

                <FormField label="نسبة الانجاز الفني الفعلي المحسوب">
                  <NumberInput
                    v-model="form.calculatedActualCompletionPercentage"
                    placeholder="القيمة المحسوبة"
                    unit="%"
                    min="0"
                    max="100"
                  />
                </FormField>

                <FormField label="نسبة الانحراف الفني المحسوب">
                  <NumberInput
                    v-model="form.calculatedTechnicalDeviation"
                    placeholder="القيمة المحسوبة"
                    unit="%"
                    min="0"
                    max="100"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-4 flex justify-between border-t pt-4 dark:border-gray-700">
        <Button variant="outline" @click="$emit('update:isOpen', false)"> الغاء </Button>
        <Button type="submit" @click="handleSubmit">
          <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
          {{ isEdit ? 'تعديل' : 'إضافة' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';
  import { Icon } from '@iconify/vue';
  import { computed, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';

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
    calculatedPlannedCompletionPercentage: null,
    actualCompletionPercentage: 0,
    calculatedActualCompletionPercentage: null,
    technicalDeviation: 0,
    calculatedTechnicalDeviation: null,
    plannedFinancialProgress: 0,
    calculatedPlannedFinancialProgress: null,
    actualFinancialProgress: 0,
    calculatedActualFinancialProgress: null,
    contractId: null,
    id: null,
    createdAt: null,
    updatedAt: null,
  });

  watch(
    () => props.procedure,
    (newProcedure) => {
      if (newProcedure) {
        form.value = {
          name: newProcedure.name || '',
          details: newProcedure.details || '',
          weight: newProcedure.weight || 0,
          duration: newProcedure.duration || 0,
          startDate: newProcedure.startDate || '',
          endDate: newProcedure.endDate || '',
          plannedCompletionPercentage: newProcedure.plannedCompletionPercentage || 0,
          calculatedPlannedCompletionPercentage:
            newProcedure.calculatedPlannedCompletionPercentage || null,
          actualCompletionPercentage: newProcedure.actualCompletionPercentage || 0,
          calculatedActualCompletionPercentage:
            newProcedure.calculatedActualCompletionPercentage || null,
          technicalDeviation: newProcedure.technicalDeviation || 0,
          calculatedTechnicalDeviation: newProcedure.calculatedTechnicalDeviation || null,
          plannedFinancialProgress: newProcedure.plannedFinancialProgress || 0,
          calculatedPlannedFinancialProgress:
            newProcedure.calculatedPlannedFinancialProgress || null,
          actualFinancialProgress: newProcedure.actualFinancialProgress || 0,
          calculatedActualFinancialProgress: newProcedure.calculatedActualFinancialProgress || null,
          contractId: newProcedure.contractId || null,
          id: newProcedure.id || null,
          createdAt: newProcedure.createdAt || null,
          updatedAt: newProcedure.updatedAt || null,
        };
      } else {
        form.value = {
          name: '',
          details: '',
          weight: 0,
          duration: 0,
          startDate: '',
          endDate: '',
          plannedCompletionPercentage: 0,
          calculatedPlannedCompletionPercentage: null,
          actualCompletionPercentage: 0,
          calculatedActualCompletionPercentage: null,
          technicalDeviation: 0,
          calculatedTechnicalDeviation: null,
          plannedFinancialProgress: 0,
          calculatedPlannedFinancialProgress: null,
          actualFinancialProgress: 0,
          calculatedActualFinancialProgress: null,
          contractId: null,
          id: null,
          createdAt: null,
          updatedAt: null,
        };
      }
    },
    { immediate: true }
  );

  const handleSubmit = () => {
    // Validate required fields
    if (!form.value.name) {
      toast.error('يجب إدخال اسم الاجراء');
      return;
    }

    if (!form.value.duration) {
      toast.error('يجب إدخال مدة الاجراء');
      return;
    }

    if (!form.value.weight) {
      toast.error('يجب إدخال وزن الاجراء');
      return;
    }

    if (!form.value.startDate) {
      toast.error('يجب إدخال تاريخ البداية');
      return;
    }

    if (!form.value.endDate) {
      toast.error('يجب إدخال تاريخ النهاية');
      return;
    }

    // Format the form data to match API expectations
    const formattedData = {
      name: form.value.name,
      details: form.value.details,
      weight: Number(form.value.weight),
      duration: Number(form.value.duration),
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      plannedCompletionPercentage: Number(form.value.plannedCompletionPercentage),
      calculatedPlannedCompletionPercentage: Number(
        form.value.calculatedPlannedCompletionPercentage
      ),
      actualCompletionPercentage: Number(form.value.actualCompletionPercentage),
      calculatedActualCompletionPercentage: Number(form.value.calculatedActualCompletionPercentage),
      technicalDeviation: Number(form.value.technicalDeviation),
      calculatedTechnicalDeviation: Number(form.value.calculatedTechnicalDeviation),
      plannedFinancialProgress: Number(form.value.plannedFinancialProgress),
      calculatedPlannedFinancialProgress: Number(form.value.calculatedPlannedFinancialProgress),
      actualFinancialProgress: Number(form.value.actualFinancialProgress),
      calculatedActualFinancialProgress: Number(form.value.calculatedActualFinancialProgress),
    };

    try {
      emit('save', formattedData);
      emit('update:isOpen', false);
      toast.success(props.isEdit ? 'تم تعديل الاجراء بنجاح! 🎉' : 'تم إضافة الاجراء بنجاح! 🎉');
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast.error('حدث خطأ أثناء حفظ الاجراء');
    }
  };

  // Add computed properties for technical deviation
  const calculateTechnicalDeviation = computed(() => {
    const actual = Number(form.value.actualCompletionPercentage) || 0;
    const planned = Number(form.value.plannedCompletionPercentage) || 0;
    return actual - planned;
  });

  // Add watch for dates to auto-calculate duration
  watch([() => form.value.startDate, () => form.value.endDate], ([newStartDate, newEndDate]) => {
    if (newStartDate && newEndDate) {
      const start = new Date(newStartDate);
      const end = new Date(newEndDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      form.value.duration = diffDays;
    }
  });
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
