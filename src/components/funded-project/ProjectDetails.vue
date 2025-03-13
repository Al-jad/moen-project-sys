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
                {{ project?.beneficiaryEntities?.join(', ') || 'لم يتم تحديد الجهات المستفيدة' }}
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
  });

  // Initialize form data when project changes
  watch(
    () => props.project,
    (newProject) => {
      if (newProject) {
        formData.value = {
          name: newProject.name || '',
          executingDepartment: newProject.executingDepartment || '',
          implementingEntity: newProject.implementingEntity || '',
          beneficiaryEntities: newProject.beneficiaryEntities || [],
          grantingEntity: newProject.grantingEntity || '',
          fundingType: newProject.fundingType || 1,
          cost: newProject.cost || null,
          projectObjectives: newProject.projectObjectives || '',
        };
      }
    },
    { immediate: true }
  );

  // Watch for form changes and emit updates
  watch(
    formData,
    (newValue) => {
      emit('update:project', newValue);
    },
    { deep: true }
  );

  onMounted(async () => {
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      beneficiaries.value = response.data.map((b) => ({
        value: b.id,
        label: b.name,
      }));
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  });

  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
</script>
