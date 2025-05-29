<template>
  <BaseModal
    v-model:open="isOpen"
    :content-class="'sm:max-w-[45rem]'"
    :show-confirm="false"
    @close="closeModal"
  >
    <template #title>
      <div class="text-right">
        <h2 class="text-xl font-bold text-foreground-heading">تفاصيل المستخدم</h2>
        <p class="mt-1 text-sm text-foreground-muted">معلومات المستخدم الكاملة والتفصيلية</p>
      </div>
    </template>

    <div class="py-6">
      <!-- User Header -->
      <div
        class="mb-6 flex items-center justify-between rounded-lg border border-border bg-background-surface/50 p-4"
      >
        <div>
          <h3 class="text-lg font-semibold text-foreground-heading">{{ userData?.name }}</h3>
          <p class="mt-1 text-sm text-foreground-muted">{{ userData?.email }}</p>
        </div>
        <Badge :class="getRoleBadgeClass(userData?.role)">
          {{ formatRole(userData?.role) }}
        </Badge>
      </div>

      <!-- User Details -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-4 bg-background-surface/50">
          <div class="rounded-lg border border-border p-4">
            <h4 class="mb-3 text-sm font-medium text-foreground-muted">معلومات المستخدم</h4>
            <div class="space-y-3">
              <div>
                <span class="text-xs text-foreground-muted">اسم المستخدم</span>
                <p class="mt-1 text-sm font-medium text-foreground-body">{{
                  userData?.userName
                }}</p>
              </div>
              <div>
                <span class="text-xs text-foreground-muted">تاريخ الإنشاء</span>
                <p class="mt-1 text-sm font-medium text-foreground-body">
                  {{ formatField({ key: 'createdAt' }, userData?.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 bg-background-surface/50">
          <div class="rounded-lg border border-border p-4">
            <h4 class="mb-3 text-sm font-medium text-foreground-muted">معلومات العمل</h4>
            <div class="space-y-3">
              <div>
                <span class="text-xs text-foreground-muted">الدائرة</span>
                <p class="mt-1 text-sm font-medium text-foreground-body">{{
                  userData?.department
                }}</p>
              </div>
              <div>
                <span class="text-xs text-foreground-muted">القسم</span>
                <p class="mt-1 text-sm font-medium text-foreground-body">{{ userData?.section }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { Badge } from '@/components/ui/badge';
  import type { User } from '@/types/users';
  import { ref, watch } from 'vue';

  const props = defineProps<{
    open: boolean;
    userData: User | null;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
  }>();

  const isOpen = ref(props.open);

  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
    }
  );

  watch(isOpen, (newVal) => {
    emit('update:open', newVal);
  });

  const formatRole = (role: any): string => {
    if (!role) return '';
    const roles = {
      ADMIN: 'مدير',
      SUPERVISOR: 'مشرف',
      CLERK: 'مدخل بيانات',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeClass = (role: any): string => {
    if (!role) return '';
    const classes = {
      ADMIN: 'w-fit border-0 bg-success font-medium text-success-foreground shadow-sm',
      SUPERVISOR: 'w-fit border-0 bg-accent font-medium text-accent-foreground shadow-sm',
      CLERK: 'w-fit border-0 bg-secondary font-medium text-secondary-foreground shadow-sm',
    };
    return classes[role as keyof typeof classes] || '';
  };

  const formatField = (field: { key: string }, value: any) => {
    if (!value) return '';

    if (field.key === 'createdAt') {
      return new Date(value).toLocaleDateString('ar', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }

    return value;
  };

  const closeModal = () => {
    isOpen.value = false;
  };
</script>
