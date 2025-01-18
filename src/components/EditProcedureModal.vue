<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-right">{{ isEdit ? 'تعديل الاجراء التنفيذي' : 'اضافة اجراء تنفيذي' }}</DialogTitle>
      </DialogHeader>

      <!-- Non-editable fields -->
      <div class="grid gap-4 py-4 border-b">
        <div class="grid items-center gap-4">
          <Label class="text-right text-gray-500">العقد</Label>
          <div class="text-right text-gray-900">عقد تجهيز محطات المراقبة 25 لسنة 2025</div>
        </div>
        <div class="grid items-center gap-4">
          <Label class="text-right text-gray-500">المشروع</Label>
          <div class="text-right text-gray-900">مشروع A</div>
        </div>
      </div>

      <!-- Editable fields -->
      <div class="grid gap-4 py-4">
        <div class="grid items-center gap-4">
          <Label class="text-right">اسم الاجراء</Label>
          <Input v-model="form.name" dir="rtl" />
        </div>
        <div class="grid items-center gap-4">
          <Label class="text-right">مدة الاجراء</Label>
          <div class="flex items-center gap-2">
            <Input v-model="form.duration" type="number" dir="rtl" />
            <span>يوم</span>
          </div>
        </div>
        <div class="grid items-center gap-4">
          <Label class="text-right">تاريخ البداية</Label>
          <Input v-model="form.startDate" type="date" dir="rtl" />
        </div>
        <div class="grid items-center gap-4">
          <Label class="text-right">نسبة الانجاز الفعلي</Label>
          <div class="flex items-center gap-2">
            <Input v-model="form.actualProgress" type="number" dir="rtl" />
            <span>%</span>
          </div>
        </div>
      </div>

      <DialogFooter class="flex justify-between">
        <Button variant="outline" @click="$emit('update:isOpen', false)">الغاء</Button>
        <Button type="submit" @click="handleSubmit">
          <Check class="w-4 h-4" />
          إرسال إلى المراجعة
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  procedure: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  contractInfo: {
    type: Object,
    default: () => ({
      name: 'عقد تجهيز محطات المراقبة 25 لسنة 2025',
      project: 'مشروع A'
    })
  }
})

const emit = defineEmits(['update:isOpen', 'save'])

const form = ref({
  name: '',
  duration: '',
  startDate: '',
  actualProgress: ''
})

watch(() => props.procedure, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name,
      duration: newVal.duration,
      startDate: newVal.startDate,
      actualProgress: newVal.actualTechnicalProgress
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', form.value)
  emit('update:isOpen', false)
}
</script> 