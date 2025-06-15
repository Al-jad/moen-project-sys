<template>
  <BaseAddEditModal
    :open="isOpen"
    @update:open="$emit('update:isOpen', $event)"
    :edit-data="props.procedure"
    :default-form-data="defaultFormData"
    entity-name="الاجراء التنفيذي"
    :loading="isLoading"
    :validate="validateForm"
    @save="handleSave"
    @cancel="$emit('update:isOpen', false)"
    content-class="max-w-[800px] h-[90vh]"
  >
    <template #form="{ formData, updateForm, isLoading: modalLoading }">
      <!-- Contract Info Badge -->
      <div
        class="mx-auto flex w-1/2 items-center justify-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2"
      >
        <Icon icon="lucide:briefcase" class="h-4 w-4 text-accent" />
        <span class="text-sm font-medium text-accent">{{ contractInfo.name }}</span>
      </div>

      <div class="space-y-6">
        <!-- Basic Information Section -->
        <div class="space-y-4 rounded-xl border border-border/60 bg-background/50 p-4">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:info" class="h-5 w-5 text-primary" />
            <h3 class="text-sm font-semibold text-foreground-body">المعلومات الأساسية</h3>
          </div>

          <!-- Name Field -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Icon
                icon="lucide:type"
                class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
                :class="{ 'animate-pulse': modalLoading }"
              />
              <Label for="name" class="text-sm font-semibold text-foreground-body"
                >اسم الاجراء</Label
              >
              <span class="text-sm text-destructive">*</span>
            </div>
            <div class="group relative">
              <CustomInput
                id="name"
                :model-value="formData.name"
                :disabled="modalLoading"
                placeholder="ادخل اسم الاجراء..."
                @update:model-value="updateForm('name', $event)"
              />
            </div>
          </div>

          <!-- Details Field -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Icon
                icon="lucide:align-left"
                class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
                :class="{ 'animate-pulse': modalLoading }"
              />
              <Label for="details" class="text-sm font-semibold text-foreground-body"
                >التفاصيل</Label
              >
            </div>
            <div class="group relative">
              <CustomTextArea
                id="details"
                :model-value="formData.details"
                :disabled="modalLoading"
                placeholder="ادخل تفاصيل الاجراء..."
                @update:model-value="updateForm('details', $event)"
              />
            </div>
          </div>

          <!-- Weight and Duration -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Icon
                  icon="lucide:scale"
                  class="h-5 w-5 text-muted-foreground"
                  :class="{ 'animate-pulse': modalLoading }"
                />
                <Label for="weight" class="text-sm font-semibold text-foreground-body">الوزن</Label>
                <span class="text-sm text-destructive">*</span>
              </div>
              <div class="group relative">
                <NumberInput
                  id="weight"
                  type="number"
                  :model-value="formData.weight"
                  :disabled="modalLoading"
                  placeholder="ادخل الوزن"
                  min="0"
                  max="100"
                  @update:model-value="updateForm('weight', $event)"
                />
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  >%</span
                >
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Icon
                  icon="lucide:clock"
                  class="h-5 w-5 text-muted-foreground"
                  :class="{ 'animate-pulse': modalLoading }"
                />
                <Label for="duration" class="text-sm font-semibold text-foreground-body"
                  >مدة الاجراء</Label
                >
                <span class="text-sm text-destructive">*</span>
              </div>
              <div class="group relative">
                <NumberInput
                  id="duration"
                  type="number"
                  :model-value="formData.duration"
                  :disabled="modalLoading || (formData.startDate && formData.endDate)"
                  placeholder="المدة"
                  min="0"
                  @update:model-value="updateForm('duration', $event)"
                />
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  >يوم</span
                >
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Icon
                  icon="lucide:calendar-range"
                  class="h-5 w-5 text-muted-foreground"
                  :class="{ 'animate-pulse': modalLoading }"
                />
                <Label for="startDate" class="text-sm font-semibold text-foreground-body"
                  >تاريخ البداية</Label
                >
                <span class="text-sm text-red-500">*</span>
              </div>
              <DateInput
                id="startDate"
                :model-value="formData.startDate"
                @update:model-value="updateForm('startDate', $event)"
                :disabled="modalLoading"
                class="h-12 rounded-xl border-2 border-border/60 bg-background/50"
              />
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Icon
                  icon="lucide:calendar-range"
                  class="h-5 w-5 text-muted-foreground"
                  :class="{ 'animate-pulse': modalLoading }"
                />
                <Label for="endDate" class="text-sm font-semibold text-foreground-body"
                  >تاريخ النهاية</Label
                >
                <span class="text-sm text-red-500">*</span>
              </div>
              <DateInput
                id="endDate"
                :model-value="formData.endDate"
                @update:model-value="updateForm('endDate', $event)"
                :disabled="modalLoading"
                class="h-12 rounded-xl border-2 border-border/60 bg-background/50"
              />
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Financial Progress -->
          <div class="space-y-4 rounded-xl border border-border/60 bg-background/50 p-4">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:trending-up" class="h-5 w-5 text-blue-500" />
              <h3 class="text-sm font-semibold text-foreground-body">المعلومات المالية</h3>
            </div>

            <div class="space-y-4">
              <div class="space-y-3">
                <Label class="text-sm text-muted-foreground">نسبة الإنجاز المالي المخطط له</Label>
                <div class="group relative">
                  <NumberInput
                    type="number"
                    :model-value="formData.plannedFinancialProgress"
                    @update:model-value="updateForm('plannedFinancialProgress', $event)"
                    :disabled="modalLoading"
                    min="0"
                    max="100"
                  />
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >%</span
                  >
                </div>
              </div>

              <div class="space-y-3">
                <Label class="text-sm text-muted-foreground">نسبة الإنجاز المالي الفعلي</Label>
                <div class="group relative">
                  <NumberInput
                    type="number"
                    :model-value="formData.actualFinancialProgress"
                    @update:model-value="updateForm('actualFinancialProgress', $event)"
                    :disabled="modalLoading"
                    min="0"
                    max="100"
                  />
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >%</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Progress -->
          <div class="space-y-4 rounded-xl border border-border/60 bg-background/50 p-4">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:settings" class="h-5 w-5 text-purple-500" />
              <h3 class="text-sm font-semibold text-foreground-body">المعلومات الفنية</h3>
            </div>

            <div class="space-y-4">
              <div class="space-y-3">
                <Label class="text-sm text-muted-foreground">نسبة الإنجاز الفني المخطط له</Label>
                <div class="group relative">
                  <NumberInput
                    type="number"
                    :model-value="formData.plannedCompletionPercentage"
                    @update:model-value="updateForm('plannedCompletionPercentage', $event)"
                    :disabled="modalLoading"
                    min="0"
                    max="100"
                  />
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >%</span
                  >
                </div>
              </div>

              <div class="space-y-3">
                <Label class="text-sm text-muted-foreground">نسبة الإنجاز الفني الفعلي</Label>
                <div class="group relative">
                  <NumberInput
                    type="number"
                    :model-value="formData.actualCompletionPercentage"
                    @update:model-value="updateForm('actualCompletionPercentage', $event)"
                    :disabled="modalLoading"
                    min="0"
                    max="100"
                  />
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >%</span
                  >
                </div>
              </div>

              <div class="space-y-3">
                <Label class="text-sm text-muted-foreground">نسبة الإنحراف الفني</Label>
                <div class="group relative">
                  <NumberInput
                    type="number"
                    :model-value="
                      Number(formData.actualCompletionPercentage || 0) -
                      Number(formData.plannedCompletionPercentage || 0)
                    "
                    disabled
                    :class="{
                      'text-green-600':
                        Number(formData.actualCompletionPercentage || 0) -
                          Number(formData.plannedCompletionPercentage || 0) >=
                        0,
                      'text-red-600':
                        Number(formData.actualCompletionPercentage || 0) -
                          Number(formData.plannedCompletionPercentage || 0) <
                        0,
                    }"
                  />
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseAddEditModal>
</template>

<script setup>
  import BaseAddEditModal from '@/components/BaseAddEditModal.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import DateInput from '@/components/DateInput.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Label } from '@/components/ui/label';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';
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

  const isLoading = ref(false);

  const defaultFormData = computed(() => ({
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
  }));

  // Validation function
  const validateForm = (formData) => {
    if (!formData.name) {
      toast.error('يجب إدخال اسم الاجراء');
      return false;
    }

    if (!formData.weight) {
      toast.error('يجب إدخال وزن الاجراء');
      return false;
    }

    if (!formData.duration && !(formData.startDate && formData.endDate)) {
      toast.error('يجب إدخال مدة الاجراء أو تواريخ البداية والنهاية');
      return false;
    }

    if (!formData.startDate) {
      toast.error('يجب إدخال تاريخ البداية');
      return false;
    }

    if (!formData.endDate) {
      toast.error('يجب إدخال تاريخ النهاية');
      return false;
    }

    return true;
  };

  const handleSave = async (formData) => {
    try {
      isLoading.value = true;

      // Format the form data
      const formattedData = {
        ...formData,
        weight: Number(formData.weight),
        duration: Number(formData.duration),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        plannedCompletionPercentage: Number(formData.plannedCompletionPercentage),
        actualCompletionPercentage: Number(formData.actualCompletionPercentage),
        technicalDeviation: Number(formData.technicalDeviation),
        plannedFinancialProgress: Number(formData.plannedFinancialProgress),
        actualFinancialProgress: Number(formData.actualFinancialProgress),
      };

      emit('save', formattedData);
      toast.success(props.isEdit ? 'تم تعديل الاجراء بنجاح! 🎉' : 'تم إضافة الاجراء بنجاح! 🎉');
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast.error('حدث خطأ أثناء حفظ الاجراء');
      throw error;
    } finally {
      isLoading.value = false;
    }
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

  .custom-scrollbar > * {
    direction: rtl;
  }

  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-in {
    animation: animate-in 0.3s ease-out;
  }
</style>
