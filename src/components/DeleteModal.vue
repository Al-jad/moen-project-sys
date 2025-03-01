<template>
  <Dialog :open="isOpen" @update:open="updateOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader class="pb-2">
        <DialogTitle class="text-center text-xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </DialogTitle>
        <DialogDescription class="text-center text-gray-500 dark:text-gray-400">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center space-y-5 py-6">
        <div class="delete-icon-container rounded-full bg-red-100 p-4 shadow-sm dark:bg-red-900/30">
          <Icon :icon="icon || 'lucide:trash-2'" class="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <p class="max-w-sm text-center text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {{ message || 'هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد من الاستمرار؟' }}
        </p>
      </div>
      <DialogFooter class="flex justify-center gap-4 pt-2 sm:justify-center">
        <Button
          type="button"
          variant="outline"
          @click="cancel"
          class="min-w-[8rem] border-gray-300 px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          {{ cancelText || 'إلغاء' }}
        </Button>
        <Button
          type="button"
          variant="destructive"
          @click="confirm"
          class="min-w-[8rem] px-4 py-2 transition-all duration-200"
          :class="{ 'opacity-90 hover:opacity-100': !isLoading, 'opacity-80': isLoading }"
          :disabled="isLoading"
        >
          <Icon v-if="isLoading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          {{ confirmText || 'حذف' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
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
