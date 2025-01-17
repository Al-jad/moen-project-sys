<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="min-w-[400px]">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold text-right">
          حالة المهمة
        </DialogTitle>
      </DialogHeader>

      <div class="py-6">
        <div class="space-y-4">
          <Label class="text-right">اختر الحالة</Label>
          <Select v-model="selectedStatus" dir="rtl">
            <SelectTrigger>
              <SelectValue :placeholder="selectedStatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
              <SelectItem value="قيد الاجراء">قيد الاجراء</SelectItem>
              <SelectItem value="مكتملة">مكتملة</SelectItem>
            </SelectContent>
          </Select>

          <div class="mt-4">
            <Label class="text-right">ملاحظات</Label>
            <Textarea 
              v-model="notes"
              dir="rtl"
              class="mt-2"
              placeholder="تم تحديد الاجتماع مع السادة موظفي القسم بتاريخ ....."
            />
          </div>
        </div>
      </div>

      <DialogFooter class="flex flex-row-reverse w-full gap-2">
        <Button @click="$emit('update:open', false)" variant="outline" class="w-1/4 ">
          <X class="w-4 h-4" />
          الغاء
        </Button>
        <Button @click="save" class="w-2/4">
          <Check class="w-4 h-4" />
          تأكيد
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Check, X } from 'lucide-vue-next'
const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  currentStatus: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:open', 'statusChanged'])

const selectedStatus = ref(props.currentStatus)
const notes = ref('')

const save = () => {
  emit('statusChanged', {
    status: selectedStatus.value,
    notes: notes.value
  })
  emit('update:open', false)
}
</script> 