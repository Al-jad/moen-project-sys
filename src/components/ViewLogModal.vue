<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader class="flex flex-col gap-4 mt-4 mb-2">
        <div class="flex items-center justify-end">
          <DialogTitle class="text-xl font-semibold">
            تفاصيل الحدث
          </DialogTitle>
        </div>
        <div class="h-px bg-gray-200"></div>
      </DialogHeader>

      <div class="py-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900">{{ log?.employee_name }}</span>
            <span class="text-gray-500">اسم الموظف</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900">{{ log?.project_name }}</span>
            <span class="text-gray-500">اسم المشروع</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900">{{ log?.date }} {{ log?.time }}</span>
            <span class="text-gray-500">التاريخ والوقت</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900">{{ log?.field }}</span>
            <span class="text-gray-500">حقل التعديل</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-900">{{ log?.old_value }}</span>
            <span class="text-gray-500">القيمة السابقة</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-gray-900">{{ log?.new_value }}</span>
            <span class="text-gray-500">القيمة الجديدة</span>
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
})

defineEmits(['update:open'])
</script> 