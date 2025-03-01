<template>
  <div class="mb-4 rounded-lg bg-white p-4 dark:border dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-medium">{{ title }}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <PrimaryButton variant="ghost" size="icon" class="h-8 w-8" @click="$emit('edit')">
            <Icon icon="lucide:edit" class="h-4 w-4" />
          </PrimaryButton>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          class="bg-white dark:border dark:border-gray-700 dark:bg-gray-800"
        >
          <p>تعديل الاجراء</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <div class="grid grid-cols-[auto_1fr] gap-x-12 gap-y-4 text-right">
      <div class="text-gray-500 dark:text-gray-400">اسم الاجراء التنفيذي</div>
      <div class="mr-4">{{ procedure.name }}</div>

      <div class="text-gray-500 dark:text-gray-400">وزن الاجراء التنفيذي</div>
      <div class="mr-4">{{ procedure.weight }}</div>

      <div class="text-gray-500 dark:text-gray-400">مدة الاجراء</div>
      <div class="mr-4">{{ procedure.duration }} يوما</div>

      <div class="text-gray-500 dark:text-gray-400">تاريخ بداية التنفيذ</div>
      <div class="mr-4">{{ procedure.startDate }}</div>

      <div class="text-gray-500 dark:text-gray-400">نسبة الانجاز الفني المخطط له</div>
      <div class="mr-4">{{ procedure.plannedTechnicalProgress }} %</div>

      <div class="text-gray-500 dark:text-gray-400">نسبة الانجاز الفني الفعلي</div>
      <div class="mr-4">{{ procedure.actualTechnicalProgress }} %</div>

      <div class="text-gray-500 dark:text-gray-400">نسبة الانحراف الفني</div>
      <div class="mr-4">{{ procedure.technicalDeviation }} %</div>

      <div class="text-gray-500 dark:text-gray-400">نسبة الانجاز المالي المخطط له</div>
      <div class="mr-4">{{ procedure.plannedFinancialProgress }} %</div>

      <div class="text-gray-500 dark:text-gray-400">نسبة الانجاز المالي الفعلي</div>
      <div class="mr-4">{{ procedure.actualFinancialProgress }} %</div>
    </div>
  </div>
</template>

<script setup>
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
  import { Icon } from '@iconify/vue';

  defineEmits(['edit']);

  defineProps({
    procedure: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  });
</script>
