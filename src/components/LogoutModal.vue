<template>
  <BaseModal
    :open="isOpen"
    @update:open="updateOpen"
    @close="cancel"
    @confirm="confirm"
    content-class="sm:max-w-[32rem] max-h-[90vh] flex flex-col overflow-hidden"
    header-class="pb-0 flex-shrink-0"
    title-class="text-xl font-bold text-foreground-heading"
    footer-class="flex justify-center gap-3 pt-6 mt-6 border-t border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm"
    cancel-text="إلغاء"
    confirm-text="تسجيل الخروج"
    :show-confirm="true"
    confirm-button-class="bg-destructive hover:bg-destructive/90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <template #title>
      <div class="space-y-3 p-6 pb-4 text-center" :class="{ 'opacity-60': isLoading }">
        <!-- Icon Header -->
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/40 to-destructive/20 shadow-lg transition-all duration-300"
              :class="{ 'animate-pulse': isLoading }"
            >
              <Icon v-if="!isLoading" icon="lucide:log-out" class="h-6 w-6 text-destructive" />
              <Icon v-else icon="lucide:loader-2" class="h-6 w-6 animate-spin text-destructive" />
            </div>
            <h3 class="text-2xl font-bold text-foreground-heading">
              {{ isLoading ? 'جاري المعالجة...' : 'تسجيل الخروج' }}
            </h3>
          </div>
          <p class="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
            {{
              isLoading
                ? 'يرجى الانتظار، جاري معالجة طلبك...'
                : 'هل أنت متأكد من تسجيل الخروج من النظام؟'
            }}
          </p>
        </div>

        <!-- Loading Progress Bar -->
        <div v-if="isLoading" class="w-full">
          <div class="h-1 w-full overflow-hidden rounded-full bg-destructive/20">
            <div
              class="animate-pulse-slow h-full bg-gradient-to-r from-destructive to-red-600"
            ></div>
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
        <!-- Warning Message -->
        <div class="rounded-xl border-2 border-dashed border-destructive/30 bg-destructive/5 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/20"
            >
              <Icon icon="lucide:alert-triangle" class="h-5 w-5 text-destructive" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-foreground-body">
                سيتم تسجيل خروجك من النظام وستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center gap-3 px-6">
        <Button
          variant="outline"
          @click="cancel"
          :disabled="isLoading"
          class="h-11 min-w-[7rem] border-2 border-border/60 transition-all duration-300 hover:border-border hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          :disabled="isLoading"
          @click="confirm"
          class="h-11 min-w-[7rem] bg-gradient-to-r from-destructive to-destructive/90 px-6 text-destructive-foreground shadow-lg transition-all duration-300 hover:from-destructive/90 hover:to-destructive hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="isLoading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon v-else icon="lucide:log-out" class="mr-2 h-4 w-4" />
          {{ isLoading ? 'جاري المعالجة...' : 'تسجيل الخروج' }}
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { Button } from '@/components/ui/button';
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
