<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader class="flex flex-col gap-4 mb-2">
        <DialogTitle class="text-right">{{ action ? 'تعديل  الإجراء التنفيذي' : 'اضافة إجراء تنفيذي' }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-6" dir="rtl">
          <div class="space-y-4">
            <div class="grid w-full gap-2">
              <Label class="text-right">اسم الاجراء</Label>
              <Input v-model="form.name" type="text" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">اسم المشروع</Label>
              <div v-if="action">
                <Input :value="form.projectName" type="text" dir="rtl" disabled readonly />
              </div>
              <div v-else>
                <Select v-model="form.projectName">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مشروع A">مشروع A</SelectItem>
                    <SelectItem value="مشروع B">مشروع B</SelectItem>
                    <SelectItem value="مشروع C">مشروع C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">رقم العقد</Label>
              <div v-if="action">
                <Input :value="form.contractNumber" type="text" dir="rtl" disabled readonly />
              </div>
              <div v-else>
                <Select v-model="form.contractNumber">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عقد رقم 2023/157">عقد رقم 2023/157</SelectItem>
                    <SelectItem value="عقد رقم 2023/158">عقد رقم 2023/158</SelectItem>
                    <SelectItem value="عقد رقم 2023/159">عقد رقم 2023/159</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">وزن الاجراء</Label>
              <Input v-model="form.weight" type="number" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">مدة الاجراء يوم</Label>
              <Input v-model="form.duration" type="number" dir="rtl" />
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid w-full gap-2">
              <Label class="text-right">تاريخ بداية تنفيذ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    class="w-full justify-start text-right"
                    :class="!date && 'text-muted-foreground'"
                  >
                    <CalendarIcon class="ml-2 h-4 w-4" />
                    {{ date ? formatDate(date) : 'اختر التاريخ' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    v-model="date"
                    initialFocus
                    @update:model-value="handleDateSelect"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز الفني المخطط</Label>
              <Input v-model="form.plannedTechnicalProgress" type="text" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز الفني الفعلي</Label>
              <Input v-model="form.actualTechnicalProgress" type="text" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانحراف الفني</Label>
              <Input v-model="form.technicalDeviation" type="text" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز المالي المخطط</Label>
              <Input v-model="form.plannedFinancialProgress" type="text" dir="rtl" />
            </div>

            <div class="grid w-full gap-2">
              <Label class="text-right">نسبة الانجاز المالي الفعلي</Label>
              <Input v-model="form.actualFinancialProgress" type="text" dir="rtl" />
            </div>
          </div>
        </div>

        <DialogFooter class="gap-2" dir="rtl">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            الغاء
          </Button>
          <Button type="submit">
            {{ action ? 'تعديل' : 'اضافة' }}
            <Check class="w-4 h-4 mr-2" />
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Check, CalendarIcon } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

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
    projectName?: string;
    contractNumber?: string;
  }
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'submit': [value: any];
}>();

const emptyForm = {
  name: '',
  weight: '',
  duration: '',
  startDate: '',
  plannedTechnicalProgress: '',
  actualTechnicalProgress: '',
  technicalDeviation: '',
  plannedFinancialProgress: '',
  actualFinancialProgress: '',
  projectName: '',
  contractNumber: ''
};

const form = ref({ ...emptyForm });
const date = ref<Date | null>(null);

watch(() => props.action, (newAction) => {
  if (newAction) {
    form.value = {
      name: newAction.name || '',
      weight: newAction.weight?.toString() || '',
      duration: newAction.duration?.toString() || '',
      startDate: newAction.startDate || '',
      plannedTechnicalProgress: newAction.plannedTechnicalProgress || '',
      actualTechnicalProgress: newAction.actualTechnicalProgress || '',
      technicalDeviation: newAction.technicalDeviation || '',
      plannedFinancialProgress: newAction.plannedFinancialProgress || '',
      actualFinancialProgress: newAction.actualFinancialProgress || '',
      projectName: newAction.projectName || '',
      contractNumber: newAction.contractNumber || ''
    };
    date.value = newAction.startDate ? new Date(newAction.startDate) : null;
  } else {
    form.value = { ...emptyForm };
    date.value = null;
  }
}, { immediate: true });

const formatDate = (date: Date) => {
  return format(date, 'PPP', { locale: ar });
};

const handleDateSelect = (newDate: Date | null) => {
  if (newDate) {
    form.value.startDate = format(newDate, 'yyyy-MM-dd');
  } else {
    form.value.startDate = '';
  }
};

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    weight: form.value.weight ? Number(form.value.weight) : undefined,
    duration: form.value.duration ? Number(form.value.duration) : undefined
  });
  emit('update:open', false);
};
</script>
