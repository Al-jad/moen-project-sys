<template>
  <BaseAddEditModal
    :open="open"
    :edit-data="editData"
    entity-name="الجهة المستفيدة"
    :default-form-data="defaultFormData"
    @update:open="$emit('update:open', $event)"
    @save="$emit('save', $event)"
  >
    <template #form="{ formData, updateForm }">
      <div class="space-y-2">
        <Label class="text-right">اسم الجهة</Label>
        <CustomInput
          :model-value="formData.name"
          @update:model-value="updateForm('name', $event)"
          dir="rtl"
          placeholder="مديرية بلدية بابل"
          class="border-border bg-background-surface"
        />
      </div>
      <div class="space-y-2">
        <Label class="text-right">المرجعية</Label>
        <CustomInput
          :model-value="formData.referenceEntity"
          @update:model-value="updateForm('referenceEntity', $event)"
          dir="rtl"
          placeholder="دائرة حماية وتحسين البيئة في منطقة الوسط"
          class="border-border bg-background-surface"
        />
      </div>
      <div class="space-y-2">
        <Label class="text-right">العنوان</Label>
        <CustomInput
          :model-value="formData.location"
          @update:model-value="updateForm('location', $event)"
          dir="rtl"
          placeholder="الحلة شارع 0000"
          class="border-border bg-background-surface"
        />
      </div>
    </template>
  </BaseAddEditModal>
</template>
<script setup lang="ts">
  import BaseAddEditModal from '@/components/BaseAddEditModal.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import { Label } from '@/components/ui/label';
  import type { Beneficiary } from '@/types';
  defineProps<{
    open: boolean;
    editData: Beneficiary | null;
  }>();
  defineEmits<{
    'update:open': [value: boolean];
    save: [data: Partial<Beneficiary>];
  }>();
  const defaultFormData = {
    name: '',
    referenceEntity: '',
    location: '',
  };
</script>
