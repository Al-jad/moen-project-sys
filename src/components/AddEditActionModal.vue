<template>
  <BaseAddEditModal
    :open="open"
    :edit-data="action"
    entity-name="الإجراء التنفيذي"
    :default-form-data="defaultFormData"
    @update:open="$emit('update:open', $event)"
    @save="handleSave"
  >
    <template #form="{ formData, updateForm }">
      <div class="grid grid-cols-2 gap-6" dir="rtl">
        <div class="space-y-4">
          <div class="grid w-full gap-2">
            <Label class="text-right">اسم الاجراء</Label>
            <CustomInput
              :model-value="formData.name"
              @update:model-value="updateForm('name', $event)"
              type="text"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">اسم المشروع</Label>
            <div v-if="action">
              <CustomInput :model-value="formData.projectName" type="text" dir="rtl" disabled />
            </div>
            <div v-else>
              <CustomSelect
                :model-value="formData.projectName"
                @update:model-value="updateForm('projectName', $event)"
                :options="[
                  { value: 'مشروع A', label: 'مشروع A' },
                  { value: 'مشروع B', label: 'مشروع B' },
                  { value: 'مشروع C', label: 'مشروع C' },
                ]"
                placeholder="اختر المشروع"
              />
            </div>
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">رقم العقد</Label>
            <div v-if="action">
              <CustomInput :model-value="formData.contractNumber" type="text" dir="rtl" disabled />
            </div>
            <div v-else>
              <CustomSelect
                :model-value="formData.contractNumber"
                @update:model-value="updateForm('contractNumber', $event)"
                :options="[
                  { value: 'عقد رقم 2023/157', label: 'عقد رقم 2023/157' },
                  { value: 'عقد رقم 2023/158', label: 'عقد رقم 2023/158' },
                  { value: 'عقد رقم 2023/159', label: 'عقد رقم 2023/159' },
                ]"
                placeholder="اختر العقد"
              />
            </div>
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">وزن الاجراء</Label>
            <CustomInput
              :model-value="formData.weight"
              @update:model-value="updateForm('weight', $event)"
              type="number"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">مدة الاجراء يوم</Label>
            <CustomInput
              :model-value="formData.duration"
              @update:model-value="updateForm('duration', $event)"
              type="number"
              dir="rtl"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid w-full gap-2">
            <Label class="text-right">تاريخ بداية تنفيذ</Label>
            <DateInput
              :model-value="formData.startDate"
              @update:model-value="updateForm('startDate', $event)"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">نسبة الانجاز الفني المخطط</Label>
            <CustomInput
              :model-value="formData.plannedTechnicalProgress"
              @update:model-value="updateForm('plannedTechnicalProgress', $event)"
              type="text"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">نسبة الانجاز الفني الفعلي</Label>
            <CustomInput
              :model-value="formData.actualTechnicalProgress"
              @update:model-value="updateForm('actualTechnicalProgress', $event)"
              type="text"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">نسبة الانحراف الفني</Label>
            <CustomInput
              :model-value="formData.technicalDeviation"
              @update:model-value="updateForm('technicalDeviation', $event)"
              type="text"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">نسبة الانجاز المالي المخطط</Label>
            <CustomInput
              :model-value="formData.plannedFinancialProgress"
              @update:model-value="updateForm('plannedFinancialProgress', $event)"
              type="text"
              dir="rtl"
            />
          </div>

          <div class="grid w-full gap-2">
            <Label class="text-right">نسبة الانجاز المالي الفعلي</Label>
            <CustomInput
              :model-value="formData.actualFinancialProgress"
              @update:model-value="updateForm('actualFinancialProgress', $event)"
              type="text"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseAddEditModal>
</template>

<script setup lang="ts">
  import BaseAddEditModal from '@/components/BaseAddEditModal.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DateInput from '@/components/DateInput.vue';
  import { Label } from '@/components/ui/label';

  const props = defineProps<{
    open: boolean;
    action?: {
      id?: string;
      name?: string;
      weight?: number;
      duration?: number;
      startDate?: string;
      plannedTechnicalProgress?: string;
      actualTechnicalProgress?: string;
      technicalDeviation?: string;
      plannedFinancialProgress?: string;
      actualFinancialProgress?: string;
      projectName?: string;
      contractNumber?: string;
    };
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    submit: [value: any];
  }>();

  const defaultFormData = {
    name: '',
    weight: '',
    duration: '',
    startDate: '',
    plannedTechnicalProgress: '',
    actualTechnicalProgress: '',
    technicalDeviation: '',
    plannedFinancialProgress: '',
    actualFinancialProgress: '',
    projectName: '',
    contractNumber: '',
  };

  const handleSave = (formData: any) => {
    emit('submit', {
      ...formData,
      weight: formData.weight ? Number(formData.weight) : undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
    });
  };
</script>
