<template>
  <div class="space-y-8">
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:info" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">معلومات المشروع الأساسية</h4>
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="اسم المشروع" class="md:col-span-2">
            <CustomInput
              v-if="isEditing"
              :model-value="form.name"
              @update:model-value="(v: string) => updateFormField('name', v)"
              dir="rtl"
              placeholder="ادخل اسم المشروع"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ form.name || 'لم يتم تحديد اسم المشروع' }}
            </div>
          </FormField>
          <FormField label="الدائرة المنفذة">
            <CustomInput
              v-if="isEditing"
              :model-value="form.executingDepartment"
              @update:model-value="(v: string) => updateFormField('executingDepartment', v)"
              dir="rtl"
              placeholder="الدائرة المنفذة"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ form.executingDepartment || 'لم يتم تحديد الدائرة' }}
            </div>
          </FormField>
          <FormField label="الجهة المنفذة">
            <CustomInput
              v-if="isEditing"
              :model-value="form.implementingEntity"
              @update:model-value="(v: string) => updateFormField('implementingEntity', v)"
              dir="rtl"
              placeholder="ادخل اسم الجهة المنفذة"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ form.implementingEntity || 'لم يتم تحديد الجهة' }}
            </div>
          </FormField>
        </div>
      </div>
    </div>
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:target" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">حالة ونوع المشروع</h4>
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="حالة المشروع">
            <CustomSelect
              v-if="isEditing"
              :model-value="form.projectStatus"
              @update:model-value="(v) => updateFormField('projectStatus', v)"
              :options="projectStatusOptions"
              placeholder="اختر حالة المشروع"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ getStatusText(form.projectStatus) }}
            </div>
          </FormField>
          <FormField label="نوع المشروع">
            <div v-if="isEditing" class="flex items-center gap-3">
              <CustomSwitch
                :model-value="form.isGovernment"
                @update:model-value="(v) => updateFormField('isGovernment', v)"
                label="ضمن البرنامج الحكومي"
              />
              <div class="text-xs" :class="form.isGovernment ? 'text-green-600' : 'text-gray-500'">
                {{ form.isGovernment ? 'مشروع حكومي' : 'مشروع غير حكومي' }}
              </div>
            </div>
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ form.isGovernment ? 'مشروع حكومي' : 'مشروع غير حكومي' }}
            </div>
          </FormField>
        </div>
      </div>
    </div>
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:users" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">الجهات المستفيدة والمانحة</h4>
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-6">
          <FormField label="الجهات المستفيدة من المشروع">
            <CustomMultiSelect
              v-if="isEditing"
              :model-value="form.beneficiaryEntities"
              @update:model-value="(v) => updateFormField('beneficiaryEntities', v)"
              :options="beneficiaries"
              placeholder="اختر الجهات المستفيدة"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ formatBeneficiaries(form.beneficiaryEntities) }}
            </div>
          </FormField>
          <FormField label="الجهة المانحة">
            <CustomInput
              v-if="isEditing"
              :model-value="form.grantingEntity"
              @update:model-value="(v) => updateFormField('grantingEntity', v)"
              dir="rtl"
              placeholder="ادخل اسم الجهة المانحة"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ form.grantingEntity || 'لم يتم تحديد الجهة المانحة' }}
            </div>
          </FormField>
        </div>
      </div>
    </div>
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:dollar-sign" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">تفاصيل التمويل</h4>
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="نوع العملة">
            <CustomSelect
              v-if="isEditing"
              :model-value="form.currency"
              @update:model-value="(v) => updateFormField('currency', v)"
              :options="currencyOptions"
              placeholder="اختر العملة"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ getCurrencyText(form.currency) }}
            </div>
          </FormField>
          <FormField label="كلفة المشروع">
            <NumberInput
              v-if="isEditing"
              :model-value="form.cost"
              @update:model-value="(v) => updateFormField('cost', v)"
              placeholder="ادخل كلفة المشروع"
              :unit="form.currency === 1 ? 'د.ع' : '$'"
            />
            <div v-else class="text-sm font-medium text-foreground-heading">
              {{ formatCostWithCurrency(form.cost, form.currency) }}
            </div>
          </FormField>
        </div>
      </div>
    </div>
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:target" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">أهداف المشروع</h4>
        </div>
      </div>
      <div class="p-4">
        <FormField label="الهدف من المشروع">
          <Textarea
            v-if="isEditing"
            :model-value="form.projectObjectives"
            @update:model-value="(v) => updateFormField('projectObjectives', v)"
            dir="rtl"
            placeholder="ادخل الهدف من المشروع"
            class="min-h-[100px] border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100"
          />
          <div v-else class="text-sm font-medium text-foreground-heading">
            {{ form.projectObjectives || 'لم يتم تحديد الهدف' }}
          </div>
        </FormField>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import CustomSwitch from '@/components/CustomSwitch.vue';
  import FormField from '@/components/FormField.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Textarea } from '@/components/ui/textarea';
  import { beneficiaryService } from '@/services/beneficiaryService';
  import type { FormState } from '@/stores/funded-project-store';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import { Icon } from '@iconify/vue';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';

  const props = defineProps<{
    isEditing: boolean;
  }>();

  const store = useFundedProjectStore();
  const { form } = storeToRefs(store);
  const beneficiaries = ref<{ value: string; label: string }[]>([]);

  const updateFormField = <T extends keyof FormState>(field: T, value: FormState[T]) => {
    store.updateForm({ [field]: value } as Partial<FormState>);
  };

  const currencyOptions = [
    { value: 1, label: 'دينار عراقي' },
    { value: 2, label: 'دولار أمريكي' },
    { value: 3, label: 'يورو أوروبي' },
  ] as const;

  const projectStatusOptions = [
    { value: 0, label: 'ملغاة' },
    { value: 1, label: 'قيد التنفيذ' },
    { value: 2, label: 'منجزة' },
    { value: 3, label: 'متلكئة' },
  ] as const;

  const formatBeneficiaries = (entities: number[]) => {
    if (!entities?.length) return 'لم يتم تحديد الجهات المستفيدة';
    if (beneficiaries.value.length > 0) {
      return entities
        .map((id) => beneficiaries.value.find((b) => b.value === id.toString())?.label || id)
        .join('، ');
    }
    return entities.join('، ');
  };

  onMounted(async () => {
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      beneficiaries.value = response.data.map((b: any) => ({
        value: b.id.toString(),
        label: b.name,
      }));
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  });

  const formatCostWithCurrency = (value: number | null, currency: number) => {
    if (!value) return '0';
    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return currency === 1 ? `${formattedValue} د.ع` : `$${formattedValue}`;
  };

  const getStatusText = (status: number) => {
    return projectStatusOptions.find((opt) => opt.value === status)?.label || 'غير معروف';
  };

  const getCurrencyText = (currency: number) => {
    return currencyOptions.find((opt) => opt.value === currency)?.label || 'غير معروف';
  };

  const updateIsGovernment = (value: boolean) => {
    store.updateForm({ isGovernment: value });
  };
</script>
