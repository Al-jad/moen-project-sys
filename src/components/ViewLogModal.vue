<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="flex flex-col px-8 min-w-[800px] max-w-[800px] overflow-y-auto max-h-[80vh] bg-gray-200 dark:bg-gray-800">
      <DialogHeader class="flex col gap-4 mt-4 mb-2">
        <div class="flex items-center justify-start">
          <DialogTitle class="text-xl font-semibold">
            تفاصيل الحدث
          </DialogTitle>
        </div>
        <div class="h-px bg-gray-100"></div>
      </DialogHeader>

      <div class="py-4">
        <div class="space-y-3">
              <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700" v-for="(attribute, key) in tableNames" :key="key">
                <span class="text-gray-500 dark:text-gray-300 font-semibold">{{ key }}</span>
                <span class="text-gray-900 dark:text-gray-300">{{ log[attribute] || 'غير متوفر' }}</span>
              </div>

          <!-- Details Section -->
          <div class="py-3 border-b border-gray-100">
            <div class="flex justify-between mb-2">
              <span class="text-gray-900 dark:text-gray-300 font-semibold">تفاصيل التغييرات</span>
              <span class="text-gray-500 dark:text-gray-300">عدد التغييرات: {{ log?.details?.length || 0 }}</span>
            </div>
            
            <!-- Details Table -->
            <div v-if="log?.details && log.details.length > 0" class="mt-3 border rounded-md overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-300 dark:bg-gray-700">
                    <tr>
                      <th scope="col" class="text-gray-800 dark:text-gray-300 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        اسم الحقل
                      </th>
                      <th scope="col" class="text-gray-800 dark:text-gray-300 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        القيمة السابقة
                      </th>
                      <th scope="col" class="text-gray-800 dark:text-gray-300 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        القيمة الجديدة
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(detail, index) in log.details" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {{ translateFieldName(detail.fieldName) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {{ detail.oldValue || 'لا يوجد' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {{ detail.newValue || 'لا يوجد' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

const translateFieldName = (fieldName) => {
    const fieldTranslations = {
      'createdAt': 'تاريخ الإنشاء',
      'isDeleted': 'محذوف',
      'Name': 'الاسم',
      'ComponentId': 'رقم المكون',
      'Notes': 'ملاحظات',
      'TargetPercentage': 'النسبة المستهدفة',
      'ProjectId': 'رقم المشروع',
      'ProjectPhaseId': 'رقم المرحلة',
      'ProjectActivityId': 'رقم النشاط',
      'AttachmentId': 'رقم المرفق',
      'AppUserId': 'رقم المستخدم',
      'ProjectPhaseName': 'اسم المرحلة',
      'ProjectActivityName': 'اسم النشاط',
      'IsDeleted': 'محذوف',
      'IsActive': 'مفعل',
      'CreatedAt': 'تاريخ الإنشاء',
      'Id': 'معرف الصف',
      'UpdatedAt': 'تاريخ التعديل',
      'AttachmentName': 'اسم المرفق',
      'AppUserName': 'اسم المستخدم',
      'ProjectName': 'اسم المشروع',
      'isGovernment': 'مشروع حكومي',
      'Lng': 'خط الطول',
      'Lat': 'خط العرض',
      'FinancialAchievement': 'الانجاز المالي',
      'isFunded': 'ممول',
      'PeriodType': 'نوع الفترة',
      'Duration': 'المدة',
      'projectObjectives': 'أهداف المشروع',
      'ActualStartDate': 'تاريخ بدء المشروع الفعلي',
      'ActualEndDate': 'تاريخ انتهاء المشروع الفعلي',
      'ProjectStatus': 'حالة المشروع',
      'ProjectType': 'نوع المشروع',
      'ProjectCategory': 'تصنيف المشروع',
      'ProjectSubCategory': 'تصنيف المشروع الفرعي',
    };
    return fieldTranslations[fieldName] || fieldName;
  };

const tableNames = {
 'رقم العملية': 'id',
 'اسم الجدول': 'tableName',
 'معرف الصف': 'tableRowId',
 'نوع العملية': 'action',
 'تاريخ العملية': 'createdAt',
}

defineEmits(['update:open'])
</script> 