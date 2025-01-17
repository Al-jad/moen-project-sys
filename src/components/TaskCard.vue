<template>
  <div>
    <!-- Project Info -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">اسم المشروع</div>
      <div class="font-medium">{{ task.projectName }}</div>
    </div>

    <!-- Meeting Type -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">نوع المهمة</div>
      <div class="font-medium">{{ task.type }}</div>
    </div>

    <!-- Notes -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">الملاحظات</div>
      <div class="font-medium">{{ task.notes }}</div>
    </div>

    <!-- Date & Time -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">تاريخ الارسال</div>
      <div class="flex items-center gap-2">
        <span>{{ task.date }}</span>
        <span>{{ task.time }}</span>
      </div>
    </div>

    <!-- Sender -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">الطرف المرسل</div>
      <div class="font-medium">{{ task.sender }}</div>
    </div>

    <!-- Status -->
    <div class="grid grid-cols-[auto,1fr] gap-4 mb-4">
      <div class="text-sm text-gray-500">حالة المهمة</div>
      <div class="flex items-center gap-2">
        <Badge :variant="task.status === 'مكتملة' ? 'success' : task.status === 'قيد الانتظار' ? 'warning' : 'default'">
          {{ task.status }}
        </Badge>
      </div>
    </div>

    <!-- Note -->
    <div class="grid grid-cols-[auto,1fr] gap-4">
      <div class="text-sm text-gray-500">الملاحظة</div>
      <div class="text-gray-600">{{ task.description }}</div>
    </div>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge'

defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script> 