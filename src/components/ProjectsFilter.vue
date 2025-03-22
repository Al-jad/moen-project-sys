<template>
  <div
    :class="
      disabled
        ? 'cursor-not-allowed opacity-80'
        : 'min-h-screen w-[400px] bg-gray-50 p-6 dark:bg-gray-800/50'
    "
  >
    <div class="flex flex-col gap-6">
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

        <!-- Search Input -->
        <div class="my-4 rounded-md">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200"> بحث </label>
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

        <hr
          v-if="!isFundedProjects"
          class="my-4 border border-dashed border-gray-100 dark:border-gray-700"
        />

        <!-- Funding Type -->
        <div class="space-y-3" v-if="!isFundedProjects">
          <label class="text-sm text-gray-600 dark:text-gray-300">نوع التمويل</label>
          <div class="space-y-2">
            <CustomCheckbox
              v-model="localSelectedFunding.all"
              id="all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.government"
              id="government"
              label="البرنامج الحكومي"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.investment"
              id="investment"
              label="الموازنة الاستثمارية"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.operational"
              id="operational"
              label="الموازنة التشغيلية"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.environment"
              id="environment"
              label="الممولة دوليا"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedFunding.fund"
              id="fund"
              label="ممولة"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
          </div>
        </div>
        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Budget Range -->
        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">المبلغ</label>
            <CustomSwitch
              v-model="isBudgetFilterEnabled"
              label="تفعيل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
          </div>
          <div class="space-y-4" :class="{ 'opacity-50': !isBudgetFilterEnabled }">
            <Slider
              v-model="localBudgetRange"
              :min="budgetRange[0]"
              :max="budgetRange[1]"
              :step="calculateStep(budgetRange[1] - budgetRange[0])"
              class="w-full"
              :disabled="!isBudgetFilterEnabled || disabled"
              :class="{ 'cursor-not-allowed': disabled }"
              @update:model-value="handleSliderChange"
            />
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الادنى</label>
                <NumberInput
                  v-model="localBudgetRange[0]"
                  :disabled="!isBudgetFilterEnabled || disabled"
                  :class="{ 'cursor-not-allowed': disabled }"
                  unit="د.ع"
                  @update:model-value="validateAndUpdateMin"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الاعلى</label>
                <NumberInput
                  v-model="localBudgetRange[1]"
                  :disabled="!isBudgetFilterEnabled || disabled"
                  :class="{ 'cursor-not-allowed': disabled }"
                  unit="د.ع"
                  @update:model-value="validateAndUpdateMax"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Years -->
        <div class="space-y-2" v-if="!isFundedProjects">
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
          <label class="text-sm text-gray-600 dark:text-gray-300">سنوات التنفيذ</label>
          <CustomSelect
            v-model="localSelectedYear"
            :options="implementationYears"
            placeholder="جميع المواعيد"
            :triggerClass="'flex flex-row-reverse w-full'"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
          />
        </div>

        <!-- is Government Projects -->
        <div v-if="isFundedProjects" class="my-4 space-y-3">
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
          <CustomSwitch
            v-model="localShowGovernmentProjects"
            label="عرض البرامج الحكومية"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
          />
        </div>

        <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />

        <!-- Project Status -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حالة المشروع</label>
          <div class="space-y-2">
            <CustomCheckbox
              v-model="localSelectedStatus.all"
              id="status-all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
            <CustomCheckbox
              v-model="localSelectedStatus.completed"
              id="status-completed"
              label="منجز"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.inProgress"
              id="status-in-progress"
              label="قيد الانجاز"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-yellow-500" />
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.delayed"
              id="status-delayed"
              label="متلكئ"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
            </CustomCheckbox>
            <CustomCheckbox
              v-model="localSelectedStatus.cancelled"
              id="status-cancelled"
              label="ملغي"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            >
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-gray-500"></div>
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
            <CustomCheckbox
              v-model="localSelectedBeneficiaries.all"
              id="beneficiary-all"
              label="الكل"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />

            <CustomCheckbox
              v-for="beneficiary in beneficiaries"
              :key="beneficiary.id"
              v-model="localSelectedBeneficiaries[beneficiary.id]"
              :id="`beneficiary-${beneficiary.id}`"
              :label="beneficiary.name"
              :disabled="disabled"
              :class="{ 'cursor-not-allowed': disabled }"
            />
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>
        <div class="mt-6 flex gap-3">
          <PrimaryButton
            variant="outline"
            buttonClass="flex-1 text-gray-700 dark:text-gray-200"
            :disabled="disabled"
            :class="{ 'cursor-not-allowed': disabled }"
            @click.prevent="resetFilters"
          >
            الغاء
          </PrimaryButton>
          <PrimaryButton
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
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { onMounted, ref, watch } from 'vue';
  import CustomSwitch from './CustomSwitch.vue';
  import NumberInput from './NumberInput.vue';

  const props = defineProps({
    isFundedProjects: {
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
  });
  const localSelectedBeneficiaries = ref({ all: true });
  const localShowGovernmentProjects = ref(false);
  const localSelectedFunding = ref({
    all: true,
    government: false,
    investment: false,
    operational: false,
    environment: false,
  });

  // Add a new ref for budget filter enablement
  const isBudgetFilterEnabled = ref(false);

  // Watch for changes in budget filter enablement
  watch(isBudgetFilterEnabled, (newValue) => {
    if (newValue) {
      // When enabled, set to the full range from props
      localBudgetRange.value = [...props.budgetRange];
    }
  });

  // Watch for changes in budget range props
  watch(
    () => props.budgetRange,
    (newRange) => {
      // Update local range if filter is enabled or during initialization
      if (isBudgetFilterEnabled.value) {
        localBudgetRange.value = [...newRange];
      }
    },
    { deep: true }
  );

  // Initialize local values from props
  onMounted(() => {
    // Copy from props to local state
    localSearchQuery.value = props.searchQuery || '';
    localBudgetRange.value = [...props.budgetRange];
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

    if (props.selectedFunding) {
      localSelectedFunding.value = { ...props.selectedFunding };
    }

    getBeneficiaries();
  });

  const implementationYears = [
    { value: 'all', label: 'جميع المواعيد' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  const beneficiaries = ref([]);
  function getBeneficiaries() {
    axiosInstance
      .get('/api/beneficiary')
      .then((res) => {
        beneficiaries.value = res.data;

        // Initialize the selection object with all beneficiaries set to false
        if (Object.keys(localSelectedBeneficiaries.value).length <= 1) {
          const beneficiariesObj = { all: true };

          // Add each beneficiary with false initial value
          beneficiaries.value.forEach((beneficiary) => {
            beneficiariesObj[beneficiary.id] = false;
          });

          // Update the local selection object
          localSelectedBeneficiaries.value = beneficiariesObj;
        }
      })
      .catch((error) => {
        console.error('Error fetching beneficiaries:', error);
      });
  }

  // Handle "all" selection for beneficiaries
  function updateBeneficiarySelection() {
    if (localSelectedBeneficiaries.value.all) {
      // If "all" is selected, deselect individual options
      Object.keys(localSelectedBeneficiaries.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedBeneficiaries.value[key] = false;
        }
      });
    } else {
      // Check if any individual option is selected
      const anyIndividualSelected = Object.keys(localSelectedBeneficiaries.value).some(
        (key) => key !== 'all' && localSelectedBeneficiaries.value[key]
      );

      // If none is selected, reselect "all"
      if (!anyIndividualSelected) {
        localSelectedBeneficiaries.value.all = true;
      }
    }
  }

  // Handle "all" selection for status
  function updateStatusSelection() {
    if (localSelectedStatus.value.all) {
      // If "all" is selected, deselect individual options
      Object.keys(localSelectedStatus.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedStatus.value[key] = false;
        }
      });
    } else {
      // Check if any individual option is selected
      const anyIndividualSelected = Object.keys(localSelectedStatus.value).some(
        (key) => key !== 'all' && localSelectedStatus.value[key]
      );

      // If none is selected, reselect "all"
      if (!anyIndividualSelected) {
        localSelectedStatus.value.all = true;
      }
    }
  }

  // Handle "all" selection for funding
  function updateFundingSelection() {
    if (localSelectedFunding.value.all) {
      // If "all" is selected, deselect individual options
      Object.keys(localSelectedFunding.value).forEach((key) => {
        if (key !== 'all') {
          localSelectedFunding.value[key] = false;
        }
      });
    } else {
      // Check if any individual option is selected
      const anyIndividualSelected = Object.keys(localSelectedFunding.value).some(
        (key) => key !== 'all' && localSelectedFunding.value[key]
      );

      // If none is selected, reselect "all"
      if (!anyIndividualSelected) {
        localSelectedFunding.value.all = true;
      }
    }
  }

  // Search without debounce
  const handleSearch = (val) => {
    localSearchQuery.value = val;
  };

  const calculateStep = (range) => {
    // Calculate a reasonable step size based on the range
    const magnitude = Math.floor(Math.log10(range));
    return Math.pow(10, magnitude - 2); // Two orders of magnitude smaller than the range
  };

  const resetFilters = () => {
    // Reset all local filters
    localSearchQuery.value = '';
    localBudgetRange.value = [...props.budgetRange]; // Use the props range instead of hardcoded values
    localSelectedFunding.value = {
      all: true,
      government: false,
      investment: false,
      operational: false,
      environment: false,
    };
    localSelectedYear.value = null;
    localSelectedStatus.value = {
      all: true,
      completed: false,
      inProgress: false,
      delayed: false,
      cancelled: false,
    };

    // Reset beneficiaries to only "all" selected
    const resetBeneficiaries = { all: true };
    beneficiaries.value.forEach((beneficiary) => {
      resetBeneficiaries[beneficiary.id] = false;
    });
    localSelectedBeneficiaries.value = resetBeneficiaries;

    localShowGovernmentProjects.value = false;

    isBudgetFilterEnabled.value = false;

    applyFilters();
  };

  const applyFilters = () => {
    // Make sure selections are consistent
    updateBeneficiarySelection();
    updateStatusSelection();
    updateFundingSelection();

    // Send all filters to parent
    const filters = {
      searchQuery: localSearchQuery.value,
      budgetRange: isBudgetFilterEnabled.value ? localBudgetRange.value : null, // Only send budget if enabled
      selectedFunding: localSelectedFunding.value,
      selectedYear: localSelectedYear.value,
      selectedStatus: localSelectedStatus.value,
      selectedBeneficiaries: localSelectedBeneficiaries.value,
      showGovernmentProjects: localShowGovernmentProjects.value,
      isBudgetFilterEnabled: isBudgetFilterEnabled.value, // Send the enablement state
    };

    emit('filter-applied', filters);
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

  // Add these validation functions
  const validateAndUpdateMin = (val) => {
    let value = Number(val);

    // Ensure the value is within bounds
    value = Math.max(props.budgetRange[0], Math.min(value, localBudgetRange.value[1]));

    // Update the value
    localBudgetRange.value[0] = value;
  };

  const validateAndUpdateMax = (val) => {
    let value = Number(val);

    // Ensure the value is within bounds
    value = Math.max(localBudgetRange.value[0], Math.min(value, props.budgetRange[1]));

    // Update the value
    localBudgetRange.value[1] = value;
  };

  const handleSliderChange = (newValue) => {
    localBudgetRange[0] = newValue[0];
    localBudgetRange[1] = newValue[1];
  };
</script>
