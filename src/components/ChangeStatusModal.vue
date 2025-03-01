<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="min-w-[400px]">
      <DialogHeader>
        <DialogTitle class="text-right text-xl font-semibold"> حالة المهمة </DialogTitle>
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

      <DialogFooter class="flex w-full flex-row-reverse gap-2">
        <Button @click="$emit('update:open', false)" variant="outline" class="w-1/4">
          <Icon icon="lucide:x" class="h-4 w-4" />
          الغاء
        </Button>
        <Button @click="save" class="w-2/4">
          <Icon icon="lucide:check" class="h-4 w-4" />
          تأكيد
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Textarea } from '@/components/ui/textarea';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    currentStatus: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:open', 'statusChanged']);

  const selectedStatus = ref(props.currentStatus);
  const notes = ref('');

  const save = () => {
    emit('statusChanged', {
      status: selectedStatus.value,
      notes: notes.value,
    });
    emit('update:open', false);
  };
</script>
