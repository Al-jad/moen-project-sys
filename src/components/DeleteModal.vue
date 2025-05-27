<template>
  <BaseModal
    :open="isOpen"
    @update:open="updateOpen"
    :content-class="'sm:max-w-md'"
    :confirm-button-class="'bg-destructive hover:bg-destructive/90'"
    :cancel-text="cancelText || 'إلغاء'"
    :confirm-text="confirmText || 'حذف'"
    @close="cancel"
    @confirm="confirm"
  >
    <template #title>
      <div class="space-y-2">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h3>
      </div>
    </template>

    <div class="flex flex-col items-center justify-center py-6 space-y-5">
      <div class="p-4 bg-red-100 rounded-full shadow-sm delete-icon-container dark:bg-red-900/30">
        <Icon :icon="icon || 'lucide:trash-2'" class="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <p class="max-w-sm text-sm leading-relaxed text-center text-gray-600 dark:text-gray-300">
        {{ message || 'هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد من الاستمرار؟' }}
      </p>
    </div>

    <template #footer v-if="isLoading">
      <div class="flex justify-center gap-4 sm:justify-center">
        <PrimaryButton
          type="button"
          variant="outline"
          @click="cancel"
          class="min-w-[8rem] px-4 py-2"
        >
          {{ cancelText || 'إلغاء' }}
        </PrimaryButton>
        <PrimaryButton
          variant="destructive"
          @click="confirm"
          class="min-w-[8rem] px-4 py-2 opacity-80 transition-all duration-200"
          :disabled="isLoading"
        >
          <Icon icon="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
          {{ confirmText || 'حذف' }}
        </PrimaryButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Icon } from '@iconify/vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'تأكيد الحذف',
    },
    description: {
      type: String,
      default: 'يرجى تأكيد عملية الحذف',
    },
    message: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: 'حذف',
    },
    cancelText: {
      type: String,
      default: 'إلغاء',
    },
    icon: {
      type: String,
      default: 'lucide:trash-2',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:open', 'confirm', 'cancel']);

  const isOpen = ref(props.open);
  const isLoading = ref(props.loading);

  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
    }
  );

  watch(
    () => props.loading,
    (newVal) => {
      isLoading.value = newVal;
    }
  );

  const updateOpen = (value) => {
    isOpen.value = value;
    emit('update:open', value);
  };

  const confirm = () => {
    emit('confirm');
  };

  const cancel = () => {
    emit('cancel');
    updateOpen(false);
  };
</script>

<style scoped>
  .delete-icon-container {
    animation: pulse 2s infinite;
    box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
</style>
