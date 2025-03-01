<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="dark:bg-gray-800">
      <DialogHeader>
        <DialogTitle class="text-right">{{
          isEdit ? 'تعديل الاجراء التنفيذي' : 'اضافة اجراء تنفيذي'
        }}</DialogTitle>
      </DialogHeader>

      <!-- Non-editable fields -->
      <div class="grid gap-4 border-b py-4 dark:border-gray-700">
        <div class="grid items-center gap-4">
          <Label class="text-right text-gray-500 dark:text-gray-400">العقد</Label>
          <div class="text-right">{{ contractInfo.name }}</div>
        </div>
        <div class="grid items-center gap-4">
          <Label class="text-right text-gray-500 dark:text-gray-400">المشروع</Label>
          <div class="text-right">{{ contractInfo.project }}</div>
        </div>
      </div>

      <!-- Editable fields -->
      <div class="grid gap-4 py-4">
        <FormField label="اسم الاجراء">
          <CustomInput v-model="form.name" dir="rtl" />
        </FormField>
        <FormField label="مدة الاجراء">
          <div class="flex items-center gap-2">
            <CustomInput v-model="form.duration" type="number" dir="rtl" />
            <span class="dark:text-gray-400">يوم</span>
          </div>
        </FormField>
        <FormField label="تاريخ البداية">
          <CustomInput v-model="form.startDate" type="date" dir="rtl" />
        </FormField>
        <FormField label="نسبة الانجاز الفعلي">
          <div class="flex items-center gap-2">
            <CustomInput v-model="form.actualProgress" type="number" dir="rtl" />
            <span class="dark:text-gray-400">%</span>
          </div>
        </FormField>
      </div>

      <DialogFooter class="flex justify-between">
        <PrimaryButton variant="outline" @click="$emit('update:isOpen', false)">
          الغاء
        </PrimaryButton>
        <PrimaryButton type="submit" @click="handleSubmit">
          <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
          إرسال إلى المراجعة
        </PrimaryButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';
  import { ref, watch } from 'vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    procedure: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    contractInfo: {
      type: Object,
      default: () => ({
        name: 'عقد تجهيز محطات المراقبة 25 لسنة 2025',
        project: 'مشروع A',
      }),
    },
  });

  const emit = defineEmits(['update:isOpen', 'save']);

  const form = ref({
    name: '',
    duration: '',
    startDate: '',
    actualProgress: '',
  });

  watch(
    () => props.procedure,
    (newVal) => {
      if (newVal) {
        form.value = {
          name: newVal.name,
          duration: newVal.duration,
          startDate: newVal.startDate,
          actualProgress: newVal.actualTechnicalProgress,
        };
      }
    },
    { immediate: true }
  );

  const handleSubmit = () => {
    emit('save', form.value);
    emit('update:isOpen', false);
  };
</script>
