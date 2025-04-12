<template>
  <Dialog :open="open" @close="handleClose">
    <DialogContent class="sm:max-w-[32rem]">
      <DialogHeader>
        <DialogTitle>{{ contract ? 'تعديل العقد' : 'إضافة عقد جديد' }}</DialogTitle>
        <DialogDescription>
          {{ contract ? 'قم بتعديل بيانات العقد' : 'قم بإدخال بيانات العقد الجديد' }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">عنوان العقد</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            placeholder="ادخل عنوان العقد"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">المقاول</label>
          <input
            v-model="form.contractor"
            type="text"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            placeholder="ادخل اسم المقاول"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">كلفة العقد</label>
          <input
            v-model="form.cost"
            type="number"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            placeholder="ادخل كلفة العقد"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">حالة العقد</label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
          >
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="مكتمل">مكتمل</option>
            <option value="متوقف">متوقف</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">تفاصيل العقد</label>
          <textarea
            v-model="form.details"
            rows="4"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            placeholder="ادخل تفاصيل العقد"
          ></textarea>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="handleClose">الغاء</Button>
          <Button type="submit" :disabled="loading" class="bg-slate-700 hover:bg-slate-800">
            <Icon v-if="loading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            {{ contract ? 'حفظ التغييرات' : 'إضافة العقد' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Icon } from '@iconify/vue';
  import { reactive, watch } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    contract: {
      type: Object,
      default: null,
    },
    projectId: {
      type: [Number, String],
      required: true,
    },
  });

  const emit = defineEmits(['update:open', 'confirm', 'cancel']);

  const form = reactive({
    title: '',
    contractor: '',
    cost: 0,
    status: 'قيد التنفيذ',
    details: '',
    projectId: props.projectId,
  });

  watch(
    () => props.contract,
    (newContract) => {
      if (newContract) {
        Object.assign(form, {
          title: newContract.title || '',
          contractor: newContract.contractor || '',
          cost: newContract.cost || 0,
          status: newContract.status || 'قيد التنفيذ',
          details: newContract.details || '',
          projectId: props.projectId,
        });
      } else {
        Object.assign(form, {
          title: '',
          contractor: '',
          cost: 0,
          status: 'قيد التنفيذ',
          details: '',
          projectId: props.projectId,
        });
      }
    },
    { immediate: true }
  );

  const handleClose = () => {
    emit('update:open', false);
    emit('cancel');
  };

  const handleSubmit = () => {
    emit('confirm', { ...form });
  };
</script>
