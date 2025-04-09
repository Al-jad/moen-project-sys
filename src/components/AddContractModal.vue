<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <div class="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle class="text-xl font-semibold text-right text-gray-900 dark:text-white">
            {{ editData ? 'تعديل العقد' : 'اضافة عقد جديد' }}
          </DialogTitle>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Contract Name -->
          <div class="space-y-2">
            <Label class="text-right">اسم العقد</Label>
            <Input
              v-model="formData.name"
              placeholder="ادخل اسم العقد"
              class="border-gray-200"
              :class="{ 'border-red-500': errors.name }"
              required
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Contract Number -->
          <div class="space-y-2">
            <Label class="text-right">رقم العقد</Label>
            <Input
              v-model="formData.contractNumber"
              type="number"
              placeholder="ادخل رقم العقد"
              class="border-gray-200"
              :class="{ 'border-red-500': errors.contractNumber }"
              required
            />
            <p v-if="errors.contractNumber" class="text-sm text-red-500"> رقم العقد مطلوب </p>
          </div>

          <!-- Executing Department -->
          <div class="space-y-2">
            <Label class="text-right">الجهة المنفذة</Label>
            <Input
              v-model="formData.executingDepartment"
              placeholder="ادخل اسم الجهة المنفذة"
              class="border-gray-200"
              :class="{ 'border-red-500': errors.executingDepartment }"
              required
            />
            <p v-if="errors.executingDepartment" class="text-sm text-red-500">
              الجهة المنفذة مطلوبة
            </p>
          </div>

          <!-- Cost -->
          <div class="space-y-2">
            <Label class="text-right">الكلفة</Label>
            <NumberInput
              v-model="formData.cost"
              placeholder="ادخل الكلفة"
              :class="{ 'border-red-500': errors.cost }"
              required
            />
            <p v-if="errors.cost" class="text-sm text-red-500">
              {{ errors.cost }}
            </p>
          </div>

          <!-- Project Selection -->
          <div class="space-y-2">
            <Label class="text-right">المشروع</Label>
            <CustomSelect
              v-model="formData.projectId"
              :options="projectOptions"
              placeholder="اختر المشروع"
              :class="{ 'border-red-500': errors.projectId }"
              icon="lucide:folder"
            />
            <p v-if="errors.projectId" class="text-sm text-red-500"> المشروع مطلوب </p>
          </div>

          <!-- Signing Date -->
          <div class="space-y-2">
            <Label class="text-right">تاريخ التوقيع</Label>
            <DateInput
              v-model="formData.signingDate"
              placeholder="اختر تاريخ التوقيع"
              :class="{ 'border-red-500': errors.signingDate }"
              required
            />
            <p v-if="errors.signingDate" class="text-sm text-red-500"> تاريخ التوقيع مطلوب </p>
          </div>

          <!-- Referral Date -->
          <div class="space-y-2">
            <Label class="text-right">تاريخ الإحالة</Label>
            <DateInput
              v-model="formData.referralDate"
              placeholder="اختر تاريخ الإحالة"
              :class="{ 'border-red-500': errors.referralDate }"
              required
            />
            <p v-if="errors.referralDate" class="text-sm text-red-500"> تاريخ الإحالة مطلوب </p>
          </div>

          <DialogFooter class="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" @click="handleClose">الغاء</Button>
            <Button type="submit" :loading="isSubmitting">{{
              editData ? 'تحديث' : 'اضافة'
            }}</Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import CustomSelect from '@/components/CustomSelect.vue';
  import DateInput from '@/components/DateInput.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { computed, reactive, ref, watch } from 'vue';

  interface Props {
    open: boolean;
    editData?: {
      id: number;
      name: string;
      contractNumber: number;
      executingDepartment: string;
      cost: number;
      projectId: number;
      signingDate: string;
      referralDate: string;
    } | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    editData: null,
  });

  const emit = defineEmits(['update:open', 'save']);

  const isSubmitting = ref(false);
  const regionalProjectStore = useRegionalProjectStore();
  const projects = computed(() => regionalProjectStore.projects);

  const projectOptions = computed(() => {
    return projects.value.map((project) => ({
      value: project.id,
      label: project.name || `مشروع ${project.id}`,
    }));
  });

  interface FormData {
    name: string;
    contractNumber: string;
    executingDepartment: string;
    cost: string;
    projectId: string;
    signingDate: string;
    referralDate: string;
  }

  const formData = ref<FormData>({
    name: '',
    contractNumber: '',
    executingDepartment: '',
    cost: '',
    projectId: '',
    signingDate: '',
    referralDate: '',
  });

  const errors = reactive({
    name: '',
    contractNumber: '',
    executingDepartment: '',
    cost: '',
    projectId: '',
    signingDate: '',
    referralDate: '',
  });

  // Watch for editData changes
  watch(
    () => props.editData,
    (newValue) => {
      if (newValue) {
        formData.value = {
          name: newValue.name || '',
          contractNumber: String(newValue.contractNumber),
          executingDepartment: newValue.executingDepartment,
          cost: String(newValue.cost),
          projectId: String(newValue.projectId),
          signingDate: newValue.signingDate,
          referralDate: newValue.referralDate,
        };
      } else {
        formData.value = {
          name: '',
          contractNumber: '',
          executingDepartment: '',
          cost: '',
          projectId: '',
          signingDate: '',
          referralDate: '',
        };
      }
      // Reset errors when form data changes
      Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = '';
      });
    },
    { immediate: true }
  );

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });

    if (!formData.value.name) {
      errors.name = 'اسم العقد مطلوب';
      isValid = false;
    }

    if (!formData.value.contractNumber) {
      errors.contractNumber = 'رقم العقد مطلوب';
      isValid = false;
    }

    if (!formData.value.executingDepartment) {
      errors.executingDepartment = 'الجهة المنفذة مطلوبة';
      isValid = false;
    }

    if (!formData.value.cost) {
      errors.cost = 'الكلفة مطلوبة';
      isValid = false;
    } else if (Number(formData.value.cost) <= 0) {
      errors.cost = 'الكلفة يجب ان تكون اكبر من 0';
      isValid = false;
    }

    if (!formData.value.projectId) {
      errors.projectId = 'المشروع مطلوب';
      isValid = false;
    }

    if (!formData.value.signingDate) {
      errors.signingDate = 'تاريخ التوقيع مطلوب';
      isValid = false;
    }

    if (!formData.value.referralDate) {
      errors.referralDate = 'تاريخ الإحالة مطلوب';
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      isSubmitting.value = true;

      // Format dates to ISO string with timezone
      const signingDate = new Date(formData.value.signingDate);
      const referralDate = new Date(formData.value.referralDate);

      const payload = {
        name: formData.value.name,
        contractNumber: Number(formData.value.contractNumber),
        executingDepartment: formData.value.executingDepartment,
        cost: Number(formData.value.cost),
        projectId: Number(formData.value.projectId),
        signingDate: signingDate.toISOString(),
        referralDate: referralDate.toISOString(),
      };
      emit('save', payload);
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleClose = () => {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });
    emit('update:open', false);
  };
</script>
