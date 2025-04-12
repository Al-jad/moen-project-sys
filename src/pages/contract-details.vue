<template>
  <DefaultLayout>
    <main class="bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-7xl space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <BackButton />
            <div class="flex items-center gap-4">
              <h1 class="text-xl text-gray-900 dark:text-gray-100">تفاصيل العقد</h1>
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ contract.name }}</p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid gap-4 md:grid-cols-4">
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-blue-500/10 p-3 dark:bg-blue-500/20">
                <Icon icon="lucide:file-text" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ contract.contractNumber }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">رقم العقد</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-green-500/10 p-3 dark:bg-green-500/20">
                <Icon icon="lucide:building" class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ contract.executingDepartment }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">الجهة المنفذة</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-purple-500/10 p-3 dark:bg-purple-500/20">
                <Icon
                  icon="lucide:list-checks"
                  class="h-6 w-6 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ executionProcedures.length }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">الاجراءات التنفيذية</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20">
                <Icon
                  icon="lucide:dollar-sign"
                  class="h-6 w-6 text-amber-600 dark:text-amber-400"
                />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(contract.cost) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">كلفة العقد</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contract Details Card -->
        <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
          <!-- Basic Info -->
          <div class="border-b p-6 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">معلومات العقد</h2>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-[auto_1fr] gap-x-12 gap-y-4 text-right">
              <div class="text-gray-500 dark:text-gray-400">اسم المشروع</div>
              <div class="mr-4">{{ contract.projectName }}</div>

              <div class="text-gray-500 dark:text-gray-400">تاريخ الاحالة</div>
              <div class="mr-4">{{ formatDate(contract.referralDate) }}</div>

              <div class="text-gray-500 dark:text-gray-400">تاريخ توقيع العقد</div>
              <div class="mr-4">{{ formatDate(contract.signingDate) }}</div>
            </div>
          </div>
        </div>

        <!-- Execution Procedures Card -->
        <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="border-b p-6 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100"
                  >الاجراءات التنفيذية</h2
                >
                <Badge variant="outline" class="px-3">
                  {{ executionProcedures.length }} اجراء
                </Badge>
              </div>
              <PrimaryButton @click="openAddModal">
                <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                اضافة اجراء جديد
              </PrimaryButton>
            </div>
          </div>

          <div class="p-6">
            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4">
              <div
                v-for="n in 3"
                :key="n"
                class="h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <!-- Empty State -->
            <div
              v-else-if="executionProcedures.length === 0"
              class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center dark:border-gray-700"
            >
              <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Icon
                  icon="lucide:clipboard-list"
                  class="h-8 w-8 text-gray-400 dark:text-gray-500"
                />
              </div>
              <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100"
                >لا توجد اجراءات</h3
              >
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400"
                >قم بإضافة اجراء جديد للبدء</p
              >
              <PrimaryButton variant="outline" size="sm" @click="openAddModal">
                <Icon icon="lucide:plus" class="ml-2 h-4 w-4" />
                اضافة اجراء
              </PrimaryButton>
            </div>

            <!-- Procedures List -->
            <div v-else class="space-y-4">
              <div
                v-for="(procedure, index) in executionProcedures"
                :key="procedure.id"
                class="relative rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <!-- Header -->
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-blue-500/10 p-2 dark:bg-blue-500/20">
                      <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{
                        index + 1
                      }}</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {{ procedure.name }}
                    </h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <PrimaryButton variant="ghost" size="sm" @click="openEditModal(procedure)">
                      <Icon icon="lucide:edit" class="h-4 w-4" />
                    </PrimaryButton>
                    <PrimaryButton variant="ghost" size="sm" @click="handleDelete(procedure.id)">
                      <Icon icon="lucide:trash" class="h-4 w-4 text-red-500" />
                    </PrimaryButton>
                  </div>
                </div>

                <!-- Content Grid -->
                <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <!-- Basic Info Section -->
                  <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <h4 class="font-medium text-gray-900 dark:text-gray-100">المعلومات الأساسية</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">التفاصيل</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100">{{
                          procedure.details || 'غير محدد'
                        }}</p>
                      </div>
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">الوزن</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100"
                          >{{ procedure.weight }}%</p
                        >
                      </div>
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">المدة</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100"
                          >{{ procedure.duration }} يوم</p
                        >
                      </div>
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">رقم العقد</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100"
                          >#{{ procedure.contractId }}</p
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Dates Section -->
                  <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <h4 class="font-medium text-gray-900 dark:text-gray-100">التواريخ</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">تاريخ البداية</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100">{{
                          formatDateArabic(procedure.startDate)
                        }}</p>
                      </div>
                      <div>
                        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">تاريخ النهاية</p>
                        <p class="text-sm text-gray-900 dark:text-gray-100">{{
                          formatDateArabic(procedure.endDate)
                        }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Completion and Financial Progress Section -->
                  <div class="col-span-2 space-y-6">
                    <!-- Regular Progress Section -->
                    <div class="grid grid-cols-2 gap-6">
                      <!-- Planned Technical Progress -->
                      <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100"
                          >نسب الإنجاز الفني المخطط له</h4
                        >
                        <div>
                          <div class="mb-2 flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400"
                              >نسبة الإنجاز الفني المخطط له</span
                            >
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {{ procedure.plannedCompletionPercentage }}%
                            </span>
                          </div>
                          <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              class="h-2 rounded-full bg-blue-500"
                              :style="{ width: `${procedure.plannedCompletionPercentage}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Planned Financial Progress -->
                      <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100"
                          >التقدم المالي المخطط له</h4
                        >
                        <div>
                          <div class="mb-2 flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400"
                              >التقدم المالي المخطط له</span
                            >
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {{ procedure.plannedFinancialProgress }}%
                            </span>
                          </div>
                          <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              class="h-2 rounded-full bg-blue-500"
                              :style="{ width: `${procedure.plannedFinancialProgress}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Premium Features Section -->
                    <div
                      class="rounded-lg border border-red-200 bg-red-50/30 p-6 dark:border-red-900/50 dark:bg-red-950/20"
                    >
                      <div class="mb-4 flex items-center gap-2">
                        <Icon icon="lucide:crown" class="h-5 w-5 text-red-500" />
                        <span class="text-sm font-medium text-red-600 dark:text-red-400"
                          >ميزات متقدمة</span
                        >
                      </div>

                      <div class="grid grid-cols-2 gap-6">
                        <!-- Actual Technical Progress -->
                        <div class="space-y-4">
                          <PremiumMask>
                            <div>
                              <h4 class="mb-4 font-medium text-gray-900 dark:text-gray-100"
                                >نسب الإنجاز الفني الفعلي</h4
                              >
                              <div class="space-y-6">
                                <div>
                                  <div class="mb-2 flex items-center justify-between">
                                    <span class="text-sm text-gray-500 dark:text-gray-400"
                                      >نسبة الإنجاز الفني الفعلي</span
                                    >
                                    <span
                                      class="text-sm font-medium text-gray-900 dark:text-gray-100"
                                    >
                                      {{ procedure.actualCompletionPercentage }}%
                                    </span>
                                  </div>
                                  <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      class="h-2 rounded-full bg-green-500"
                                      :style="{ width: `${procedure.actualCompletionPercentage}%` }"
                                    ></div>
                                  </div>
                                </div>

                                <div>
                                  <div class="mb-2 flex items-center justify-between">
                                    <span class="text-sm text-gray-500 dark:text-gray-400"
                                      >نسبة الانحراف الفني</span
                                    >
                                    <span
                                      class="text-sm font-medium"
                                      :class="{
                                        'text-red-500': procedure.technicalDeviation < 0,
                                        'text-green-500': procedure.technicalDeviation >= 0,
                                      }"
                                    >
                                      {{ procedure.technicalDeviation }}%
                                    </span>
                                  </div>
                                  <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      class="h-2 rounded-full"
                                      :class="{
                                        'bg-red-500': procedure.technicalDeviation < 0,
                                        'bg-green-500': procedure.technicalDeviation >= 0,
                                      }"
                                      :style="{
                                        width: `${Math.abs(procedure.technicalDeviation)}%`,
                                      }"
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PremiumMask>
                        </div>

                        <!-- Actual Financial Progress -->
                        <div class="space-y-4">
                          <PremiumMask>
                            <div>
                              <h4 class="mb-4 font-medium text-gray-900 dark:text-gray-100"
                                >التقدم المالي الفعلي</h4
                              >
                              <div>
                                <div class="mb-2 flex items-center justify-between">
                                  <span class="text-sm text-gray-500 dark:text-gray-400"
                                    >التقدم المالي الفعلي</span
                                  >
                                  <span
                                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                                  >
                                    {{ procedure.actualFinancialProgress }}%
                                  </span>
                                </div>
                                <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div
                                    class="h-2 rounded-full bg-green-500"
                                    :style="{ width: `${procedure.actualFinancialProgress}%` }"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </PremiumMask>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <EditProcedureModal
      v-model:isOpen="isModalOpen"
      :procedure="selectedProcedure"
      :isEdit="!!selectedProcedure"
      :contractInfo="contractInfo"
      @save="handleSave"
    />
  </DefaultLayout>
</template>

<script setup>
  import BackButton from '@/components/BackButton.vue';
  import EditProcedureModal from '@/components/EditProcedureModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Badge } from '@/components/ui/badge';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';

  import PremiumMask from '@/components/PremiumMask.vue';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  const route = useRoute();
  const router = useRouter();
  const contractId = route.params.id;
  const regionalProjectStore = useRegionalProjectStore();

  // Contract data
  const contract = ref({
    projectName: '',
    executingDepartment: '',
    cost: 0,
    referralDate: '',
    signingDate: '',
    contractNumber: '',
    name: '',
    procedures: [],
  });

  const executionProcedures = computed(() => contract.value.procedures);

  const contractInfo = computed(() => ({
    name: contract.value.name,
    project: contract.value.projectName,
  }));

  // Add loading state
  const isLoading = ref(false);

  // Update date formatting functions
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

  const formatDateArabic = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'غير محدد';
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

  // Fetch contract data
  const fetchContractDetails = async () => {
    try {
      isLoading.value = true;
      const contractData = await regionalProjectStore.fetchContractById(Number(contractId));

      if (!contractData) {
        toast.error('لم يتم العثور على العقد');
        router.push('/contracts');
        return;
      }

      const projectData = await regionalProjectStore.fetchAllProjects();
      const project = regionalProjectStore.projects.find((p) => p.id === contractData.projectId);

      contract.value = {
        projectName: project?.name || 'غير محدد',
        executingDepartment: contractData.executingDepartment,
        cost: contractData.cost,
        referralDate: contractData.referralDate,
        signingDate: contractData.signingDate,
        contractNumber: contractData.contractNumber,
        name: contractData.name,
        procedures: contractData.procedures || [],
      };
    } catch (error) {
      console.error('Error fetching contract details:', error);
      toast.error('حدث خطأ أثناء جلب بيانات العقد');
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    await fetchContractDetails();
  });

  const isModalOpen = ref(false);
  const selectedProcedure = ref(null);

  const openAddModal = () => {
    selectedProcedure.value = null;
    isModalOpen.value = true;
  };

  const openEditModal = (procedure) => {
    selectedProcedure.value = procedure;
    isModalOpen.value = true;
  };

  const handleSave = async (formData) => {
    try {
      const procedureData = {
        ...formData,
        contractId: Number(contractId),
      };

      if (selectedProcedure.value) {
        // Edit existing procedure
        await regionalProjectStore.updateProcedure(selectedProcedure.value.id, procedureData);
        toast.success('تم تحديث الاجراء بنجاح');
      } else {
        // Add new procedure
        await regionalProjectStore.createProcedure(procedureData);
        toast.success('تم اضافة الاجراء بنجاح');
      }
      // Fetch fresh contract data
      await fetchContractDetails();
      isModalOpen.value = false;
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast.error('حدث خطأ أثناء حفظ الاجراء');
    }
  };

  const handleDelete = async (procedureId) => {
    try {
      await regionalProjectStore.deleteProcedure(procedureId, Number(contractId));
      // Fetch fresh contract data
      await fetchContractDetails();
      toast.success('تم حذف الاجراء بنجاح');
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast.error('حدث خطأ أثناء حذف الاجراء');
    }
  };

  const getTitle = (index) => {
    const titles = [
      'الاجراء الاول',
      'الاجراء الثاني',
      'الاجراء الثالث',
      'الاجراء الرابع',
      'الاجراء الخامس',
    ];
    return titles[index - 1];
  };
</script>
