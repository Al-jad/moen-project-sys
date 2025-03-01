<template>
  <div class="min-h-screen w-[300px] bg-gray-50 p-6 dark:bg-gray-800/50">
    <div class="flex flex-col gap-6">
      <!-- Search Input -->

      <div
        class="rounded-md border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50"
      >
        <!-- Filter Header -->
        <div class="bg-white dark:bg-gray-800/95">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:filter" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">فلتر</span>
            </div>
          </div>
          <hr class="my-2 w-full border-gray-200 dark:border-gray-700" />
        </div>
        <div class="my-4 rounded-md">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200"> بحث </label>
          <FormField>
            <CustomInput
              v-model="searchQuery"
              placeholder="ابحث عن اسم او وصف او الرقم المرجعي"
              :icon="Search"
            />
          </FormField>
        </div>
        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Funding Type -->
        <div class="space-y-3">
          <label class="text-sm text-gray-600 dark:text-gray-300">نوع التمويل</label>
          <div class="space-y-2">
            <CustomCheckbox v-model="selectedFunding.all" id="all" label="الكل" />
            <CustomCheckbox
              v-model="selectedFunding.government"
              id="government"
              label="البرنامج الحكومي"
            />
            <CustomCheckbox
              v-model="selectedFunding.investment"
              id="investment"
              label="الموازنة الاستثمارية"
            />
            <CustomCheckbox
              v-model="selectedFunding.operational"
              id="operational"
              label="الموازنة التشغيلية"
            />
            <CustomCheckbox
              v-model="selectedFunding.environment"
              id="environment"
              label="الممولة دوليا"
            />
            <CustomCheckbox v-model="selectedFunding.fund" id="fund" label="ممولة" />
          </div>
        </div>
        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Budget Range -->
        <div class="mt-4 space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">المبلغ</label>
          <div class="space-y-4">
            <Slider
              v-model="budgetRange"
              :min="100000"
              :max="9000000"
              :step="100000"
              class="w-full"
            />
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الادنى</label>
                <div class="relative">
                  <CustomInput
                    v-model="budgetRange[1]"
                    type="number"
                    :min="100000"
                    :max="budgetRange[0]"
                  />
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
                    >د.ع</span
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الاعلى</label>
                <div class="relative">
                  <CustomInput
                    v-model="budgetRange[0]"
                    type="number"
                    :min="budgetRange[1]"
                    :max="9000000"
                  />
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400"
                    >د.ع</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Years -->
        <div class="space-y-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">سنوات التنفيذ</label>
          <CustomSelect
            v-model="selectedYear"
            :options="implementationYears"
            placeholder="جميع المواعيد"
            :triggerClass="'flex flex-row-reverse w-full'"
          />
        </div>

        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Project Status -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حالة المشروع</label>
          <div class="space-y-2">
            <CustomCheckbox v-model="selectedStatus.all" id="status-all" label="الكل" />
            <CustomCheckbox v-model="selectedStatus.completed" id="status-completed" label="منجز">
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="selectedStatus.inProgress"
              id="status-in-progress"
              label="قيد الانجاز"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
            </CustomCheckbox>
            <CustomCheckbox v-model="selectedStatus.delayed" id="status-delayed" label="متلكئ">
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
            </CustomCheckbox>
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Beneficiary -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200"
            >الجهة المستفيدة</label
          >
          <div class="space-y-2">
            <CustomCheckbox v-model="selectedBeneficiaries.all" id="beneficiary-all" label="الكل" />
            <CustomCheckbox
              v-model="selectedBeneficiaries.baghdadEducation"
              id="beneficiary-baghdad"
              label="مديرية تربية بغداد"
            />
            <CustomCheckbox
              v-model="selectedBeneficiaries.environmentProtection"
              id="beneficiary-environment"
              label="دائرة حماية تحسين بيئة"
            />
            <CustomCheckbox
              v-model="selectedBeneficiaries.najafEducation"
              id="beneficiary-najaf"
              label="مديرية تربية النجف"
            />
            <CustomCheckbox
              v-model="selectedBeneficiaries.basraEducation"
              id="beneficiary-basra"
              label="مديرية تربية البصرة"
            />
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>
        <div class="mt-6 flex gap-3">
          <PrimaryButton variant="outline" buttonClass="flex-1 text-gray-700 dark:text-gray-200">
            الغاء
          </PrimaryButton>
          <PrimaryButton buttonClass="flex-1"> تطبيق </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import CustomCheckbox from '@/components/CustomCheckbox.vue';
  import CustomInput from '@/components/CustomInput.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import FormField from '@/components/FormField.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Slider } from '@/components/ui/slider';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

  const budgetRange = ref([100000, 9000000]);

  const selectedFunding = ref({
    all: false,
    government: false,
    investment: false,
    operational: false,
    environment: false,
    fund: false,
  });

  const selectedBeneficiaries = ref({
    all: true,
    baghdadEducation: false,
    environmentProtection: false,
    najafEducation: false,
    basraEducation: false,
  });

  const selectedYear = ref('all');

  const implementationYears = [
    { value: 'all', label: 'جميع المواعيد' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  const searchQuery = ref('');

  const selectedStatus = ref({
    all: false,
    completed: false,
    inProgress: false,
    delayed: false,
  });
</script>
