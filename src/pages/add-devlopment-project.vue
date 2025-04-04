<template>
  <DefaultLayout>
    <div class="flex min-h-screen flex-col gap-4 bg-gray-200 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl">
        <h1 class="py-4 pb-6 text-right text-2xl font-bold text-gray-900 dark:text-gray-100"
          >اضافة مشروع - تنمية الأقاليم
        </h1>

        <FormSection title="التفاصيل العامة للمشروع" class="dark:border-gray-700">
          <FormField label="اسم المشروع">
            <CustomInput v-model="form.projectName" dir="rtl" placeholder="ادخل اسم المشروع" />
          </FormField>

          <FormField label="الخطة (المديرية)">
            <CustomInput v-model="form.plan" dir="rtl" placeholder="ادخل الخطة" />
          </FormField>

          <FormField label="هدف المشروع">
            <CustomInput v-model="form.projectGoal" dir="rtl" placeholder="ادخل هدف المشروع" />
          </FormField>

          <FormField label="ربط المشروع بأهداف التنمية المستدامة">
            <CustomMultiSelect
              v-model="form.sustainableDevelopmentGoal"
              :options="sustainableDevelopmentGoals"
              placeholder="اختر الهدف"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
          </FormField>

          <FormField label="اسم الجهة المستفيدة">
            <CustomMultiSelect
              v-model="form.beneficiaryEntities"
              :options="beneficiaries"
              placeholder="اختر الجهات المستفيدة"
              :triggerClass="'flex  flex-row-reverse w-full'"
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
            <div class="flex gap-2">
              <CustomInput
                v-model="form.location"
                dir="rtl"
                placeholder="ادخل الموقع الجغرافي"
                class="flex-1"
              />
              <Button
                @click="showLocationPicker = true"
                variant="outline"
                class="flex items-center gap-2 dark:border-gray-700 dark:text-gray-100"
              >
                <Icon icon="lucide:map-pin" class="h-4 w-4" />
                اختر على الخريطة
              </Button>
            </div>
          </FormField>

          <FormField label="الجهات الساندة" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentSupportingEntity"
              v-model:items="form.supportingEntities"
              placeholder="ادخل اسم الجهة الساندة"
            />
          </FormField>

          <FormField label="الفترة الزمنية لتنفيذ المشروع">
            <div class="flex items-center gap-4">
              <NumberInput v-model="form.duration" placeholder="ادخل المدة" />
              <Label class="text-sm dark:text-gray-300">يوم</Label>
            </div>
          </FormField>
          <FormField label="عدد العقود">
            <NumberInput :model-value="form.contracts.length" readonly disabled />
          </FormField>
        </FormSection>
        <FormSection title="التاريخ المخطط والفعلي">
          <FormField label="تاريخ المباشرة المخطط له">
            <DateInput v-model="form.plannedStartDate" />
          </FormField>

          <FormField label="تاريخ المباشرة الفعلي">
            <DateInput v-model="form.actualStartDate" />
          </FormField>

          <FormField label="تاريخ الانجاز المخطط له">
            <DateInput v-model="form.plannedCompletionDate" />
          </FormField>

          <FormField label="تاريخ الانجاز الفعلي">
            <DateInput v-model="form.actualCompletionDate" />
          </FormField>
        </FormSection>
        <FormSection title="تفاصيل العقد">
          <div class="space-y-6 md:col-span-2">
            <div
              v-for="(contract, contractIndex) in form.contracts"
              :key="contractIndex"
              class="rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-medium dark:text-gray-100">
                  {{ contract.title ? contract.title : `عقد رقم ${contractIndex + 1}` }}
                </h3>
                <Button variant="destructive" size="sm" @click="removeContract(contractIndex)">
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </Button>
              </div>

              <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <FormField label="عنوان العقد">
                  <CustomInput v-model="contract.title" dir="rtl" placeholder="ادخل عنوان العقد" />
                </FormField>

                <FormField label="اسم الجهة المنفذة \ الشركة">
                  <CustomInput
                    v-model="contract.executingCompany"
                    dir="rtl"
                    placeholder="ادخل اسم الشركة"
                  />
                </FormField>

                <FormField label="كلفة العقد">
                  <NumberInput v-model="contract.cost" placeholder="ادخل كلفة العقد" unit="د.ع" />
                </FormField>

                <FormField label="تاريخ الاحالة">
                  <DateInput v-model="contract.referralDate" />
                </FormField>

                <FormField label="تاريخ توقيع العقد">
                  <DateInput v-model="contract.signingDate" />
                </FormField>

                <FormField label="رقم العقد">
                  <CustomInput
                    :value="contract.number"
                    @input="updateContractNumber(contractIndex, $event)"
                    dir="rtl"
                    placeholder="ادخل رقم العقد"
                  />
                </FormField>

                <FormField label="عدد الاجراءات التنفيذية">
                  <NumberInput v-model="contract.executionProcedures.length" readonly disabled />
                </FormField>
              </div>

              <div class="mt-6">
                <div class="mb-4 flex items-center justify-between">
                  <h4 class="font-medium dark:text-gray-100">الاجراءات التنفيذية</h4>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(procedure, procedureIndex) in contract.executionProcedures"
                    :key="procedureIndex"
                    class="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div class="mb-4 flex items-center justify-between">
                      <h5 class="font-medium">الاجراء التنفيذي رقم {{ procedureIndex + 1 }}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        @click="removeExecutionProcedure(contractIndex, procedureIndex)"
                      >
                        حذف الاجراء
                      </Button>
                    </div>

                    <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      <FormField label="عنوان الاجراء">
                        <CustomInput
                          v-model="procedure.title"
                          dir="rtl"
                          placeholder="ادخل عنوان الاجراء"
                        />
                      </FormField>

                      <FormField label="وزن الاجراء">
                        <NumberInput
                          v-model="procedure.weight"
                          placeholder="ادخل وزن الاجراء"
                          unit="%"
                        />
                      </FormField>

                      <FormField label="مدة الاجراء">
                        <NumberInput
                          v-model="procedure.duration"
                          placeholder="ادخل مدة الاجراء"
                          unit="يوم"
                        />
                      </FormField>

                      <FormField label="تاريخ تنفيذ الاجراء">
                        <DateInput v-model="procedure.executionDate" />
                      </FormField>

                      <FormField label="تاريخ انجاز تنفيذ الاجراء">
                        <DateInput v-model="procedure.completionDate" />
                      </FormField>

                      <FormField label="نسبة الانجاز الفني المخطط">
                        <NumberInput
                          v-model="procedure.plannedTechnicalProgress"
                          placeholder="ادخل النسبة"
                          unit="%"
                        />
                      </FormField>

                      <FormField label="نسبة الانجاز المالي المخطط">
                        <NumberInput
                          v-model="procedure.plannedFinancialProgress"
                          placeholder="ادخل النسبة"
                          unit="%"
                        />
                      </FormField>

                      <FormField class="col-span-2" label="نسبة الانجاز المالي الفعلي">
                        <NumberInput
                          v-model="procedure.actualFinancialProgress"
                          placeholder="ادخل النسبة"
                          unit="%"
                        />
                      </FormField>
                      <FormField label="نسبة الانجاز الفني الفعلي">
                        <PremiumMask>
                          <NumberInput
                            v-model="procedure.actualTechnicalProgress"
                            placeholder="ادخل النسبة"
                            unit="%"
                            disabled
                          />
                        </PremiumMask>
                      </FormField>

                      <FormField label="نسبة الانحراف الفني">
                        <PremiumMask>
                          <NumberInput
                            v-model="procedure.technicalDeviation"
                            placeholder="ادخل النسبة"
                            unit="%"
                            disabled
                          />
                        </PremiumMask>
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex w-full items-center justify-center">
                <PrimaryButton
                  variant="secondary"
                  @click="addExecutionProcedure(contractIndex)"
                  class="w-1/2 dark:bg-slate-600 dark:text-white"
                >
                  اضافة اجراء تنفيذي
                </PrimaryButton>
              </div>
            </div>
            <PrimaryButton @click="addContract" variant="primary" class="w-full"
              >اضافة عقد جديد</PrimaryButton
            >
          </div>
        </FormSection>
        <FormSection title="تفاصيل الموقف المالي">
          <FormField
            :label="
              'كلفة الاجراءات التنفيذية المخطط لها لغاية تاريخ اليوم (' +
              new Date().toLocaleDateString('ar-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }) +
              ')'
            "
          >
            <NumberInput
              v-model="form.financials.plannedCost"
              placeholder="ادخل الكلفة"
              unit="د.ع"
            />
          </FormField>

          <FormField label="ميزانية المشروع (الكلفة الكلية للمشروع)">
            <NumberInput
              v-model="form.financials.totalBudget"
              placeholder="ادخل الميزانية"
              unit="د.ع"
            />
          </FormField>

          <FormField
            :label="
              'قيمة العمل المنجز الفعلي للجراءات التنفيذية لغاية تاريخ اليوم (' +
              new Date().toLocaleDateString('ar-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }) +
              ')'
            "
          >
            <NumberInput
              v-model="form.financials.actualWorkValue"
              placeholder="ادخل قيمة العمل المنجز"
              unit="د.ع"
            />
          </FormField>

          <FormField label="المصروف التراكمي للمشروع">
            <NumberInput
              v-model="form.financials.cumulativeExpenses"
              placeholder="ادخل المصروف التراكمي"
              unit="د.ع"
            />
          </FormField>

          <FormField label="نسبة الانجاز المالي التراكمي">
            <NumberInput
              v-model="form.financials.cumulativeProgress"
              placeholder="ادخل نسبة الانجاز"
              unit="%"
              disabled
            />
          </FormField>
        </FormSection>
        <FormSection title="تفاصيل موقف تنفيذ المشروع">
          <FormField class="col-span-2" label="حالة المشروع الحالية">
            <CustomSelect
              v-model="form.executionDetails.currentStatus"
              :options="projectStatuses"
              placeholder="اختر حالة المشروع"
              :triggerClass="'flex flex-row-reverse w-full'"
            />
          </FormField>

          <FormField label="نسبة الانجاز الفني التراكمي">
            <PremiumMask>
              <NumberInput
                v-model="form.executionDetails.cumulativeTechnicalProgress"
                placeholder="ادخل النسبة"
                unit="%"
                disabled
              />
            </PremiumMask>
          </FormField>

          <FormField label="نسبة الانحراف الفني التراكمي">
            <PremiumMask>
              <NumberInput
                v-model="form.executionDetails.cumulativeTechnicalDeviation"
                placeholder="ادخل النسبة"
                unit="%"
                disabled
              />
            </PremiumMask>
          </FormField>

          <FormField label="اسباب الانحراف" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentDeviationReason"
              v-model:items="form.executionDetails.deviationReasons"
              placeholder="ادخل سبب الانحراف"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="مدد التوقفات" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentStoppagePeriod"
              v-model:items="form.executionDetails.stoppagePeriods"
              placeholder="ادخل مدة التوقف"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="اوامر الغيار" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentChangeOrder"
              v-model:items="form.executionDetails.changeOrders"
              placeholder="ادخل امر الغيار"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="المدد الاضافية" class="md:col-span-2">
            <InputWithAddButton
              v-model="currentAdditionalPeriod"
              v-model:items="form.executionDetails.additionalPeriods"
              placeholder="ادخل المدة الاضافية"
              buttonText="اضافة"
            />
          </FormField>

          <FormField label="الملاحظات" class="md:col-span-2">
            <Textarea
              v-model="form.executionDetails.notes"
              dir="rtl"
              placeholder="ادخل الملاحظات"
              class="min-h-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </FormField>
        </FormSection>
        <div class="sticky bottom-6 left-0 right-0 mt-6">
          <div class="mx-auto max-w-6xl px-6">
            <Button
              @click="saveProject"
              class="h-12 w-full bg-slate-700 text-lg hover:bg-slate-800 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700"
              :disabled="isSaving"
            >
              <Icon v-if="isSaving" icon="lucide:loader-2" class="ml-2 h-4 w-4 animate-spin" />
              <Icon v-else icon="lucide:plus" class="ml-2 h-4 w-4" />
              {{ isSaving ? 'جاري الحفظ...' : 'اضافة المشروع' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    <LocationPicker
      v-model:show="showLocationPicker"
      :initial-location="form.coordinates.lat ? form.coordinates : undefined"
      @location-selected="handleLocationSelected"
    />
    <PremiumModal v-model:open="isPremiumModalOpen" />
  </DefaultLayout>
</template>
<script setup>
  import CustomInput from '@/components/CustomInput.vue';
  import CustomMultiSelect from '@/components/CustomMultiSelect.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DateInput from '@/components/DateInput.vue';
  import FormField from '@/components/FormField.vue';
  import FormSection from '@/components/FormSection.vue';
  import InputWithAddButton from '@/components/InputWithAddButton.vue';
  import LocationPicker from '@/components/LocationPicker.vue';
  import NumberInput from '@/components/NumberInput.vue';
  import PremiumMask from '@/components/PremiumMask.vue';
  import PremiumModal from '@/components/PremiumModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';

  import { toast } from 'vue-sonner';

  const contractCounter = ref(1);

  const form = ref({
    projectName: '',
    plan: '',
    projectGoal: '',
    sustainableDevelopmentGoal: [],
    beneficiaryEntities: [],
    supportingEntities: [],
    address: '',
    location: '',
    coordinates: { lat: null, lng: null },
    duration: '',
    durationType: 'days',
    plannedStartDate: null,
    actualStartDate: null,
    plannedCompletionDate: null,
    actualCompletionDate: null,
    contracts: [
      {
        title: '',
        executingCompany: '',
        cost: '',
        referralDate: null,
        signingDate: null,
        number: '1',
        executionProcedures: [],
      },
    ],
    financials: {
      plannedCost: '',
      totalBudget: '',
      actualWorkValue: '',
      cumulativeExpenses: '',
      cumulativeProgress: '',
    },
    executionDetails: {
      currentStatus: '',
      cumulativeTechnicalProgress: '',
      cumulativeTechnicalDeviation: '',
      deviationReasons: [],
      stoppagePeriods: [],
      changeOrders: [],
      additionalPeriods: [],
      notes: '',
    },
  });

  const addContract = () => {
    form.value.contracts.push({
      title: '',
      executingCompany: '',
      cost: '',
      referralDate: null,
      signingDate: null,
      number: contractCounter.value.toString(),
      executionProcedures: [],
    });
    contractCounter.value++;
  };

  const removeContract = (contractIndex) => {
    form.value.contracts.splice(contractIndex, 1);
    if (form.value.contracts.length === 0) {
      contractCounter.value = 1;
      addContract();
    }
  };

  const updateContractNumber = (contractIndex, newNumber) => {
    if (form.value.contracts[contractIndex]) {
      form.value.contracts[contractIndex].number = newNumber;
    }
  };

  const currentDeviationReason = ref('');
  const currentStoppagePeriod = ref('');
  const currentChangeOrder = ref('');
  const currentAdditionalPeriod = ref('');
  const currentSupportingEntity = ref('');
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
  const beneficiaries = [
    { value: 'baghdad', label: 'مديرية تربية بغداد' },
    { value: 'environment', label: 'دائرة حماية تحسين بيئة' },
    { value: 'najaf', label: 'مديرية تربية النجف' },
    { value: 'basra', label: 'مديرية تربية البصرة' },
  ];
  const projectStatuses = [
    { value: 1, label: 'قيد التنفيذ' },
    { value: 2, label: 'منجزة' },
    { value: 3, label: 'متلكئة' },
    { value: 0, label: 'ملغاة' },
  ];
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };
  const addExecutionProcedure = (contractIndex) => {
    form.value.contracts[contractIndex].executionProcedures.push({
      title: '',
      weight: '',
      duration: '',
      executionDate: null,
      completionDate: null,
      plannedTechnicalProgress: '',
      actualTechnicalProgress: '',
      technicalDeviation: '',
      plannedFinancialProgress: '',
      actualFinancialProgress: '',
    });
  };
  const removeExecutionProcedure = (contractIndex, procedureIndex) => {
    form.value.contracts[contractIndex].executionProcedures.splice(procedureIndex, 1);
  };
  const addDeviationReason = () => {
    if (currentDeviationReason.value.trim()) {
      form.value.executionDetails.deviationReasons.push(currentDeviationReason.value.trim());
      currentDeviationReason.value = '';
    }
  };
  const removeDeviationReason = (index) => {
    form.value.executionDetails.deviationReasons.splice(index, 1);
  };
  const addStoppagePeriod = () => {
    if (currentStoppagePeriod.value.trim()) {
      form.value.executionDetails.stoppagePeriods.push(currentStoppagePeriod.value.trim());
      currentStoppagePeriod.value = '';
    }
  };
  const removeStoppagePeriod = (index) => {
    form.value.executionDetails.stoppagePeriods.splice(index, 1);
  };
  const addChangeOrder = () => {
    if (currentChangeOrder.value.trim()) {
      form.value.executionDetails.changeOrders.push(currentChangeOrder.value.trim());
      currentChangeOrder.value = '';
    }
  };
  const removeChangeOrder = (index) => {
    form.value.executionDetails.changeOrders.splice(index, 1);
  };
  const addAdditionalPeriod = () => {
    if (currentAdditionalPeriod.value.trim()) {
      form.value.executionDetails.additionalPeriods.push(currentAdditionalPeriod.value.trim());
      currentAdditionalPeriod.value = '';
    }
  };
  const removeAdditionalPeriod = (index) => {
    form.value.executionDetails.additionalPeriods.splice(index, 1);
  };
  const isSaving = ref(false);
  const saveProject = async () => {
    try {
      isSaving.value = true;
      if (!form.value.projectName) {
        toast.error('يرجى ادخال اسم المشروع', {
          description: 'الرجاء ملء جميع الحقول المطلوبة',
        });
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('تم حفظ المشروع بنجاح', {
        description: 'تم حفظ جميع بيانات المشروع',
      });
    } catch (error) {
      toast.error('حدث خطأ اثناء الحفظ', {
        description: 'لم يتم حفظ المشروع، يرجى المحاولة مرة أخرى',
      });
    } finally {
      isSaving.value = false;
    }
  };

  // Add new refs for location picker
  const showLocationPicker = ref(false);

  // Add location selection handler
  const handleLocationSelected = (location) => {
    form.value.coordinates = location;
    // Reverse geocode to get address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.display_name) {
          form.value.location = data.display_name;
        }
      })
      .catch(() => {
        toast.error('حدث خطأ في تحديد العنوان');
      });
  };

  // Add this to the script section
  const isPremiumModalOpen = ref(false);
  const showPremiumModal = () => {
    isPremiumModalOpen.value = true;
  };
</script>
