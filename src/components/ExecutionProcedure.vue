<template>
  <div class="p-4 mb-4 bg-white rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium">{{ title }}</h3>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" class="w-8 h-8" @click="$emit('edit')">
            <Edit2 class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" class="bg-white">
          <p>تعديل الاجراء</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <div class="grid grid-cols-[auto_1fr] gap-y-4 gap-x-12 text-right">
      <div class="text-gray-500">اسم الاجراء التنفيذي</div>
      <div class="mr-4 text-gray-900">{{ procedure.name }}</div>

      <div class="text-gray-500">وزن الاجراء التنفيذي</div>
      <div class="mr-4 text-gray-900">{{ procedure.weight }}</div>

      <div class="text-gray-500">مدة الاجراء</div>
      <div class="mr-4 text-gray-900">{{ procedure.duration }} يوما</div>

      <div class="text-gray-500">تاريخ بداية التنفيذ</div>
      <div class="mr-4 text-gray-900">{{ procedure.startDate }}</div>

      <div class="text-gray-500">نسبة الانجاز الفني المخطط له</div>
      <div class="mr-4 text-gray-900">{{ procedure.plannedTechnicalProgress }} %</div>

      <div class="text-gray-500">نسبة الانجاز الفني الفعلي</div>
      <div class="mr-4 text-gray-900">{{ procedure.actualTechnicalProgress }} %</div>

      <div class="text-gray-500">نسبة الانحراف الفني</div>
      <div class="mr-4 text-gray-900">{{ procedure.technicalDeviation }} %</div>

      <div class="text-gray-500">نسبة الانجاز المالي المخطط له</div>
      <div class="mr-4 text-gray-900">{{ procedure.plannedFinancialProgress }} %</div>

      <div class="text-gray-500">نسبة الانجاز المالي الفعلي</div>
      <div class="mr-4 text-gray-900">{{ procedure.actualFinancialProgress }} %</div>
    </div>
  </div>
</template>

<script setup>
import { Edit2 } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

defineEmits(['edit'])

defineProps({
  procedure: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script> 