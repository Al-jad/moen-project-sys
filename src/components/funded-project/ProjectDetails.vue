<template>
  <div class="space-y-8">
    <!-- Basic Info Section -->
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
            <template v-if="isEditing">
              <CustomInput
                v-model="formData.name"
                dir="rtl"
                placeholder="خطة التكييف المحلية LAPS"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.name || 'لم يتم تحديد اسم المشروع' }}
              </div>
            </template>
          </FormField>
          <FormField label="الدائرة المنفذة">
            <template v-if="isEditing">
              <CustomInput
                v-model="formData.executingDepartment"
                dir="rtl"
                placeholder="الدائرة المنفذة"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.executingDepartment || 'لم يتم تحديد الدائرة' }}
              </div>
            </template>
          </FormField>
          <FormField label="الجهة المنفذة">
            <template v-if="isEditing">
              <CustomInput
                v-model="formData.implementingEntity"
                dir="rtl"
                placeholder="برنامج الاغذية العالمي"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.implementingEntity || 'لم يتم تحديد الجهة' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>
    </div>

    <!-- Project Status and Type Section -->
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:target" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">حالة ونوع المشروع</h4>
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Status select dropdown -->
          <FormField label="حالة المشروع">
            <template v-if="isEditing">
              <select
                v-model="formData.projectStatus"
                class="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option :value="0">ملغاة</option>
                <option :value="1">قيد التنفيذ</option>
                <option :value="2">منجزة</option>
                <option :value="3">متلكئة</option>
              </select>
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ getStatusText(formData.projectStatus) }}
              </div>
            </template>
          </FormField>

          <!-- Government Project Toggle -->
          <FormField label="نوع المشروع">
            <template v-if="isEditing">
              <div class="flex items-center gap-3">
                <CustomSwitch
                  v-model="formData.isGovernment"
                  label="ضمن البرنامج الحكومي"
                  @update:model-value="updateIsGovernment"
                />
                <div
                  class="text-xs"
                  :class="
                    formData.isGovernment
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  "
                >
                  {{
                    formData.isGovernment
                      ? 'تم تعيين المشروع كاحد مشاريع البرنامج الحكومي'
                      : 'ليس ضمن مشاريع البرنامج الحكومي'
                  }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.isGovernment ? 'مشروع حكومي' : 'مشروع غير حكومي' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>
    </div>

    <!-- Beneficiaries Section -->
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
            <template v-if="isEditing">
              <CustomMultiSelect
                v-model="formData.beneficiaryEntities"
                :options="beneficiaries"
                placeholder="اختر الجهات المستفيدة"
                :triggerClass="'flex flex-row-reverse w-full'"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formatBeneficiaries(formData.beneficiaryEntities) }}
              </div>
            </template>
          </FormField>
          <FormField label="الجهة المانحة">
            <template v-if="isEditing">
              <CustomInput
                v-model="formData.grantingEntity"
                dir="rtl"
                placeholder="ادخل اسم الجهة المانحة"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.grantingEntity || 'لم يتم تحديد الجهة المانحة' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>
    </div>

    <!-- Funding Section -->
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
            <template v-if="isEditing">
              <CustomSelect
                v-model="formData.fundingType"
                :options="currencyOptions"
                placeholder="اختر العملة"
                :triggerClass="'flex flex-row-reverse w-full'"
              />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.fundingType === 1 ? 'مشروع ممول' : 'مشروع غير ممول' }}
              </div>
            </template>
          </FormField>
          <FormField label="كلفة المشروع">
            <template v-if="isEditing">
              <NumberInput v-model="formData.cost" placeholder="165,000" unit="$" />
            </template>
            <template v-else>
              <div class="text-sm font-medium text-foreground-heading">
                {{ formData.cost ? `$${formatCost(formData.cost)}` : 'لم يتم تحديد المبلغ' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>
    </div>

    <!-- Objectives Section -->
    <div class="rounded-xl border bg-background-surface">
      <div class="flex items-center justify-between border-b p-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:target" class="text-foreground-subheading h-5 w-5" />
          <h4 class="font-medium text-foreground-heading">أهداف المشروع</h4>
        </div>
      </div>
      <div class="p-4">
        <FormField label="الهدف من المشروع">
          <template v-if="isEditing">
            <Textarea
              v-model="formData.projectObjectives"
              dir="rtl"
              placeholder="اعداد وثائق خطة التكييف المحلية LAPs..."
              class="min-h-[100px] border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100"
            />
          </template>
          <template v-else>
            <div class="text-sm font-medium text-foreground-heading">
              {{ formData.projectObjectives || 'لم يتم تحديد الهدف' }}
            </div>
          </template>
        </FormField>
      </div>
    </div>
  </div>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import FormField from '@/components/FormField.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Textarea } from '@/components/ui/textarea';
  import { beneficiaryService } from '@/services/beneficiaryService';
  import { useFundedProjectStore } from '@/stores/funded-project-store';
  import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:project']);
  const currencyOptions = [
    { value: 'USD', label: 'دولار أمريكي' },
    { value: 'IQD', label: 'دينار عراقي' },
    { value: 'EUR', label: 'يورو أوروبي' },
  ];
  const store = useFundedProjectStore();
  const beneficiaries = ref([]);
  const formData = ref({
    name: '',
    executingDepartment: '',
    implementingEntity: '',
    beneficiaryEntities: [],
    grantingEntity: '',
    fundingType: 1,
    cost: null,
    projectObjectives: '',
    projectStatus: 1,
    isGovernment: false,
  });

  // Update to handle beneficiaries properly
  const formatBeneficiaries = (entities) => {
    if (!entities || entities.length === 0) return 'لم يتم تحديد الجهات المستفيدة';

    // If entities is an array of objects with name property
    if (typeof entities[0] === 'object' && entities[0].name) {
      return entities.map((e) => e.name).join(', ');
    }

    // If entities is an array of IDs
    if (beneficiaries.value.length > 0) {
      return entities
        .map((id) => {
          const found = beneficiaries.value.find((b) => b.value === id);
          return found ? found.label : id;
        })
        .join(', ');
    }

    // Fallback
    return Array.isArray(entities) ? entities.join(', ') : entities;
  };

  // Update the watch function to directly access the isGovernment property
  watch(
    () => props.project,
    (newProject) => {
      if (newProject) {
        console.log('Full project data received:', newProject);

        // Process beneficiaryEntities to ensure it's in the right format
        let beneficiaryData = newProject.beneficiaryEntities || [];

        // Convert to array if it's not already
        if (!Array.isArray(beneficiaryData)) {
          beneficiaryData = beneficiaryData ? [beneficiaryData] : [];
        }

        // Extract IDs if entities are objects
        if (beneficiaryData.length > 0 && typeof beneficiaryData[0] === 'object') {
          beneficiaryData = beneficiaryData.map((b) => b.id || b.value);
        }

        // DEBUG: Check ALL possible property names for isGovernment
        console.log('Checking all possible property names:');
        console.log('- isGovernment:', newProject.isGovernment, typeof newProject.isGovernment);
        console.log('- is_government:', newProject.is_government, typeof newProject.is_government);
        console.log('- IsGovernment:', newProject.IsGovernment, typeof newProject.IsGovernment);

        // Try to extract the isGovernment value using all possible approaches
        let isGovernment = false;

        if (typeof newProject.isGovernment === 'boolean') {
          isGovernment = newProject.isGovernment;
        } else if (newProject.isGovernment === 'true' || newProject.isGovernment === 1) {
          isGovernment = true;
        } else if (
          newProject.is_government === true ||
          newProject.is_government === 'true' ||
          newProject.is_government === 1
        ) {
          isGovernment = true;
        } else if (
          newProject.IsGovernment === true ||
          newProject.IsGovernment === 'true' ||
          newProject.IsGovernment === 1
        ) {
          isGovernment = true;
        }

        console.log('Final isGovernment value to be used:', isGovernment);

        formData.value = {
          name: newProject.name || '',
          executingDepartment: newProject.executingDepartment || '',
          implementingEntity: newProject.implementingEntity || '',
          beneficiaryEntities: beneficiaryData,
          grantingEntity: newProject.grantingEntity || '',
          fundingType: newProject.fundingType || 1,
          cost: newProject.cost || null,
          projectObjectives: newProject.projectObjectives || '',
          projectStatus:
            newProject.projectStatus !== undefined ? Number(newProject.projectStatus) : 1,
          isGovernment: isGovernment,
        };

        console.log('FormData initialized with isGovernment:', formData.value.isGovernment);
      }
    },
    { immediate: true, deep: true }
  );

  // Watch for form changes and emit updates with debug logging
  watch(
    formData,
    (newValue) => {
      console.log('FormData changed:', JSON.stringify(newValue));
      // Make sure we're passing the values properly
      emit('update:project', {
        ...newValue,
        // Ensure beneficiaryEntities is properly formatted
        beneficiaryEntities: Array.isArray(newValue.beneficiaryEntities)
          ? newValue.beneficiaryEntities
          : newValue.beneficiaryEntities
            ? [newValue.beneficiaryEntities]
            : [],
      });
    },
    { deep: true }
  );

  onMounted(async () => {
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      // Format beneficiaries for CustomMultiSelect
      beneficiaries.value = response.data.map((b) => ({
        value: b.id,
        label: b.name,
      }));
      console.log('Loaded beneficiaries:', beneficiaries.value);

      // Reapply the project data to ensure beneficiaries are properly formatted
      if (props.project) {
        watch.value = props.project;
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  });

  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to display status text
  const getStatusText = (status) => {
    const statusMap = {
      0: 'ملغاة',
      1: 'قيد التنفيذ',
      2: 'منجزة',
      3: 'متلكئة',
    };
    return statusMap[status] || 'غير معروف';
  };

  // Add a function to handle the government status change
  const updateIsGovernment = (value) => {
    // Log the incoming value
    console.log('updateIsGovernment called with value:', value);

    // Update the form data locally
    formData.value.isGovernment = value;

    // Emit the update with the entire form data
    emit('update:project', { ...formData.value });

    // Log the emitted data
    console.log('Emitted formData with isGovernment:', formData.value.isGovernment);
  };
</script>

<style scoped>
  /* Add any additional scoped styles if needed */
</style>
