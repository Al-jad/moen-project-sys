<template>
  <div class="rounded-xl border border-border bg-background-surface">
    <div class="flex items-center justify-between border-b border-border p-4">
      <div class="flex items-center gap-2">
        <Icon icon="lucide:info" class="h-5 w-5 text-foreground-muted" />
        <h4 class="font-medium text-foreground">تفاصيل المشروع</h4>
      </div>
      <PrimaryButton
        :variant="isEditing ? 'destructive' : 'ghost'"
        @click="toggleEdit"
        :icon="isEditing ? 'lucide:x' : 'lucide:edit'"
        size="sm"
      />
    </div>

    <!-- View Mode -->
    <div v-if="!isEditing" class="divide-y divide-border">
      <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div>
          <div class="text-sm text-foreground-muted">اسم المشروع</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.name || 'لم يتم تحديد اسم المشروع' }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">الخطة (المديرية)</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.directorate || 'لم يتم تحديد المديرية' }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">هدف المشروع</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.goals || 'لم يتم تحديد الأهداف' }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">العنوان</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.address || 'لم يتم تحديد العنوان' }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">الكلفة الكلية للمشروع</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ formatCurrency(project?.cost) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">الفترة الزمنية لتنفيذ المشروع</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.duration || 0 }} يوم
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">نسبة الإنجاز المالي التراكمي</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ project?.cumulativeFinancialProgress || 0 }}%
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">نسبة الإنجاز المالي التراكمي المحسوب</div>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-sm font-medium text-foreground">
              {{ project?.calculatedCumulativeFinancialProgress || 0 }}%
            </span>
            <Icon
              :icon="
                project?.calculatedCumulativeFinancialProgress ===
                project?.cumulativeFinancialProgress
                  ? 'lucide:check-circle'
                  : 'lucide:alert-circle'
              "
              :class="[
                'h-4 w-4',
                project?.calculatedCumulativeFinancialProgress ===
                project?.cumulativeFinancialProgress
                  ? 'text-green-500'
                  : 'text-amber-500',
              ]"
              :title="
                project?.calculatedCumulativeFinancialProgress ===
                project?.cumulativeFinancialProgress
                  ? 'القيمة المحسوبة تطابق القيمة المدخلة'
                  : 'القيمة المحسوبة لا تطابق القيمة المدخلة'
              "
            />
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">حالة المشروع الحالية</div>
          <div class="mt-1">
            <StatusBadge
              v-if="project?.projectStatus !== undefined"
              :status="statusConfig.key"
              :label="statusConfig.label"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div>
          <div class="text-sm text-foreground-muted">تاريخ المباشرة المخطط له</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ formatDate(project?.plannedStartDate) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">تاريخ المباشرة الفعلي</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ formatDate(project?.actualStartDate) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">تاريخ الانجاز المخطط له</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ formatDate(project?.plannedEndDate) }}
          </div>
        </div>
        <div>
          <div class="text-sm text-foreground-muted">تاريخ الانجاز الفعلي</div>
          <div class="mt-1 text-sm font-medium text-foreground">
            {{ formatDate(project?.actualEndDate) }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 p-4">
        <div class="text-sm text-foreground-muted">ربط المشروع بأهداف التنمية المستدامة</div>
        <div class="mt-1 flex flex-wrap gap-2">
          <Badge
            v-for="(item, index) in project?.sustainableDevelopment"
            :key="index"
            variant="outline"
          >
            {{ getSustainableDevelopmentLabel(item) }}
          </Badge>
        </div>
      </div>

      <div class="flex flex-col gap-2 p-4">
        <div class="text-sm text-foreground-muted">الجهات الساندة</div>
        <div class="mt-1 flex flex-wrap gap-2">
          <Badge
            v-for="(item, index) in project?.supportingEntities"
            :key="index"
            variant="outline"
          >
            {{ item }}
          </Badge>
        </div>
      </div>

      <div class="flex flex-col gap-2 p-4">
        <div class="text-sm text-foreground-muted">اسم الجهة المستفيدة</div>
        <div class="mt-1 flex flex-wrap gap-2">
          <Badge v-for="(item, index) in project?.beneficiaries" :key="index" variant="outline">
            {{ item.name }}
          </Badge>
        </div>
      </div>

      <div class="flex flex-col gap-2 p-4">
        <div class="text-sm text-foreground-muted">ملاحظات</div>
        <div class="mt-1 text-sm font-medium text-foreground">
          {{ project?.notes || 'لا توجد ملاحظات' }}
        </div>
      </div>

      <!-- New Calculated Values Section -->
      <div class="flex flex-col gap-2 p-4">
        <div class="mb-2">
          <h4 class="text-lg font-medium text-foreground">القيم المحسوبة</h4>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Financial Progress -->
          <div class="space-y-2 rounded-lg bg-background-card p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm text-foreground-muted">نسبة الإنجاز المالي التراكمي</div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-xs font-medium',
                    project?.calculatedCumulativeFinancialProgress ===
                    project?.cumulativeFinancialProgress
                      ? 'text-green-500'
                      : 'text-amber-500',
                  ]"
                >
                  {{
                    project?.calculatedCumulativeFinancialProgress ===
                    project?.cumulativeFinancialProgress
                      ? 'مطابق'
                      : 'غير مطابق'
                  }}
                </span>
                <Icon
                  :icon="
                    project?.calculatedCumulativeFinancialProgress ===
                    project?.cumulativeFinancialProgress
                      ? 'lucide:check-circle'
                      : 'lucide:alert-circle'
                  "
                  :class="[
                    'h-4 w-4',
                    project?.calculatedCumulativeFinancialProgress ===
                    project?.cumulativeFinancialProgress
                      ? 'text-green-500'
                      : 'text-amber-500',
                  ]"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-foreground-muted">المدخل</div>
                <div class="text-sm font-medium text-foreground">
                  {{ project?.cumulativeFinancialProgress || 0 }}%
                </div>
              </div>
              <div>
                <div class="text-xs text-foreground-muted">المحسوب</div>
                <div class="text-sm font-medium text-foreground">
                  {{ project?.calculatedCumulativeFinancialProgress || 0 }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Progress -->
          <div class="space-y-2 rounded-lg bg-background-card p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm text-foreground-muted">نسبة الإنجاز الفني التراكمي</div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-xs font-medium',
                    project?.calculatedCumulativeTechnicalProgress ===
                    project?.cumulativeTechnicalProgress
                      ? 'text-green-500'
                      : 'text-amber-500',
                  ]"
                >
                  {{
                    project?.calculatedCumulativeTechnicalProgress ===
                    project?.cumulativeTechnicalProgress
                      ? 'مطابق'
                      : 'غير مطابق'
                  }}
                </span>
                <Icon
                  :icon="
                    project?.calculatedCumulativeTechnicalProgress ===
                    project?.cumulativeTechnicalProgress
                      ? 'lucide:check-circle'
                      : 'lucide:alert-circle'
                  "
                  :class="[
                    'h-4 w-4',
                    project?.calculatedCumulativeTechnicalProgress ===
                    project?.cumulativeTechnicalProgress
                      ? 'text-green-500'
                      : 'text-amber-500',
                  ]"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-foreground-muted">المدخل</div>
                <div class="text-sm font-medium text-foreground">
                  {{ project?.cumulativeTechnicalProgress || 0 }}%
                </div>
              </div>
              <div>
                <div class="text-xs text-foreground-muted">المحسوب</div>
                <div class="text-sm font-medium text-foreground">
                  {{ project?.calculatedCumulativeTechnicalProgress || 0 }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="p-4">
      <form @submit.prevent class="space-y-4">
        <FormSection title="التفاصيل العامة للمشروع" class="dark:border-gray-700">
          <FormField label="اسم المشروع">
            <CustomInput v-model="form.name" dir="rtl" placeholder="ادخل اسم المشروع" />
          </FormField>

          <FormField label="الخطة (المديرية)">
            <CustomInput v-model="form.directorate" dir="rtl" placeholder="ادخل الخطة" />
          </FormField>

          <FormField label="هدف المشروع">
            <CustomTextArea v-model="form.goals" dir="rtl" placeholder="ادخل هدف المشروع" />
          </FormField>

          <FormField label="ربط المشروع بأهداف التنمية المستدامة">
            <CustomMultiSelect
              v-model="form.sustainableDevelopment"
              :options="sustainableDevelopmentGoals"
              placeholder="اختر الهدف"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
          </FormField>

          <FormField label="اسم الجهة المستفيدة">
            <CustomMultiSelect
              v-model="form.beneficiaries"
              :options="beneficiaries"
              placeholder="اختر الجهات المستفيدة"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
          </FormField>

          <FormField label="العنوان">
            <div class="flex gap-2">
              <CustomInput
                v-model="form.address"
                dir="rtl"
                placeholder="ادخل العنوان"
                class="flex-1"
              />
            </div>
          </FormField>

          <FormField label="الموقع الجغرافي">
            <div class="flex items-center gap-2">
              <CustomInput
                v-model="form.location"
                dir="rtl"
                placeholder="ادخل الموقع الجغرافي"
                class="flex-1"
              />
              <PrimaryButton
                @click="showLocationPicker = true"
                variant="primary"
                icon="lucide:map-pin"
              >
                اختر على الخريطة
              </PrimaryButton>
            </div>
          </FormField>

          <FormField label="الجهات الساندة" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentSupportingEntity"
              :items="form.supportingEntities"
              @update:items="(val) => (form.supportingEntities = val)"
              placeholder="ادخل اسم الجهة الساندة"
            />
          </FormField>

          <FormField label="الفترة الزمنية لتنفيذ المشروع">
            <div class="flex items-center gap-4">
              <NumberInput v-model="form.duration" placeholder="ادخل المدة" />
              <Label class="text-sm text-foreground-heading">يوم</Label>
            </div>
          </FormField>

          <FormField label="عدد العقود">
            <NumberInput :model-value="form.contracts.length" readonly disabled />
          </FormField>

          <FormField label="عدد الاجراءات">
            <NumberInput
              :model-value="
                form.contracts.reduce(
                  (total, contract) => total + (contract.procedures?.length || 0),
                  0
                )
              "
              readonly
              disabled
            />
          </FormField>

          <FormField label="الكلفة الكلية للمشروع">
            <NumberInput v-model="form.cost" placeholder="ادخل الكلفة" unit="د.ع" />
          </FormField>

          <FormField label="نسبة الإنجاز المالي التراكمي">
            <NumberInput
              v-model="form.cumulativeFinancialProgress"
              placeholder="ادخل نسبة الانجاز"
              unit="%"
              min="0"
              max="100"
            />
          </FormField>

          <!-- New Calculated Fields Section -->
          <FormField label="نسبة الإنجاز المالي التراكمي المحسوب">
            <NumberInput
              v-model="form.calculatedCumulativeFinancialProgress"
              placeholder="القيمة المحسوبة"
              unit="%"
              min="0"
              max="100"
            />
          </FormField>

          <div class="flex items-center gap-4 md:col-span-2">
            <Label class="text-sm font-medium text-foreground-heading">ضمن البرنامج الحكومي</Label>
            <div class="flex items-center gap-2">
              <Switch
                id="is-government-edit"
                :checked="form.isGovernment"
                @update:checked="form.isGovernment = $event"
              />
              <Label for="is-government-edit" class="mb-0 text-sm text-foreground-heading"
                >نعم</Label
              >
            </div>
          </div>
        </FormSection>

        <FormSection title="التاريخ المخطط والفعلي">
          <FormField label="تاريخ المباشرة المخطط له">
            <DateInput v-model="form.plannedStartDate" />
          </FormField>

          <FormField label="تاريخ المباشرة الفعلي">
            <DateInput v-model="form.actualStartDate" />
          </FormField>

          <FormField label="تاريخ الانجاز المخطط له">
            <DateInput v-model="form.plannedEndDate" />
          </FormField>

          <FormField label="تاريخ الانجاز الفعلي">
            <DateInput v-model="form.actualEndDate" />
          </FormField>
        </FormSection>

        <FormSection title="تفاصيل موقف تنفيذ المشروع">
          <FormField class="col-span-2" label="حالة المشروع">
            <CustomSelect
              v-model="form.projectStatus"
              :options="projectStatuses"
              placeholder="اختر حالة المشروع"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
          </FormField>

          <FormField label="نسبة الانجاز الفني التراكمي">
            <NumberInput
              v-model="form.cumulativeTechnicalProgress"
              placeholder="ادخل النسبة"
              unit="%"
              disabled
            />
          </FormField>

          <FormField label="نسبة الانحراف الفني التراكمي">
            <NumberInput
              v-model="form.cumulativeTechnicalDeviation"
              placeholder="ادخل النسبة"
              unit="%"
              disabled
            />
          </FormField>

          <FormField label="اسباب الانحراف" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentDeviationReason"
              v-model:items="form.deviationReasons"
              placeholder="ادخل سبب الانحراف"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="مدد التوقفات" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentStoppagePeriod"
              v-model:items="form.stoppagePeriods"
              placeholder="ادخل مدة التوقف"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="اوامر الغيار" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentChangeOrder"
              v-model:items="form.changeOrders"
              placeholder="ادخل امر الغيار"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="المدد الاضافية" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentAdditionalPeriod"
              v-model:items="form.additionalPeriods"
              placeholder="ادخل المدة الاضافية"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="الملاحظات" class="md:col-span-2">
            <CustomTextArea
              v-model="form.notes"
              dir="rtl"
              placeholder="ادخل الملاحظات"
              class="min-h-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </FormField>
        </FormSection>
      </form>

      <div class="mt-4 flex justify-end gap-2">
        <PrimaryButton @click="cancelEdit" variant="outline"> الغاء </PrimaryButton>
        <PrimaryButton
          variant="primary"
          @click="saveChanges"
          :disabled="isSaving"
          :icon="isSaving ? 'lucide:loader-2' : 'lucide:save'"
        >
          حفظ التغييرات
        </PrimaryButton>
      </div>
    </div>
  </div>

  <LocationPicker
    v-model:show="showLocationPicker"
    :initial-location="
      form.coordinates ? { lat: form.coordinates.lat, lng: form.coordinates.lng } : undefined
    "
    @location-selected="handleLocationSelected"
  />
</template>

<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import Switch from '@/components/CustomSwitch.vue';
  import CustomTextArea from '@/components/CustomTextArea.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import InputWithAddButton from '@/components/InputWithAddButton.vue';
  import LocationPicker from '@/components/LocationPicker.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import StatusBadge from '@/components/StatusBadge.vue';
  import Badge from '@/components/ui/badge/Badge.vue';
  import { Label } from '@/components/ui/label';
  import axiosInstance from '@/plugins/axios';
  import { getProjectStatusConfig } from '@/utils/statusBadge';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';

  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:project', 'save', 'cancel']);

  const isEditing = ref(false);
  const isSaving = ref(false);
  const showLocationPicker = ref(false);
  const currentSupportingEntity = ref('');
  const currentDeviationReason = ref('');
  const currentStoppagePeriod = ref('');
  const currentChangeOrder = ref('');
  const currentAdditionalPeriod = ref('');
  const beneficiaries = ref([]);
  const contracts = ref([]);
  const isLoadingContracts = ref(false);

  const sustainableDevelopmentGoals = [
    { value: '1', label: 'القضاء على الفقر' },
    { value: '2', label: 'القضاء التام على الجوع' },
    { value: '3', label: 'الصحة الجيدة والرفاه' },
    { value: '4', label: 'التعليم الجيد' },
    { value: '5', label: 'المساواة بين الجنسين' },
    { value: '6', label: 'المياه النظيفة والنظافة الصحية' },
    { value: '7', label: 'طاقة نظيفة وبأسعار معقولة' },
    { value: '8', label: 'العمل اللائق ونمو الاقتصاد' },
    { value: '9', label: 'الصناعة والابتكار والهياكل الأساسية' },
    { value: '10', label: 'الحد من أوجه عدم المساواة' },
    { value: '11', label: 'مدن ومجتمعات محلية مستدامة' },
    { value: '12', label: 'الاستهلاك والإنتاج المسؤولان' },
    { value: '13', label: 'العمل المناخي' },
    { value: '14', label: 'الحياة تحت الماء' },
    { value: '15', label: 'الحياة في البر' },
    { value: '16', label: 'السلام والعدل والمؤسسات القوية' },
    { value: '17', label: 'عقد الشراكات لتحقيق الأهداف' },
  ];

  const projectStatuses = [
    { value: 1, label: 'قيد التنفيذ' },
    { value: 2, label: 'منجزة' },
    { value: 3, label: 'متلكئة' },
    { value: 0, label: 'ملغاة' },
    { value: 4, label: 'مقترح' },
  ];

  const getSustainableDevelopmentLabel = (value) => {
    const goal = sustainableDevelopmentGoals.find((g) => g.value === value);
    return goal ? goal.label : value;
  };

  const getBeneficiaryLabel = (value) => {
    const beneficiary = beneficiaries.value.find((b) => b.value === parseInt(value));
    return beneficiary ? beneficiary.label : value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '0';
    const formattedNumber = new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value);
    return `${formattedNumber} د.ع`;
  };

  const form = reactive({
    name: '',
    directorate: '',
    goals: '',
    projectType: null,
    sustainableDevelopment: [],
    supportingEntities: [],
    address: '',
    location: '',
    coordinates: { lat: null, lng: null },
    duration: 0,
    plannedStartDate: null,
    actualStartDate: null,
    plannedEndDate: null,
    actualEndDate: null,
    cumulativeExpenditure: '',
    cumulativeFinancialProgress: 0,
    calculatedCumulativeFinancialProgress: 0,
    projectStatus: projectStatuses.find((s) => s.value === 1),
    notes: '',
    lng: null,
    lat: null,
    cost: null,
    isGovernment: false,
    contracts: [],
    beneficiaries: [],
    id: null,
    createdAt: null,
    updatedAt: null,
    deviationReasons: [],
    stoppagePeriods: [],
    changeOrders: [],
    additionalPeriods: [],
  });

  const fetchBeneficiaries = async () => {
    try {
      const response = await axiosInstance.get('/api/Beneficiary');
      beneficiaries.value = response.data.map((b) => ({
        value: b.id,
        label: b.name,
      }));
      toast.success('تم تحميل الجهات المستفيدة بنجاح');
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      toast.error('فشل في تحميل الجهات المستفيدة');
    }
  };

  const fetchContracts = async () => {
    if (!props.project?.id) return;

    try {
      isLoadingContracts.value = true;
      const response = await axiosInstance.get(
        `/api/RegionalProject/Contract/Project/${props.project.id}`
      );
      contracts.value = response.data;
      form.contracts = response.data;
      toast.success(`تم تحميل ${response.data.length} عقد بنجاح`);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('فشل في تحميل العقود');
    } finally {
      isLoadingContracts.value = false;
    }
  };

  onMounted(() => {
    fetchBeneficiaries();
    if (props.project?.id) {
      fetchContracts();
    }
  });

  watch(
    () => props.project?.id,
    (newId) => {
      if (newId) {
        fetchContracts();
      }
    }
  );

  watch(
    () => props.project,
    (newProject) => {
      if (newProject) {
        Object.assign(form, {
          name: newProject.name || '',
          directorate: newProject.directorate || '',
          goals: newProject.goals || '',
          projectType: newProject.projectType,
          sustainableDevelopment: (newProject.sustainableDevelopment || []).map((goal) => {
            const foundGoal = sustainableDevelopmentGoals.find((g) => g.label === goal);
            return foundGoal ? foundGoal.value : goal;
          }),
          supportingEntities: newProject.supportingEntities || [],
          address: newProject.address || '',
          location: newProject.location || '',
          coordinates: {
            lat: newProject.lat,
            lng: newProject.lng,
          },
          duration: newProject.duration || 0,
          plannedStartDate: newProject.plannedStartDate || null,
          actualStartDate: newProject.actualStartDate || null,
          plannedEndDate: newProject.plannedEndDate || null,
          actualEndDate: newProject.actualEndDate || null,
          cumulativeExpenditure: newProject.cumulativeExpenditure || '',
          cumulativeFinancialProgress: newProject.cumulativeFinancialProgress || 0,
          calculatedCumulativeFinancialProgress:
            newProject.calculatedCumulativeFinancialProgress || 0,
          projectStatus:
            typeof newProject.projectStatus === 'number'
              ? {
                  value: newProject.projectStatus,
                  label: getProjectStatusConfig(newProject.projectStatus).label,
                }
              : projectStatuses.find((s) => s.value === 1),
          notes: newProject.notes || '',
          lng: newProject.lng,
          lat: newProject.lat,
          cost: newProject.cost,
          isGovernment: newProject.isGovernment || false,
          contracts: contracts.value,
          beneficiaries: newProject.beneficiaries?.map((b) => b.id) || [],
          id: newProject.id,
          createdAt: newProject.createdAt,
          updatedAt: newProject.updatedAt,
          deviationReasons: newProject.deviationReasons || [],
          stoppagePeriods: newProject.stoppagePeriods || [],
          changeOrders: newProject.changeOrders || [],
          additionalPeriods: newProject.additionalPeriods || [],
        });
      }
    },
    { immediate: true, deep: true }
  );

  const toggleEdit = () => {
    if (isEditing.value) {
      cancelEdit();
    } else {
      isEditing.value = true;
      toast.info('تم تفعيل وضع التحرير');
    }
  };

  const cancelEdit = () => {
    isEditing.value = false;
    Object.assign(form, props.project);
    emit('cancel');
    toast.info('تم إلغاء التعديلات');
  };

  const formatDateToISO = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString();
  };

  const saveChanges = async () => {
    if (!form.name) {
      toast.error('يجب إدخال اسم المشروع');
      return;
    }

    if (!form.directorate) {
      toast.error('يجب إدخال اسم المديرية');
      return;
    }

    if (!form.goals) {
      toast.error('يجب إدخال هدف المشروع');
      return;
    }

    try {
      isSaving.value = true;
      const projectData = {
        name: form.name,
        directorate: form.directorate,
        goals: form.goals,
        sustainableDevelopment: form.sustainableDevelopment.map((value) => {
          const goal = sustainableDevelopmentGoals.find((g) => g.value === value);
          return goal ? goal.label : value;
        }),
        beneficiaryEntities: form.beneficiaries,
        supportingEntities: form.supportingEntities || [],
        address: form.address,
        duration: parseInt(form.duration) || 0,
        plannedStartDate: formatDateToISO(form.plannedStartDate),
        actualStartDate: formatDateToISO(form.actualStartDate),
        plannedEndDate: formatDateToISO(form.plannedEndDate),
        actualEndDate: formatDateToISO(form.actualEndDate),
        cumulativeExpenditure: form.cumulativeExpenditure?.toString() || '0',
        cumulativeFinancialProgress: parseFloat(form.cumulativeFinancialProgress) || 0,
        calculatedCumulativeFinancialProgress:
          parseFloat(form.calculatedCumulativeFinancialProgress) || 0,
        projectStatus:
          form.projectStatus?.value !== undefined
            ? form.projectStatus.value
            : typeof form.projectStatus === 'number'
              ? form.projectStatus
              : 1,
        notes: form.notes || '',
        lng: form.coordinates?.lng || 0,
        lat: form.coordinates?.lat || 0,
        cost: parseFloat(form.cost) || 0,
        isGovernment: Boolean(form.isGovernment),
      };

      emit('save', projectData);
      isEditing.value = false;
      toast.success('تم حفظ المشروع بنجاح! 🎉');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('حدث خطأ أثناء حفظ المشروع');
    } finally {
      isSaving.value = false;
    }
  };

  const handleLocationSelected = (location) => {
    form.coordinates.lat = location.lat;
    form.coordinates.lng = location.lng;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.display_name) {
          form.location = data.display_name;
          toast.success('تم تحديد العنوان بنجاح');
        }
      })
      .catch(() => {
        toast.error('تعذر تحديد العنوان');
      });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 0;
    return parseFloat(Number(value).toFixed(2));
  };

  const valueComparisons = computed(() => {
    const tolerance = 0.01; // 0.01% tolerance for floating point comparison

    const compareValues = (val1, val2) => {
      const num1 = formatNumber(val1);
      const num2 = formatNumber(val2);
      return Math.abs(num1 - num2) <= tolerance;
    };

    return {
      financialProgress: {
        calculated: formatNumber(props.project?.calculatedCumulativeFinancialProgress),
        actual: formatNumber(props.project?.cumulativeFinancialProgress),
        matches: compareValues(
          props.project?.calculatedCumulativeFinancialProgress,
          props.project?.cumulativeFinancialProgress
        ),
      },
      technicalProgress: {
        calculated: formatNumber(props.project?.calculatedCumulativeTechnicalProgress),
        actual: formatNumber(props.project?.cumulativeTechnicalProgress),
        matches: compareValues(
          props.project?.calculatedCumulativeTechnicalProgress,
          props.project?.cumulativeTechnicalProgress
        ),
      },
    };
  });

  const statusConfig = computed(() => getProjectStatusConfig(props.project?.projectStatus));
</script>
