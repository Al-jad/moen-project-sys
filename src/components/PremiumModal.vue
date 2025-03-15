<template>
  <Dialog :open="isOpen" @update:open="updateOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader class="pb-2">
        <DialogTitle class="text-center text-xl font-bold text-gray-900 dark:text-white">
          ميزة مدفوعة
        </DialogTitle>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center space-y-5 py-6">
        <div
          class="premium-icon-container rounded-full bg-yellow-100 p-4 shadow-sm dark:bg-yellow-900/30"
        >
          <Icon icon="lucide:crown" class="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <DialogDescription class="text-center text-gray-500 dark:text-gray-400">
          هذه الميزة متوفرة في النسخة الكاملة من النظام
        </DialogDescription>
      </div>
      <DialogFooter class="flex justify-center gap-4 pt-2 sm:justify-center">
        <Button
          type="button"
          variant="outline"
          @click="closeModal"
          class="min-w-[8rem] border-gray-300 px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          اغلاق
        </Button>
        <Button
          type="button"
          @click="showDetails"
          class="min-w-[8rem] bg-yellow-600 px-4 py-2 text-white transition-all duration-200 hover:bg-yellow-700"
        >
          عرض التفاصيل
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
  import { useRouter } from 'vue-router';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:open', 'close']);
  const router = useRouter();

  const isOpen = ref(props.open);

  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
    }
  );

  const updateOpen = (value) => {
    isOpen.value = value;
    emit('update:open', value);
  };

  const closeModal = () => {
    emit('close');
    updateOpen(false);
  };

  const showDetails = () => {
    router.push('/about');
    closeModal();
  };
</script>

<style scoped>
  .premium-icon-container {
    animation: pulse 2s infinite;
    box-shadow: 0 0 0 rgba(255, 215, 0, 0.4);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
  }
</style>
