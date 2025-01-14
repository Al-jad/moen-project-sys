<template>
  <div class="p-6 bg-white shadow-sm rounded-xl">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-medium text-right text-gray-900 line-clamp-2">{{ title }}</h3>
      </div>
      <div class="flex flex-col gap-1 text-right">
        <p class="text-sm text-gray-500"> الجهة المستفيدة </p>
        <p class="text-sm text-gray-900">{{ department }}</p>
      </div>

      <div class="flex flex-col items-end gap-2 mb-2">
        <p class="text-sm text-gray-500"> حالة المشروع </p>
        <Badge :variant="statusVariant" class="px-3 py-1">{{ status }}</Badge>
      </div>

      <div class="flex flex-row-reverse items-center justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500">تاريخ المباشرة</span>
          <span class="text-sm font-medium">{{ startDate }}</span>
        </div>
        <div>
          <span class="flex items-center 900"> - </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-gray-500">تاريخ الانجاز</span>
          <span class="text-sm font-medium">{{ endDate }}</span>
        </div>
      </div>
      <hr class="border-gray-200" />
      <div class="flex items-end justify-end">
        <div class="flex gap-4">
          <Button variant="primary" size="xl" class="font-medium text-gray-600 hover:text-gray-900"
            >عرض</Button
          >
          <Button variant="ghost" size="xl" class="font-bold text-gray-900 hover:text-gray-600"
            >تعديل</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';

  defineProps({
    title: String,
    department: String,
    startDate: String,
    endDate: String,
    status: String,
    statusVariant: {
      type: String,
      default: 'default',
    },
  });
</script>
