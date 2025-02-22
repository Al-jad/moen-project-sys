<template>
  <FormSection title="التفاصيل العامة للمشروع" full-width>
    <div class="space-y-8">
      <!-- Basic Info Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">معلومات المشروع الأساسية</h3>
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="اسم المشروع" class="md:col-span-2">
            <CustomInput
              v-model="store.form.name"
              dir="rtl"
              placeholder="خطة التكييف المحلية LAPS"
            />
          </FormField>
          <FormField label="الدائرة المنفذة">
            <CustomInput
              v-model="store.form.executingDepartment"
              dir="rtl"
              placeholder="الدائرة المنفذة"
            />
          </FormField>
          <FormField label="الجهة المنفذة">
            <CustomInput
              v-model="store.form.implementingEntity"
              dir="rtl"
              placeholder="برنامج الاغذية العالمي"
            />
          </FormField>
        </div>
      </div>

      <!-- Beneficiaries Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">الجهات المستفيدة والمانحة</h3>
        <div class="grid gap-6">
          <FormField label="الجهات المستفيدة من المشروع">
            <CustomInput
              v-model="store.form.beneficiaryEntities"
              dir="rtl"
              placeholder="ادخل اسم الجهة المستفيدة"
            />
          </FormField>
          <FormField label="الجهة المانحة">
            <CustomInput
              v-model="store.form.grantingEntity"
              dir="rtl"
              placeholder="ادخل اسم الجهة المانحة"
            />
          </FormField>
        </div>
      </div>

      <!-- Funding Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">تفاصيل التمويل</h3>
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="نوع التمويل">
            <div
              class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
            >
              دولي
            </div>
          </FormField>
          <FormField label="كلفة المشروع بالدولار">
            <NumberInput v-model="store.form.cost" placeholder="165,000" unit="$" />
          </FormField>
        </div>
      </div>

      <!-- Objectives Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">أهداف المشروع</h3>
        <FormField label="الهدف من المشروع">
          <Textarea
            v-model="store.form.projectObjectives"
            dir="rtl"
            placeholder="اعداد وثائق خطة التكييف المحلية LAPs..."
            class="min-h-[100px] border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100"
          />
        </FormField>
      </div>
    </div>
  </FormSection>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Textarea } from '@/components/ui/textarea';
  import { useFundedProjectStore } from '@/stores/fundedProject';

  const store = useFundedProjectStore();
</script>
