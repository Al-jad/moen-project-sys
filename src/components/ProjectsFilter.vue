<template>
  <div
    :class="
      disabled ? 'cursor-not-allowed opacity-80' : '-mt-1 min-h-screen w-[400px] bg-background p-6'
    "
  >
    <div class="flex flex-col gap-6">
      <div class="rounded-md border border-border bg-background-surface p-6 shadow-sm">
        <!-- Filter Header -->
        <div class="bg-background-surface">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:filter" class="h-4 w-4 text-foreground-muted" />
              <span class="text-sm font-medium text-foreground-heading">فلتر</span>
            </div>
          </div>
          <hr class="my-2 w-full border-border" />
        </div>

        <!-- Search Input -->
        <div class="my-4 rounded-md">
          <label class="text-sm font-medium text-foreground-heading"> بحث </label>
          <FormField label="">
            <CustomInput
              v-model="localSearchQuery"
              placeholder="ابحث عن اسم او وصف او الرقم المرجعي"
              icon="lucide:search"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleSearch"
            />
          </FormField>
        </div>

        <hr v-if="!isFundedProjects" class="my-4 border border-dashed border-border" />

        <!-- Funding Type -->
        <div v-if="showFundingTypeFilter" class="space-y-3">
          <label class="text-sm text-foreground-muted">نوع التمويل</label>
          <div class="space-y-2">
            <CustomCheckbox
              v-model="localSelectedFunding.all"
              id="all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleAllFundingChange"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.fund"
              id="fund"
              label="مشروع ممول"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualFundingChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-purple-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedFunding.regional"
              id="regional"
              label="مشروع تنمية الأقاليم"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualFundingChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-teal-500"></div>
            </CustomCheckbox>
          </div>
        </div>

        <div v-if="showFundingTypeFilter">
          <hr class="my-4 border border-dashed border-border" />
        </div>

        <!-- Budget Range -->
        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm text-foreground-muted">المبلغ</label>
            <div class="flex items-center gap-4">
              <CustomSwitch
                v-model="isBudgetFilterEnabled"
                label="تفعيل"
                :disabled="disabled"
                :class="{ 'cursor-not-allowed': disabled }"
              />
            </div>
          </div>
          <div class="space-y-4" :class="{ 'opacity-50': !isBudgetFilterEnabled }">
            <CustomSlider
              v-model="localBudgetRange"
              :min="convertedMin"
              :max="convertedMax"
              :step="convertedStep"
              class="flex-1"
              :disabled="!isBudgetFilterEnabled || disabled"
            />
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="mb-1 block text-xs text-foreground-muted">الحد الأقصى</label>
                <NumberInput
                  v-model="localBudgetRange[1]"
                  :disabled="!isBudgetFilterEnabled || disabled"
                  :class="{ 'cursor-not-allowed': disabled }"
                  :unit="selectedCurrency === 'USD' ? UNITS.CURRENCY.USD : UNITS.CURRENCY.IQD"
                  @update:model-value="validateAndUpdateMax"
                />
              </div>

              <div class="flex-1">
                <label class="mb-1 block text-xs text-foreground-muted">الحد الأدنى</label>
                <NumberInput
                  v-model="localBudgetRange[0]"
                  :disabled="!isBudgetFilterEnabled || disabled"
                  :class="{ 'cursor-not-allowed': disabled }"
                  :unit="selectedCurrency === 'USD' ? UNITS.CURRENCY.USD : UNITS.CURRENCY.IQD"
                  @update:model-value="validateAndUpdateMin"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Years -->
        <div class="space-y-2" v-if="!isFundedProjects">
          <hr class="my-4 border border-dashed border-border" />
          <label class="text-sm text-foreground-muted">سنوات التنفيذ</label>
          <div class="px-2 text-sm text-destructive">
            <slot> الميزة غير متاحة، والبيانات الظاهرة للتوضيح فقط </slot>
          </div>
          <CustomSelect
            v-model="localSelectedYear"
            :options="implementationYears"
            disabled
            placeholder="جميع المواعيد"
            :triggerClass="'flex flex-row-reverse w-full'"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
          />
        </div>

        <!-- is Government Projects -->
        <div v-if="isFundedProjects" class="my-4 space-y-3">
          <hr class="my-4 border border-dashed border-border" />
          <CustomSwitch
            v-model="localShowGovernmentProjects"
            label="عرض البرامج الحكومية"
            :disabled="disabled"
            @update:model-value="handleGovernmentProjectsChange"
            :class="{ 'cursor-not-allowed': disabled }"
          />
        </div>

        <hr class="my-4 border border-dashed border-border" />

        <!-- Project Status -->
        <div class="space-y-3">
          <label class="text-sm text-foreground-muted">حالة المشروع</label>
          <div class="space-y-2">
            <CustomCheckbox
              v-model="localSelectedStatus.all"
              id="status-all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleAllStatusChange"
            />
            <CustomCheckbox
              v-model="localSelectedStatus.completed"
              id="status-completed"
              label="منجز"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualStatusChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.inProgress"
              id="status-in-progress"
              label="قيد التنفيذ"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualStatusChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-yellow-500" />
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.delayed"
              id="status-delayed"
              label="متلكئ"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualStatusChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.cancelled"
              id="status-cancelled"
              label="ملغي"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualStatusChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-gray-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.proposed"
              id="status-proposed"
              label="مقترح"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualStatusChange"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            </CustomCheckbox>
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-border" />
        </div>

        <!-- Beneficiary -->
        <div class="space-y-3">
          <label class="text-sm text-foreground-muted">الجهة المستفيدة</label>
          <div class="space-y-2">
            <CustomCheckbox
              v-model="localSelectedBeneficiaries.all"
              id="beneficiary-all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleAllBeneficiaryChange"
            />

            <CustomCheckbox
              v-for="beneficiary in props.beneficiaries"
              :key="beneficiary.id"
              v-model="localSelectedBeneficiaries[beneficiary.id]"
              :id="`beneficiary-${beneficiary.id}`"
              :label="beneficiary.name"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleIndividualBeneficiaryChange"
            />
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-border" />
        </div>
        <div class="mt-6 flex gap-3">
          <PrimaryButton
            variant="outline"
            buttonClass="flex-1 text-foreground-muted"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
            @click.prevent="resetFilters"
          >
            الغاء
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            buttonClass="flex-1"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
            @click.prevent="applyFilters"
          >
            تطبيق
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useToast } from '@/composables/useToast';
  import { CURRENCY_CONVERSION, UNITS } from '@/constants';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import CustomSlider from './CustomSlider.vue';
  import CustomSwitch from './CustomSwitch.vue';
  import NumberInput from './NumberInput.vue';

  const props = defineProps({
    isFundedProjects: {
      type: Boolean,
      default: false,
    },
    showFundingTypeFilter: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedFunding: {
      type: Object,
      default: () => ({}),
    },
    budgetRange: {
      type: Array,
      default: () => [100000, 9000000],
    },
    selectedYear: {
      type: String,
      default: null,
    },
    selectedStatus: {
      type: Object,
      default: () => ({}),
    },
    beneficiaries: {
      type: Array,
      default: () => [],
    },
    selectedBeneficiaries: {
      type: Object,
      default: () => ({}),
    },
    showGovernmentProjects: {
      type: Boolean,
      default: false,
    },
    searchQuery: {
      type: String,
      default: '',
    },
    selectedCurrency: {
      type: String,
      default: 'IQD',
    },
  });

  // Only emit filter-applied event
  const emit = defineEmits(['filter-applied']);

  // Create local copies of all filter values
  const localSearchQuery = ref('');
  const localBudgetRange = ref([100000, 9000000]);
  const localSelectedYear = ref(null);
  const localSelectedStatus = ref({
    all: true,
    completed: false,
    inProgress: false,
    delayed: false,
    cancelled: false,
    proposed: false,
  });
  const localSelectedBeneficiaries = ref({ all: true });
  const localShowGovernmentProjects = ref(false);
  const localSelectedFunding = ref({
    all: true,
    fund: false,
    regional: false,
  });

  // Add a new ref for budget filter enablement
  const isBudgetFilterEnabled = ref(false);

  const { showSuccess } = useToast();

  // Initialize local values from props
  onMounted(() => {
    // Copy from props to local state
    localSearchQuery.value = props.searchQuery || '';
    // Initialize budget range with proper currency conversion
    localBudgetRange.value = props.budgetRange.map((value) =>
      convertCurrency(value, 'IQD', props.selectedCurrency)
    );
    localSelectedYear.value = props.selectedYear;

    // Deep copy objects
    if (props.selectedStatus) {
      localSelectedStatus.value = { ...props.selectedStatus };
    }

    if (props.selectedBeneficiaries) {
      localSelectedBeneficiaries.value = { ...props.selectedBeneficiaries };
    }

    // Set government projects filter from props
    localShowGovernmentProjects.value = props.showGovernmentProjects || false;

    // Initialize funding with "all" selected and others unchecked
    localSelectedFunding.value = {
      all: true,
      fund: false,
      regional: false,
      ...(props.selectedFunding || {}),
    };

    if (props.beneficiaries && props.beneficiaries.length > 0) {
      if (Object.keys(localSelectedBeneficiaries.value).length <= 1) {
        const beneficiariesObj = { all: true };
        props.beneficiaries.forEach((beneficiary) => {
          beneficiariesObj[beneficiary.id] = false;
        });
        localSelectedBeneficiaries.value = beneficiariesObj;
      }
    }
  });

  const implementationYears = [
    { value: 'all', label: 'جميع المواعيد' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  const handleGovernmentProjectsChange = (value) => {
    // Update the local state to match the checkbox
    localShowGovernmentProjects.value = value;

    // When the filter changes, we can optionally apply filters immediately
    // or wait for the Apply button to be clicked
    // Uncomment the line below if you want immediate application
    // applyFilters();
  };

  // Add all handlers in one place
  const handleAllStatusChange = (value) => {
    if (value) {
      // If "All" is selected, uncheck all individual statuses
      Object.keys(localSelectedStatus.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedStatus.value[key] = false;
        }
      });
    }
  };

  const handleIndividualStatusChange = () => {
    // If any individual status is selected, uncheck "All"
    localSelectedStatus.value.all = false;
  };

  const handleAllFundingChange = (value) => {
    if (value) {
      // If "All" is selected, uncheck all individual funding options
      Object.keys(localSelectedFunding.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedFunding.value[key] = false;
        }
      });
    }
  };

  const handleIndividualFundingChange = () => {
    // If any individual funding option is selected, uncheck "All"
    localSelectedFunding.value.all = false;

    // If no individual options are selected, select "All"
    const hasSelectedOption = Object.entries(localSelectedFunding.value).some(
      ([key, value]) => key !== 'all' && value
    );
    if (!hasSelectedOption) {
      localSelectedFunding.value.all = true;
    }
  };

  const handleAllBeneficiaryChange = (value) => {
    if (value) {
      // If "All" is selected, uncheck all individual beneficiaries
      Object.keys(localSelectedBeneficiaries.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedBeneficiaries.value[key] = false;
        }
      });
    }
  };

  const handleIndividualBeneficiaryChange = () => {
    // If any individual beneficiary is selected, uncheck "All"
    localSelectedBeneficiaries.value.all = false;
  };

  // Search without debounce
  const handleSearch = (val) => {
    localSearchQuery.value = val;
  };

  // Add computed values for slider
  const convertedMin = computed(() =>
    convertCurrency(props.budgetRange[0], 'IQD', props.selectedCurrency)
  );
  const convertedMax = computed(() =>
    convertCurrency(props.budgetRange[1], 'IQD', props.selectedCurrency)
  );
  const convertedStep = computed(() => {
    const range = convertedMax.value - convertedMin.value;
    const magnitude = Math.floor(Math.log10(range));
    const step = Math.pow(10, magnitude - 2);
    return props.selectedCurrency === 'USD' ? Math.max(0.01, step) : step;
  });

  const resetFilters = () => {
    // Reset all local filters
    localSearchQuery.value = '';
    // Reset budget range with proper currency conversion
    localBudgetRange.value = props.budgetRange.map((value) =>
      convertCurrency(value, 'IQD', props.selectedCurrency)
    );
    localSelectedFunding.value = {
      all: true,
      fund: false,
      regional: false,
    };
    localSelectedYear.value = null;
    localSelectedStatus.value = {
      all: true,
      completed: false,
      inProgress: false,
      delayed: false,
      cancelled: false,
      proposed: false,
    };

    // Reset beneficiaries to only "all" selected    const resetBeneficiaries = { all: true };    props.beneficiaries.forEach((beneficiary) => {      resetBeneficiaries[beneficiary.id] = false;    });    localSelectedBeneficiaries.value = resetBeneficiaries;

    localShowGovernmentProjects.value = false;

    isBudgetFilterEnabled.value = false;

    applyFilters();
  };

  const applyFilters = () => {
    const filters = {
      searchQuery: localSearchQuery.value,
      budgetRange: isBudgetFilterEnabled.value ? localBudgetRange.value : null,
      selectedFunding: { ...localSelectedFunding.value },
      selectedYear: localSelectedYear.value,
      selectedStatus: localSelectedStatus.value,
      selectedBeneficiaries: localSelectedBeneficiaries.value,
      showGovernmentProjects: localShowGovernmentProjects.value,
      isBudgetFilterEnabled: isBudgetFilterEnabled.value,
    };

    emit('filter-applied', filters);
    showSuccess('تم تطبيق الفلتر بنجاح', 'تم تحديث قائمة المشاريع حسب المعايير المحددة');
  };

  // Add this function to check if a project matches the funding filter
  const projectMatchesFundingFilter = (project) => {
    if (localSelectedFunding.value.all) return true;

    if (localSelectedFunding.value.fund && project.isFunded) return true;
    if (localSelectedFunding.value.regional && !project.isFunded) return true;

    return false;
  };

  // Add these formatting functions after the other utility functions
  const formatPrice = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatPrice = (value) => {
    if (!value) return 0;
    return parseInt(value.toString().replace(/,/g, ''), 10);
  };

  // Update the validation functions for better sync with slider
  const validateAndUpdateMin = (val) => {
    let value = Number(val);
    if (isNaN(value)) {
      value = convertedMin.value;
    }

    // Ensure the value is within bounds
    value = Math.max(
      convertedMin.value,
      Math.min(value, localBudgetRange.value[1] - convertedStep.value)
    );

    // Update the entire array to trigger reactivity
    localBudgetRange.value = [value, localBudgetRange.value[1]];
  };

  const validateAndUpdateMax = (val) => {
    let value = Number(val);
    if (isNaN(value)) {
      value = convertedMax.value;
    }

    // Ensure the value is within bounds
    value = Math.min(
      convertedMax.value,
      Math.max(value, localBudgetRange.value[0] + convertedStep.value)
    );

    // Update the entire array to trigger reactivity
    localBudgetRange.value = [localBudgetRange.value[0], value];
  };

  // Watch for changes in budget range to ensure valid state
  watch(
    localBudgetRange,
    (newRange) => {
      if (!isBudgetFilterEnabled.value) return;

      const [min, max] = newRange;
      // Ensure values are within bounds and properly spaced
      if (max - min < convertedStep.value || min < convertedMin.value || max > convertedMax.value) {
        validateAndUpdateMin(min);
        validateAndUpdateMax(max);
      }
    },
    { deep: true }
  );

  // Watch for currency changes in props
  watch(
    () => props.selectedCurrency,
    (newCurrency) => {
      if (isBudgetFilterEnabled.value) {
        // Convert the current range from IQD to the new currency
        const convertedRange = localBudgetRange.value.map((value) => {
          return convertCurrency(value, 'IQD', newCurrency);
        });
        localBudgetRange.value = convertedRange;
      }
    },
    { immediate: true }
  );

  // Watch for changes in budget filter enablement
  watch(isBudgetFilterEnabled, (newValue) => {
    if (newValue) {
      // When enabled, set to the full range from props in the current currency
      localBudgetRange.value = props.budgetRange.map((value) =>
        convertCurrency(value, 'IQD', props.selectedCurrency)
      );
    }
  });

  // Watch for changes in budget range props
  watch(
    () => props.budgetRange,
    (newRange) => {
      // Update local range if filter is enabled or during initialization
      if (isBudgetFilterEnabled.value) {
        localBudgetRange.value = newRange.map((value) =>
          convertCurrency(value, 'IQD', props.selectedCurrency)
        );
      }
    },
    { deep: true }
  );

  // Watch for prop changes to auto-apply filters
  watch(
    () => [props.selectedStatus, props.showGovernmentProjects],
    ([newStatus, newShowGovernment]) => {
      if (props.isFundedProjects) {
        applyFilters();
      }
    },
    { immediate: true }
  );

  // Add currency conversion function with proper precision
  const convertCurrency = (value, fromCurrency, toCurrency) => {
    if (!value || isNaN(value)) return 0;
    const numValue = Number(value);
    if (fromCurrency === toCurrency) return numValue;

    let convertedValue;
    if (fromCurrency === 'USD') {
      convertedValue = numValue * CURRENCY_CONVERSION.USD_TO_IQD;
    } else {
      convertedValue = numValue * CURRENCY_CONVERSION.IQD_TO_USD;
    }

    // Round to appropriate precision
    const precision = CURRENCY_CONVERSION.PRECISION[toCurrency];
    return Number(convertedValue.toFixed(precision));
  };
</script>
