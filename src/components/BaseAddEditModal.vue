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

<script setup generic="T" lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { computed, ref, watch } from 'vue';

  interface Props<T = Record<string, any>> {
    open: boolean;
    editData?: T | null;
    entityName: string;
    defaultFormData: T;
  }

  const props = withDefaults(defineProps<Props>(), {
    editData: null,
    open: false,
  });

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'save', data: any): void;
    (e: 'cancel'): void;
  }>();

  const safeClone = <T,>(data: T): T => {
    if (data === null || data === undefined) return {} as T;
    try {
      return structuredClone(data);
    } catch (error) {
      console.warn('Failed to deep clone data, falling back to shallow copy:', error);
      return { ...data } as T;
    }
  };

  const formData = ref<any>(safeClone(props.defaultFormData));
  const isEditing = computed(() => !!props.editData);

  // Watch for modal open state
  watch(
    () => props.open,
    (newVal) => {
      if (newVal && props.editData) {
        // Initialize form when modal opens with edit data
        formData.value = safeClone(props.editData);
      } else if (!newVal) {
        // Reset form when modal closes
        formData.value = safeClone(props.defaultFormData);
      }
    }
  );

  // Watch for editData changes
  watch(
    () => props.editData,
    (newData) => {
      if (newData && props.open) {
        formData.value = safeClone(newData);
      }
    },
    { immediate: true }
  );

  const updateOpen = (value: boolean) => {
    emit('update:open', value);
  };

  const updateFormData = (field: string, value: any) => {
    if (formData.value && typeof formData.value === 'object') {
      formData.value[field] = value;
    }
  };

  const handleCancel = () => {
    formData.value = safeClone(props.defaultFormData);
    emit('cancel');
    updateOpen(false);
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData.value,
      id: props.editData && 'id' in props.editData ? props.editData.id : undefined,
    };

    emit('save', dataToSave);
    updateOpen(false);
    formData.value = safeClone(props.defaultFormData);
  };
</script>
