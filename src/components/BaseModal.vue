<template>
  <Dialog :open="isOpen" @update:open="updateOpen">
    <DialogContent :class="contentClass">
      <DialogHeader :class="headerClass">
        <DialogTitle :class="titleClass">
          <slot name="title"></slot>
        </DialogTitle>
      </DialogHeader>

      <slot></slot>

      <DialogFooter :class="footerClass">
        <slot name="footer">
          <div class="flex justify-center gap-4 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              @click="closeModal"
              class="min-w-[8rem] border-border px-4 py-2 transition-all duration-200 hover:bg-background-hover"
            >
              {{ cancelText }}
            </Button>
            <Button
              v-if="showConfirm"
              type="button"
              @click="confirmModal"
              class="min-w-[8rem] px-4 py-2 transition-all duration-200"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </Button>
          </div>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { ref, watch } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    contentClass: {
      type: String,
      default: 'sm:max-w-md',
    },
    headerClass: {
      type: String,
      default: 'pb-2',
    },
    titleClass: {
      type: String,
      default: 'text-center text-xl font-bold text-foreground-heading',
    },
    footerClass: {
      type: String,
      default: 'flex justify-center gap-4 pt-2 sm:justify-center',
    },
    confirmButtonClass: {
      type: String,
      default: 'bg-primary hover:bg-primary/90',
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: 'اغلاق',
    },
    confirmText: {
      type: String,
      default: 'تأكيد',
    },
  });

  const emit = defineEmits(['update:open', 'close', 'confirm']);

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

  const confirmModal = () => {
    emit('confirm');
    updateOpen(false);
  };
</script>
