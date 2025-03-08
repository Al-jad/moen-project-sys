<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader class="mb-2 mt-4 flex flex-col gap-4">
        <div class="flex items-center justify-end">
          <DialogTitle class="text-xl font-semibold">الاجراء التنفيذي</DialogTitle>
        </div>
        <div class="h-px bg-gray-200"></div>
      </DialogHeader>

      <div class="py-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.name || 'تنصيب المحطات' }}</span>
            <span class="text-gray-500">اسم الاجراء</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.projectName || 'مشروع A' }}</span>
            <span class="text-gray-500">اسم المشروع</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.contractNumber || 'عقد رقم 2023/157' }}</span>
            <span class="text-gray-500">رقم العقد</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.weight || '25' }}</span>
            <span class="text-gray-500">وزن الاجراء</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.duration || '30' }} يوم</span>
            <span class="text-gray-500">مدة الاجراء يوم</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.startDate || '20.03.2025' }}</span>
            <span class="text-gray-500">تاريخ بداية تنفيذ</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.plannedTechnicalProgress || '60%' }}</span>
            <span class="text-gray-500">نسبة الانجاز الفني المخطط</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.actualTechnicalProgress || '75%' }}</span>
            <span class="text-gray-500">نسبة الانجاز الفني الفعلي</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.technicalDeviation || '15%' }}</span>
            <span class="text-gray-500">نسبة الانحراف الفني</span>
          </div>
          <div class="flex items-center justify-between border-b border-gray-100 py-3">
            <span class="text-gray-900">{{ action?.plannedFinancialProgress || '50%' }}</span>
            <span class="text-gray-500">نسبة الانجاز المالي المخطط</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-gray-900">{{ action?.actualFinancialProgress || '45%' }}</span>
            <span class="text-gray-500">نسبة الانجاز المالي الفعلي</span>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>

  <AddEditActionModal v-model:open="showEditModal" :action="action" @submit="handleSubmit" />
</template>

<script setup lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import AddEditActionModal from '@/components/AddEditActionModal.vue';

  const props = defineProps<{
    open: boolean;
    action?: {
      name?: string;
      weight?: number;
      duration?: number;
      startDate?: string;
      plannedTechnicalProgress?: string;
      actualTechnicalProgress?: string;
      technicalDeviation?: string;
      plannedFinancialProgress?: string;
      actualFinancialProgress?: string;
      contractNumber?: string;
      projectName?: string;
    };
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    submit: [value: any];
  }>();

  const showEditModal = ref(false);

  const handleEdit = () => {
    showEditModal.value = true;
    emit('update:open', false);
  };

  const handleSubmit = (formData) => {
    emit('submit', formData);
    showEditModal.value = false;
  };
</script>
