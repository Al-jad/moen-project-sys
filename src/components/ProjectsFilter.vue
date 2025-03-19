<template>
  <div class="min-h-screen w-[300px] bg-gray-50 p-6 dark:bg-gray-800/50">
    <div class="flex flex-col gap-6">

      <div
        class="rounded-md border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50">
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
            <CustomInput v-model="localSearchQuery" placeholder="ابحث عن اسم او وصف او الرقم المرجعي" icon="lucide:search"
              @update:model-value="handleSearch" />
          </FormField>
        </div>

        <hr v-if="!isFundedProjects" class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />

        <!-- Funding Type -->
        <div class="space-y-3" v-if="!isFundedProjects">
          <label class="text-sm text-gray-600 dark:text-gray-300">نوع التمويل</label>
          <div class="space-y-2">
            <CustomCheckbox v-model="localSelectedFunding.all" id="all" label="الكل" />
            <CustomCheckbox v-model="localSelectedFunding.government" id="government" label="البرنامج الحكومي" />
            <CustomCheckbox v-model="localSelectedFunding.investment" id="investment" label="الموازنة الاستثمارية" />
            <CustomCheckbox v-model="localSelectedFunding.operational" id="operational" label="الموازنة التشغيلية" />
            <CustomCheckbox v-model="localSelectedFunding.environment" id="environment" label="الممولة دوليا" />
            <CustomCheckbox v-model="localSelectedFunding.fund" id="fund" label="ممولة" />
          </div>
        </div>
        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Budget Range -->
        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">المبلغ</label>
            <Switch 
              v-model="isBudgetFilterEnabled"
              size="sm" 
              class="mr-2" 
              label="تفعيل" 
            />
          </div>
          <div class="space-y-4" :class="{ 'opacity-50': !isBudgetFilterEnabled }">
            <Slider 
              v-model="localBudgetRange" 
              :min="100000" 
              :max="9000000" 
              :step="100000" 
              class="w-full"
              :disabled="!isBudgetFilterEnabled"
            />
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الادنى</label>
                <div class="relative">
                  <CustomInput 
                    v-model="localBudgetRange[1]" 
                    type="number" 
                    :min="100000" 
                    :max="localBudgetRange[0]"
                    :disabled="!isBudgetFilterEnabled" 
                  />
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">د.ع</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-500 dark:text-gray-400">الحد الاعلى</label>
                <div class="relative">
                  <CustomInput 
                    v-model="localBudgetRange[0]" 
                    type="number" 
                    :min="localBudgetRange[1]" 
                    :max="9000000"
                    :disabled="!isBudgetFilterEnabled" 
                  />
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">د.ع</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Implementation Years -->
        <div class="space-y-2" v-if="!isFundedProjects">
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
          <label class="text-sm text-gray-600 dark:text-gray-300">سنوات التنفيذ</label>
          <CustomSelect v-model="localSelectedYear" :options="implementationYears" placeholder="جميع المواعيد"
            :triggerClass="'flex flex-row-reverse w-full'" />
        </div>


        <!-- is Government Projects -->
        <div v-if="isFundedProjects" class="space-y-3 my-4">
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
          <Switch @update:model-value="localShowGovernmentProjects = $event" v-model="localShowGovernmentProjects"
            dir="rtl" label="عرض البرامج الحكومية" />
        </div>

        <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />

        <!-- Project Status -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حالة المشروع</label>
          <div class="space-y-2">
            <CustomCheckbox v-model="localSelectedStatus.all" id="status-all" label="الكل" />
            <CustomCheckbox v-model="localSelectedStatus.completed" id="status-completed" label="منجز">
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </CustomCheckbox>
            <CustomCheckbox v-model="localSelectedStatus.inProgress" id="status-in-progress" label="قيد الانجاز">
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-yellow-500" />
            </CustomCheckbox>
            <CustomCheckbox v-model="localSelectedStatus.delayed" id="status-delayed" label="متلكئ">
              <div class="mx-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
            </CustomCheckbox>
          </div>
        </div>

        <div>
          <hr class="my-4 border border-dashed border-gray-100 dark:border-gray-700" />
        </div>

        <!-- Beneficiary -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">الجهة المستفيدة</label>
          <div class="space-y-2">
            <CustomCheckbox 
              v-model="localSelectedBeneficiaries.all" 
              id="beneficiary-all" 
              label="الكل" 
            />
            
            <CustomCheckbox 
              v-for="beneficiary in beneficiaries" 
              :key="beneficiary.id"
              v-model="localSelectedBeneficiaries[beneficiary.id]" 
              :id="`beneficiary-${beneficiary.id}`"
              :label="beneficiary.name" 
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
            @click.prevent="resetFilters"
          >
            الغاء
          </PrimaryButton>
          <PrimaryButton 
            buttonClass="flex-1" 
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
import { Icon } from '@iconify/vue';
import axiosInstance from '@/plugins/axios';
import { ref, onMounted } from 'vue';

const props = defineProps({
  isFundedProjects: {
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
  
  localShowGovernmentProjects.value = props.showGovernmentProjects;
  
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
  axiosInstance.get('/api/beneficiary').then((res) => {
    beneficiaries.value = res.data;
    
    // Initialize the selection object with all beneficiaries set to false
    if (Object.keys(localSelectedBeneficiaries.value).length <= 1) {
      const beneficiariesObj = { all: true };
      
      // Add each beneficiary with false initial value
      beneficiaries.value.forEach(beneficiary => {
        beneficiariesObj[beneficiary.id] = false;
      });
      
      // Update the local selection object
      localSelectedBeneficiaries.value = beneficiariesObj;
    }
  }).catch(error => {
    console.error('Error fetching beneficiaries:', error);
  });
}

// Handle "all" selection for beneficiaries
function updateBeneficiarySelection() {
  if (localSelectedBeneficiaries.value.all) {
    // If "all" is selected, deselect individual options
    Object.keys(localSelectedBeneficiaries.value).forEach(key => {
      if (key !== 'all') {
        localSelectedBeneficiaries.value[key] = false;
      }
    });
  } else {
    // Check if any individual option is selected
    const anyIndividualSelected = Object.keys(localSelectedBeneficiaries.value).some(
      key => key !== 'all' && localSelectedBeneficiaries.value[key]
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
    Object.keys(localSelectedStatus.value).forEach(key => {
      if (key !== 'all') {
        localSelectedStatus.value[key] = false;
      }
    });
  } else {
    // Check if any individual option is selected
    const anyIndividualSelected = Object.keys(localSelectedStatus.value).some(
      key => key !== 'all' && localSelectedStatus.value[key]
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
    Object.keys(localSelectedFunding.value).forEach(key => {
      if (key !== 'all') {
        localSelectedFunding.value[key] = false;
      }
    });
  } else {
    // Check if any individual option is selected
    const anyIndividualSelected = Object.keys(localSelectedFunding.value).some(
      key => key !== 'all' && localSelectedFunding.value[key]
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

const resetFilters = () => {
  // Reset all local filters
  localSearchQuery.value = '';
  localBudgetRange.value = [1000, 90000000];
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
  };
  
  // Reset beneficiaries to only "all" selected
  const resetBeneficiaries = { all: true };
  beneficiaries.value.forEach(beneficiary => {
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
    isBudgetFilterEnabled: isBudgetFilterEnabled.value // Send the enablement state
  };
  
  emit('filter-applied', filters);
};
</script>