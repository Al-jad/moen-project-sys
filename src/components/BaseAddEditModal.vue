<template>
  <BaseModal
    :open="open"
    @update:open="updateOpen"
    @close="handleCancel"
    @confirm="handleSave"
    content-class="sm:max-w-[32rem] max-h-[90vh] flex flex-col overflow-hidden"
    header-class="pb-0 flex-shrink-0"
    title-class="text-xl font-bold text-foreground-heading"
    footer-class="flex justify-center gap-3 pt-6 mt-6 border-t border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm"
    :cancel-text="'إلغاء'"
    :confirm-text="isEditing ? 'حفظ التغييرات' : 'إضافة'"
    :show-confirm="true"
    confirm-button-class="bg-primary hover:bg-primary/90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <template #title>
      <div class="space-y-3 p-6 pb-4 text-center" :class="{ 'opacity-60': isLoading }">
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 shadow-lg transition-all duration-300"
              :class="{ 'animate-pulse': isLoading }"
            >
              <Icon
                v-if="!isLoading"
                :icon="isEditing ? 'lucide:edit-3' : 'lucide:plus'"
                class="h-6 w-6 text-primary"
              />
              <Icon v-else icon="lucide:loader-2" class="h-6 w-6 animate-spin text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-foreground-heading">
              {{
                isLoading
                  ? isEditing
                    ? 'جاري حفظ التغييرات...'
                    : 'جاري الإضافة...'
                  : isEditing
                    ? `تعديل ${entityName}`
                    : `إضافة ${entityName}`
              }}
            </h3>
          </div>
          <p class="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
            {{
              isLoading
                ? 'يرجى الانتظار، جاري معالجة طلبك...'
                : isEditing
                  ? `قم بتحديث معلومات ${entityName}`
                  : `أضف ${entityName} جديدًا`
            }}
          </p>
        </div>

        <!-- Loading Progress Bar -->
        <div v-if="isLoading" class="w-full">
          <div class="h-1 w-full overflow-hidden rounded-full bg-primary/20">
            <div class="animate-pulse-slow h-full bg-gradient-to-r from-primary to-accent"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Scrollable Content -->
    <div
      class="flex-1 overflow-y-auto px-6 pb-2"
      :class="{ 'pointer-events-none opacity-60': isLoading }"
    >
      <div class="space-y-6">
        <slot
          name="form"
          :form-data="formData"
          :update-form="updateFormData"
          :is-loading="isLoading"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center gap-3 px-6">
        <Button
          variant="outline"
          @click="handleCancel"
          :disabled="isLoading"
          class="h-11 min-w-[7rem] border-2 border-border/60 transition-all duration-300 hover:border-border hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          :disabled="isLoading || !isValid"
          @click="handleSave"
          class="h-11 min-w-[7rem] bg-gradient-to-r from-primary to-primary/90 px-6 text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-primary hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="isLoading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else :icon="isEditing ? 'lucide:save' : 'lucide:plus'" class="mr-2 h-4 w-4" />
          {{
            isLoading
              ? isEditing
                ? 'جاري الحفظ...'
                : 'جاري الإضافة...'
              : isEditing
                ? 'حفظ التغييرات'
                : 'إضافة'
          }}
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup generic="T" lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { Button } from '@/components/ui/button';
  import { Icon } from '@iconify/vue';
  import { computed, ref, watch } from 'vue';

  interface Props<T = Record<string, any>> {
    open: boolean;
    editData?: T | null;
    entityName: string;
    defaultFormData: T;
    loading?: boolean;
    validate?: (data: T) => boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    editData: null,
    open: false,
    loading: false,
    validate: () => true,
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
  const isLoading = ref(props.loading);
  const isEditing = computed(() => !!props.editData);

  const isValid = computed(() => {
    return props.validate(formData.value);
  });

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

  // Watch for loading prop
  watch(
    () => props.loading,
    (newVal) => {
      isLoading.value = newVal;
    }
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
    if (isLoading.value) return;

    formData.value = safeClone(props.defaultFormData);
    emit('cancel');
    updateOpen(false);
  };

  const handleSave = async () => {
    if (!isValid.value || isLoading.value) return;

    const dataToSave = {
      ...formData.value,
      id: props.editData && 'id' in props.editData ? props.editData.id : undefined,
    };

    try {
      await emit('save', dataToSave);
      updateOpen(false);
      formData.value = safeClone(props.defaultFormData);
    } catch (error) {
      console.error('Error saving data:', error);
      // Keep modal open on error
    }
  };
</script>

<style scoped>
  @keyframes animate-pulse-slow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse-slow {
    animation: animate-pulse-slow 2s infinite;
  }
</style>
