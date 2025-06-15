<template>
  <BaseAddEditModal
    :open="open"
    :edit-data="editData"
    entity-name="عقد"
    :default-form-data="defaultFormData"
    @update:open="$emit('update:open', $event)"
    @save="handleSubmit"
    @cancel="handleCancel"
  >
    <template #form="{ formData: modalFormData, updateForm }">
      <div class="space-y-6">
        <!-- Contract Name Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:type"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Label class="text-sm font-semibold text-foreground-body">اسم العقد</Label>
            <span class="text-sm text-destructive">*</span>
          </div>
          <div class="group relative">
            <CustomInput
              :model-value="modalFormData.name"
              @update:model-value="updateForm('name', $event)"
              placeholder="ادخل اسم العقد"
            />
            <p v-if="errors.name" class="mt-2 text-sm text-destructive">{{ errors.name }}</p>
          </div>
        </div>

        <!-- Contract Number Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:hash"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Label class="text-sm font-semibold text-foreground-body">رقم العقد</Label>
            <span class="text-sm text-destructive">*</span>
          </div>
          <div class="group relative">
            <CustomInput
              :model-value="modalFormData.contractNumber"
              @update:model-value="updateForm('contractNumber', $event)"
              placeholder="ادخل رقم العقد"
            />
            <p v-if="errors.contractNumber" class="mt-2 text-sm text-destructive">{{
              errors.contractNumber
            }}</p>
          </div>
        </div>

        <!-- Executing Department Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:building-2"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Label class="text-sm font-semibold text-foreground-body">الجهة المنفذة</Label>
            <span class="text-sm text-destructive">*</span>
          </div>
          <div class="group relative">
            <CustomInput
              :model-value="modalFormData.executingDepartment"
              @update:model-value="updateForm('executingDepartment', $event)"
              placeholder="ادخل اسم الجهة المنفذة"
            />
            <p v-if="errors.executingDepartment" class="mt-2 text-sm text-destructive">{{
              errors.executingDepartment
            }}</p>
          </div>
        </div>

        <!-- Cost Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:dollar-sign"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
            />
            <Label class="text-sm font-semibold text-foreground-body">الكلفة</Label>
            <span class="text-sm text-destructive">*</span>
          </div>
          <div class="group relative">
            <NumberInput
              :model-value="modalFormData.cost"
              @update:model-value="updateForm('cost', $event)"
              placeholder="ادخل الكلفة"
            />
            <p v-if="errors.cost" class="mt-2 text-sm text-destructive">{{ errors.cost }}</p>
          </div>
        </div>

        <!-- Signing Date Field -->
        <div class="flex items-center gap-2">
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-2">
              <Icon
                icon="lucide:calendar-check"
                class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              />
              <Label class="text-sm font-semibold text-foreground-body">تاريخ التوقيع</Label>
              <span class="text-sm text-destructive">*</span>
            </div>
            <div class="group relative">
              <DateInput
                :model-value="modalFormData.signingDate"
                @update:model-value="updateForm('signingDate', $event)"
                placeholder="اختر تاريخ التوقيع"
              />
              <p v-if="errors.signingDate" class="mt-2 text-sm text-destructive">{{
                errors.signingDate
              }}</p>
            </div>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-2">
              <Icon
                icon="lucide:calendar-days"
                class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              />
              <Label class="text-sm font-semibold text-foreground-body">تاريخ الإحالة</Label>
              <span class="text-sm text-destructive">*</span>
            </div>
            <div class="group relative">
              <DateInput
                :model-value="modalFormData.referralDate"
                @update:model-value="updateForm('referralDate', $event)"
                placeholder="اختر تاريخ الإحالة"
              />
              <p v-if="errors.referralDate" class="mt-2 text-sm text-destructive">{{
                errors.referralDate
              }}</p>
            </div>
          </div>
        </div>

        <!-- Referral Date Field -->
      </div>
    </template>
  </BaseAddEditModal>
</template>

<script setup lang="ts">
  import BaseAddEditModal from '@/components/BaseAddEditModal.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import DateInput from '@/components/DateInput.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Label } from '@/components/ui/label';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, reactive } from 'vue';

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

  const regionalProjectStore = useRegionalProjectStore();
  const projects = computed(() => regionalProjectStore.projects);

  const defaultFormData = {
    name: '',
    contractNumber: '',
    executingDepartment: '',
    cost: '',
    projectId: '',
    signingDate: '',
    referralDate: '',
  };

  const errors = reactive({
    name: '',
    contractNumber: '',
    executingDepartment: '',
    cost: '',
    projectId: '',
    signingDate: '',
    referralDate: '',
  });

  const validateForm = (formData: typeof defaultFormData): boolean => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });

    if (!formData.name) {
      errors.name = 'اسم العقد مطلوب';
      isValid = false;
    }

    if (!formData.contractNumber) {
      errors.contractNumber = 'رقم العقد مطلوب';
      isValid = false;
    }

    if (!formData.executingDepartment) {
      errors.executingDepartment = 'الجهة المنفذة مطلوبة';
      isValid = false;
    }

    if (!formData.cost) {
      errors.cost = 'الكلفة مطلوبة';
      isValid = false;
    } else if (Number(formData.cost) <= 0) {
      errors.cost = 'الكلفة يجب ان تكون اكبر من 0';
      isValid = false;
    }

    if (!formData.signingDate) {
      errors.signingDate = 'تاريخ التوقيع مطلوب';
      isValid = false;
    }

    if (!formData.referralDate) {
      errors.referralDate = 'تاريخ الإحالة مطلوب';
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (formData: typeof defaultFormData) => {
    if (!validateForm(formData)) return;

    // Format dates to ISO string with timezone
    const signingDate = new Date(formData.signingDate);
    const referralDate = new Date(formData.referralDate);

    const payload = {
      name: formData.name,
      contractNumber: Number(formData.contractNumber),
      executingDepartment: formData.executingDepartment,
      cost: Number(formData.cost),
      projectId: Number(formData.projectId),
      signingDate: signingDate.toISOString(),
      referralDate: referralDate.toISOString(),
    };
    emit('save', payload);
  };

  const handleCancel = () => {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = '';
    });
  };
</script>

<style scoped>
  .animate-pulse-slow {
    animation: pulse-slow 2s infinite;
  }

  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
