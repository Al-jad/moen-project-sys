<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader class="flex flex-col gap-4 mt-4 mb-2">
        <div class="flex items-center justify-end">
          <DialogTitle class="text-xl font-semibold">
            تفاصيل الحدث
          </DialogTitle>
        </div>
        <div class="h-px bg-gray-100"></div>
      </DialogHeader>

      <div class="py-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900 dark:text-gray-300">{{ log?.id || 'غير متوفر' }}</span>
            <span class="text-gray-500 dark:text-gray-300">رقم العملية</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900 dark:text-gray-300">
              {{ translatedTableName }}
            </span>
            <span class="text-gray-500 dark:text-gray-300">اسم الجدول</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900 dark:text-gray-300">{{ log?.tableRowId || 'غير متوفر' }}</span>
            <span class="text-gray-500 dark:text-gray-300">معرف الصف</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900 dark:text-gray-300">{{ log?.action }}</span>
            <span class="text-gray-500 dark:text-gray-300">نوع العملية</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900 dark:text-gray-300">{{ log?.createdAt }}</span>
            <span class="text-gray-500 dark:text-gray-300">تاريخ العملية</span>
          </div>
          
          <!-- Details Section -->
          <div class="py-3 border-b border-gray-100">
            <div class="flex justify-between mb-2">
              <span class="text-gray-900 dark:text-gray-300 font-semibold">تفاصيل التغييرات</span>
              <span class="text-gray-500 dark:text-gray-300">عدد التغييرات: {{ log?.details?.length || 0 }}</span>
            </div>
            
            <!-- Details Table -->
            <div v-if="log?.details && log.details.length > 0" class="mt-3 border rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم الحقل
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القيمة السابقة
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القيمة الجديدة
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(detail, index) in log.details" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {{ detail.fieldName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {{ detail.oldValue || 'لا يوجد' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {{ detail.newValue || 'لا يوجد' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-300">
              لا توجد تفاصيل متاحة
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps({
  open: { type: Boolean, required: true },
  log: {
    type: Object,
    required: false,
    default: () => ({})
  }
});

// Ensure reactivity
const translatedTableName = computed(() => {
  return props.log?.tableName ? translations[props.log.tableName] || props.log.tableName : 'غير متوفر';
});

const translations = {
  'AppUser': 'المستخدمين',
  'Project': 'المشاريع',
  'ProjectPhase': 'المراحل',
  'ProjectActivity': 'الأنشطة'
}

defineEmits(['update:open'])
</script> 