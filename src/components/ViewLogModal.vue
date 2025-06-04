<template>
  <BaseModal
    :open="open"
    @update:open="$emit('update:open', $event)"
    content-class="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
    header-class="pb-0 flex-shrink-0"
    title-class="text-xl font-bold text-foreground-heading"
    footer-class="flex justify-center gap-3 pt-6 mt-6 border-t border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm"
    :show-confirm="false"
  >
    <template #title>
      <div class="space-y-3 p-6 pb-4 text-center">
        <div class="flex items-center justify-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 shadow-lg transition-all duration-300"
          >
            <Icon icon="lucide:eye" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-2xl font-bold text-foreground-heading">تفاصيل الحدث</h3>
        </div>
        <p class="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
          استعراض التفاصيل الكاملة للعملية المسجلة في النظام
        </p>
      </div>
    </template>
    <div class="flex-1 space-y-6 overflow-y-auto px-6 pb-2">
      <div
        class="rounded-xl border-2 border-border bg-background-surface p-6 backdrop-blur-sm transition-all duration-300"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="entypo:info-with-circle" class="h-5 w-5 text-primary" />
            <h3 class="text-lg font-semibold text-foreground-heading">المعلومات الأساسية</h3>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="secondary" class="bg-info/50 text-white">
              {{ formattedCreatedAt }}
            </Badge>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(value, key) in tableNames"
            :key="key"
            class="rounded-lg border border-border bg-primary/10 p-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-muted-foreground">{{ key }}</span>
              <span class="text-sm font-semibold text-foreground">
                {{ translateActionName(value) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="rounded-xl border-2 border-border/60 bg-background-surface p-6 backdrop-blur-sm transition-all duration-300"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon
              icon="tabler:list-details"
              class="m-1 h-6 w-6 rounded-full bg-primary p-1 text-background-surface"
            />
            <h3 class="text-lg font-semibold text-foreground-heading">تفاصيل التغييرات</h3>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="secondary" class="bg-info/50 text-white">
              عدد التغييرات: {{ filteredDetails.length || 0 }}
            </Badge>
            <Badge v-if="log.tableRowId" variant="secondary" class="bg-success/10 text-success">
              معرف السجل: {{ log.tableRowId }}
            </Badge>
          </div>
        </div>
        <div
          v-if="filteredDetails.length"
          class="overflow-hidden rounded-xl border border-border/60"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground"
                    >اسم الحقل</th
                  >
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground"
                    >القيمة السابقة</th
                  >
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground"
                    >القيمة الجديدة</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-border/30">
                <tr
                  v-for="(detail, index) in filteredDetails"
                  :key="index"
                  class="transition-colors hover:bg-primary/5"
                >
                  <td class="p-3 text-sm font-medium text-foreground">
                    {{ translateField(detail.fieldName) }}
                  </td>
                  <td class="p-3 text-sm text-muted-foreground">
                    <span
                      class="inline-block rounded-md bg-destructive/10 px-2 py-1 text-destructive"
                    >
                      {{ formatValue(detail.oldValue) }}
                    </span>
                  </td>
                  <td class="p-3 text-sm text-foreground">
                    <span class="inline-block rounded-md bg-success/10 px-2 py-1 text-success">
                      {{ formatValue(detail.newValue) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 py-8 text-center"
        >
          <div class="space-y-3">
            <Icon icon="lucide:file-x" class="mx-auto h-10 w-10 text-muted-foreground" />
            <p class="text-sm text-muted-foreground">لا توجد تفاصيل متاحة للتغييرات</p>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import BaseModal from '@/components/BaseModal.vue';
  import { Badge } from '@/components/ui/badge';
  import {
    formatDate,
    getTableName,
    translateAction,
    translateFieldName,
  } from '@/services/logService';
  import type { Log } from '@/types/logs';
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  interface ExtendedLog extends Log {
    user?: {
      id?: number;
      name: string;
      email?: string;
    };
  }
  const props = defineProps<{
    open: boolean;
    log: ExtendedLog;
  }>();
  defineEmits<{
    (e: 'update:open', value: boolean): void;
  }>();
  const EXCLUDED_FIELDS = ['id', 'createdAt', 'tableRowId', 'IsDeleted', 'updatedAt', 'deletedAt'];
  const TABLE_NAME_MAPPING = {
    'اسم الجدول': 'tableName',
    'نوع العملية': 'action',
    'معرف السجل': 'tableRowId',
    'تم التعديل بواسطة': 'user.name',
  } as const;
  type TableNameKey = keyof typeof TABLE_NAME_MAPPING;
  const tableNames = computed(() => {
    const names: Record<TableNameKey, string> = {
      'تم التعديل بواسطة': props.log.user?.name || 'غير محدد',
      'اسم الجدول': getTableName(props.log.tableName) || 'غير محدد',
      'نوع العملية': props.log.action || 'غير محدد',
      'معرف السجل': props.log.tableRowId || 'غير محدد',
    };
    return names;
  });
  const filteredDetails = computed(
    () =>
      props.log.details?.filter(
        (detail) =>
          !EXCLUDED_FIELDS.some((field) => detail.fieldName.toLowerCase() === field.toLowerCase())
      ) || []
  );
  const translateField = (fieldName: string): string => {
    return translateFieldName(fieldName);
  };
  const translateActionName = (action: string): string => {
    return translateAction(action);
  };
  const formattedCreatedAt = computed(() => formatDate(props.log.createdAt));
  const formatValue = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return 'لا يوجد';
    return value.toString().trim() || 'لا يوجد';
  };
</script>
<style scoped>
  @keyframes subtle-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
  .hover\:shadow-lg:hover {
    animation: subtle-pulse 0.3s ease-in-out;
  }
</style>
