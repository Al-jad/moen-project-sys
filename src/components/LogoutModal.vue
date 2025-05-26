<template>
  <Dialog :open="isOpen" @update:open="updateOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader class="pb-2">
        <DialogTitle class="text-center text-xl font-bold text-gray-900 dark:text-white">
          تسجيل الخروج
        </DialogTitle>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center space-y-5 py-6">
        <div
          class="logout-icon-container rounded-full bg-blue-100 p-4 shadow-sm dark:bg-blue-900/30"
        >
          <Icon icon="lucide:log-out" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="max-w-sm text-center text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          هل أنت متأكد من تسجيل الخروج من النظام؟
        </p>
      </div>
      <DialogFooter class="flex justify-center gap-4 pt-2 sm:justify-center">
        <Button
          type="button"
          variant="outline"
          @click="cancel"
          class="min-w-[8rem] border-gray-300 px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          إلغاء
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
          تسجيل الخروج
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
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

  const updateOpen = (value: any) => {
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
  .logout-icon-container {
    animation: pulse 2s infinite;
    box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }
</style>
