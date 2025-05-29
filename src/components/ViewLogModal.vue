<template>
  <BaseModal
    :open="open"
    @update:open="$emit('update:open', $event)"
    content-class="sm:max-w-4xl"
    :show-confirm="false"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <Icon icon="lucide:eye" class="h-5 w-5" />
        <span>تفاصيل الحدث</span>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Basic Information -->
      <div class="rounded-lg border border-border bg-card p-4">
        <h3 class="mb-4 font-semibold text-foreground-heading">المعلومات الأساسية</h3>
        <div class="space-y-3">
          <div
            v-for="(attribute, key) in tableNames"
            :key="key"
            class="flex items-center justify-between border-b border-border py-2 last:border-0"
          >
            <span class="text-sm font-medium text-muted-foreground">{{ key }}</span>
            <span class="text-sm font-medium text-foreground">{{ log[attribute] || 'غير متوفر' }}</span>
          </div>
        </div>
      </div>

      <!-- Changes Details -->
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-semibold text-foreground-heading">تفاصيل التغييرات</h3>
          <Badge variant="secondary">
            عدد التغييرات: {{ log?.details?.length || 0 }}
          </Badge>
        </div>

        <div v-if="log?.details?.length" class="rounded-md border border-border">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-muted">
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground">اسم الحقل</th>
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground">القيمة السابقة</th>
                  <th class="p-3 text-right text-sm font-medium text-muted-foreground">القيمة الجديدة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="(detail, index) in log.details"
                  :key="index"
                  class="bg-card transition-colors hover:bg-muted/50"
                >
                  <td class="p-3 text-sm font-medium text-foreground">
                    {{ translateFieldName(detail.fieldName) }}
                  </td>
                  <td class="p-3 text-sm text-muted-foreground">
                    {{ detail.oldValue || 'لا يوجد' }}
                  </td>
                  <td class="p-3 text-sm text-foreground">
                    {{ detail.newValue || 'لا يوجد' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center rounded-md border border-border bg-muted/50 py-8 text-sm text-muted-foreground"
        >
          لا توجد تفاصيل متاحة
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import BaseModal from '@/components/BaseModal.vue';
import { Badge } from '@/components/ui/badge';
import { translateFieldName as translateFieldNameService } from '@/services/logService';

interface LogDetail {
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
}

interface Log {
  id: number;
  tableName: string;
  tableRowId: string;
  action: string;
  createdAt: string;
  details?: LogDetail[];
}

const props = defineProps<{
  open: boolean;
  log: Log;
}>();

defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const tableNames = {
  'رقم العملية': 'id',
  'اسم الجدول': 'tableName',
  'معرف الصف': 'tableRowId',
  'نوع العملية': 'action',
  'تاريخ العملية': 'createdAt',
} as const;

const translateFieldName = (fieldName: string): string => {
  return translateFieldNameService(fieldName);
};
</script>
