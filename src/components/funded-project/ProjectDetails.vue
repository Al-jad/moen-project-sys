<template>
  <FormSection title="التفاصيل العامة للمشروع" full-width>
    <div class="space-y-8">
      <!-- Basic Info Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">معلومات المشروع الأساسية</h3>
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ project?.name || 'لم يتم تحديد اسم المشروع' }}
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ project?.executingDepartment || 'لم يتم تحديد الدائرة' }}
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ project?.implementingEntity || 'لم يتم تحديد الجهة' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>

      <!-- Project Status and Type Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">حالة ونوع المشروع</h3>
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ getStatusText(project?.projectStatus) }}
              </div>
            </template>
          </FormField>
          
          <!-- Government Project Toggle -->
          <FormField label="نوع المشروع">
            <div class="flex items-center gap-3">
              <CustomSwitch
                v-model="formData.isGovernment"
                label="مشروع حكومي"
                @update:model-value="updateIsGovernment"
              />
              <div class="text-xs" :class="formData.isGovernment ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                {{ formData.isGovernment ? 'تم تعيين المشروع كاحد مشاريع البرنامج الحكومي' : 'مشروع غير حكومي' }}
              </div>
            </div>
          </FormField>
        </div>
      </div>

      <!-- Beneficiaries Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">الجهات المستفيدة والمانحة</h3>
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ formatBeneficiaries(project?.beneficiaryEntities) }}
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
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ project?.grantingEntity || 'لم يتم تحديد الجهة المانحة' }}
              </div>
            </template>
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
            <template v-if="isEditing">
              <NumberInput v-model="formData.cost" placeholder="165,000" unit="$" />
            </template>
            <template v-else>
              <div
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {{ project?.cost ? `$${formatCost(project.cost)}` : 'لم يتم تحديد المبلغ' }}
              </div>
            </template>
          </FormField>
        </div>
      </div>

      <!-- Objectives Section -->
      <div class="rounded-xl border bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 class="mb-6 text-lg font-medium">أهداف المشروع</h3>
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
            <div
              class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
            >
              {{ project?.projectObjectives || 'لم يتم تحديد الهدف' }}
            </div>
          </template>
        </FormField>
      </div>
    </div>
  </FormSection>
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import { Textarea } from '@/components/ui/textarea';
  import { beneficiaryService } from '@/services/beneficiaryService';
  import { useFundedProjectStore } from '@/stores/fundedProject';
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
      return entities.map(e => e.name).join(', ');
    }
    
    // If entities is an array of IDs
    if (beneficiaries.value.length > 0) {
      return entities
        .map(id => {
          const found = beneficiaries.value.find(b => b.value === id);
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
          beneficiaryData = beneficiaryData.map(b => b.id || b.value);
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
        } else if (newProject.is_government === true || newProject.is_government === 'true' || newProject.is_government === 1) {
          isGovernment = true;
        } else if (newProject.IsGovernment === true || newProject.IsGovernment === 'true' || newProject.IsGovernment === 1) {
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
          projectStatus: newProject.projectStatus !== undefined ? Number(newProject.projectStatus) : 1,
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
          : (newValue.beneficiaryEntities ? [newValue.beneficiaryEntities] : [])
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
    emit('update:project', {...formData.value});
    
    // Log the emitted data
    console.log('Emitted formData with isGovernment:', formData.value.isGovernment);
  };
</script>
