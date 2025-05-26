<template>
  <BaseModal
    :open="open"
    :show-confirm="true"
    confirm-text="عرض التفاصيل"
    :confirm-button-class="'bg-warning hover:bg-warning/90'"
    @update:open="updateOpen"
    @close="handleClose"
    @confirm="showDetails"
  >
    <template #title>ميزة مدفوعة</template>

    <div class="flex flex-col items-center justify-center py-6 space-y-5">
      <div class="p-4 rounded-full shadow-sm premium-icon-container bg-warning/20">
        <Icon icon="lucide:crown" class="w-8 h-8 text-warning" />
      </div>
      <p class="text-center text-foreground-muted">
        هذه الميزة متوفرة في النسخة الكاملة من النظام
      </p>
    </div>
  </BaseModal>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
  import { Icon } from '@iconify/vue';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['update:open', 'close']);
  const router = useRouter();

  const updateOpen = (value) => {
    emit('update:open', value);
  };

  const handleClose = () => {
    emit('close');
    emit('update:open', false);
  };

  const showDetails = () => {
    router.push('/about');
    handleClose();
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
