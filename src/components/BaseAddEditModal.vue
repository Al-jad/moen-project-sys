<template>
  <BaseModal
    :open="open"
    :show-confirm="true"
    :confirm-text="isEditing ? 'حفظ التعديلات' : 'إضافة'"
    :cancel-text="'إلغاء'"
    :confirm-button-class="'bg-primary hover:bg-primary/90'"
    @update:open="updateOpen"
    @close="handleCancel"
    @confirm="handleSave"
  >
    <template #title>
      {{ isEditing ? `تعديل ${entityName}` : `اضافة ${entityName}` }}
    </template>

    <div class="space-y-6 py-4">
      <slot name="form" :form-data="formData" :update-form="updateFormData" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { computed, ref, watch } from 'vue';

  interface Props<T> {
    open: boolean;
    editData: T | null;
    entityName: string;
    defaultFormData: T;
  }

  const props = defineProps<Props<any>>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    save: [data: any];
    cancel: [];
  }>();

  const formData = ref(structuredClone(props.defaultFormData));
  const isEditing = computed(() => !!props.editData);

  // Watch for modal open state
  watch(
    () => props.open,
    (newVal) => {
      if (newVal && props.editData) {
        // Initialize form when modal opens with edit data
        formData.value = structuredClone(props.editData);
      } else if (!newVal) {
        // Reset form when modal closes
        formData.value = structuredClone(props.defaultFormData);
      }
    }
  );

  // Watch for editData changes
  watch(
    () => props.editData,
    (newData) => {
      if (newData && props.open) {
        formData.value = structuredClone(newData);
      }
    },
    { immediate: true }
  );

  const updateOpen = (value: boolean) => {
    emit('update:open', value);
  };

  const updateFormData = (field: string, value: any) => {
    formData.value[field] = value;
  };

  const handleCancel = () => {
    formData.value = structuredClone(props.defaultFormData);
    emit('cancel');
    updateOpen(false);
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData.value,
      id: props.editData?.id,
    };

    emit('save', dataToSave);
    updateOpen(false);
    formData.value = structuredClone(props.defaultFormData);
  };
</script>
