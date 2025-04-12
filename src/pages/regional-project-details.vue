<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div class="mx-auto w-full max-w-6xl space-y-8">
        <div v-if="loading" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div class="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div
          v-else-if="error"
          class="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-800 dark:bg-gray-800"
        >
          <div class="mb-3 inline-block rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <Icon icon="lucide:alert-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            حدث خطأ في تحميل المشروع
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ error }}
          </p>
          <Button @click="fetchProject" variant="outline" class="mt-4">
            <Icon icon="lucide:refresh-cw" class="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
        <template v-else-if="project">
          <div class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <div
                    class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
                  >
                    {{ project?.id }}
                  </div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ project?.name }}
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ project?.directorate }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <Badge :variant="getStatusVariant(project?.projectStatus)">
                  {{ getStatusLabel(project?.projectStatus) }}
                </Badge>
                <PrimaryButton icon="material-symbols-light:print-outline"> طباعة </PrimaryButton>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">المدة الكلية</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ project?.duration || 0 }} يوم
                </div>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500/10 dark:bg-blue-400/10"></div>
            </div>
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">عدد العقود</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ project?.contracts?.length || 0 }}
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-1 bg-green-500/10 dark:bg-green-400/10"
              ></div>
            </div>
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">نسبة الإنجاز المالي</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ project?.cumulativeFinancialProgress || 0 }}%
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-1 bg-purple-500/10 dark:bg-purple-400/10"
              ></div>
            </div>
            <div
              class="relative overflow-hidden rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="relative z-10">
                <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">الكلفة</div>
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(project?.cost) }}
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 h-1 bg-orange-500/10 dark:bg-orange-400/10"
              ></div>
            </div>
          </div>
          <RegionalProjectDetails
            :project="project"
            @save="handleSaveProject"
            @cancel="handleCancelEdit"
          />
          <div class="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:file-text" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h4 class="font-medium text-gray-900 dark:text-gray-100">العقود</h4>
              </div>
              <Button @click="handleAdd" variant="ghost" size="sm">
                <Icon icon="lucide:plus" class="h-4 w-4" />
              </Button>
            </div>
            <div class="p-4">
              <div v-if="contracts.length > 0">
                <CustomTable
                  ref="tableRef"
                  :columns="contractColumns"
                  :data="contractsWithProjects"
                  @export="exportToExcel"
                  :loading="loading"
                  :showDateFilter="false"
                  :showSearch="true"
                  :showExport="true"
                  :isExportPremium="false"
                >
                  <template #contractNumber="{ item }">
                    <span class="dark:text-gray-300">{{ item.contractNumber }}</span>
                  </template>
                  <template #name="{ item }">
                    <span class="dark:text-gray-300">{{ item.name }}</span>
                  </template>
                  <template #executingDepartment="{ item }">
                    <span class="dark:text-gray-300">{{ item.executingDepartment }}</span>
                  </template>
                  <template #cost="{ item }">
                    <span class="dark:text-gray-300" v-html="formatCurrency(item.cost)" />
                  </template>
                  <template #signingDate="{ item }">
                    <span class="dark:text-gray-300">{{ formatDate(item.signingDate) }}</span>
                  </template>
                  <template #referralDate="{ item }">
                    <span class="dark:text-gray-300">{{ formatDate(item.referralDate) }}</span>
                  </template>
                  <template #proceduresCount="{ item }">
                    <span class="dark:text-gray-300">{{ item.proceduresCount || 0 }}</span>
                  </template>
                  <template #action="{ item }">
                    <div class="flex items-center justify-center gap-4">
                      <button
                        @click="handleEdit(item)"
                        class="inline-flex items-center gap-1 text-nowrap text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Icon icon="lucide:edit" class="h-4 w-4" />
                      </button>
                      <button
                        @click="handleDelete(item)"
                        :disabled="isDeleting"
                        class="inline-flex items-center gap-1 text-nowrap text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Icon icon="lucide:trash" class="h-4 w-4" />
                      </button>
                      <button
                        @click="handleView(item)"
                        class="inline-flex items-center gap-1 text-nowrap text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Icon icon="lucide:eye" class="h-4 w-4" />
                      </button>
                    </div>
                  </template>
                </CustomTable>
              </div>
              <div
                v-else
                class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center dark:border-gray-700"
              >
                <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Icon icon="lucide:file-text" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 class="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">
                  لا توجد عقود
                </h3>
                <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  قم بإضافة عقود للمشروع
                </p>
                <Button variant="outline" size="sm" @click="handleAdd">
                  <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="flex items-center gap-2">
              <Button variant="destructive" @click="showDeleteConfirmation">
                <Icon icon="material-symbols-light:delete-outline" class="mr-2 h-4 w-4" />
                حذف المشروع
              </Button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefaultLayout>
  <ContractEditModal
    v-model:open="isContractDialogOpen"
    :loading="isSaving"
    :contract="selectedContract"
    :project-id="project?.id"
    @confirm="handleContractSubmit"
    @cancel="closeContractDialog"
  />
  <DeleteModal
    v-model:open="isDeleteContractModalOpen"
    title="حذف العقد"
    description="تأكيد حذف العقد"
    :message="
      selectedContract?.title ? 'هل أنت متأكد من حذف العقد ' + selectedContract.title + '؟' : ''
    "
    :loading="isDeleting"
    @confirm="confirmDeleteContract"
    @cancel="cancelDeleteContract"
  />
  <DeleteModal
    v-model:open="showDeleteModal"
    title="حذف المشروع"
    description="تأكيد حذف المشروع"
    :message="`هل أنت متأكد من حذف المشروع '${project?.name}'؟ لا يمكن التراجع عن هذا الإجراء.`"
    :loading="isDeleting"
    @confirm="confirmDeleteProject"
    @cancel="() => (showDeleteModal = false)"
  />
</template>
<script setup>
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import ContractEditModal from '@/components/regional-project/ContractEditModal.vue';
  import RegionalProjectDetails from '@/components/regional-project/RegionalProjectDetails.vue';
  import Badge from '@/components/ui/badge/Badge.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';
  const route = useRoute();
  const router = useRouter();
  const store = useRegionalProjectStore();
  const project = ref(null);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);
  const contracts = computed(() => store.contracts);
  const contractsCount = computed(() => store.contractsCount);
  const proceduresCount = computed(() => store.proceduresCount);
  const isSaving = ref(false);
  const showDeleteModal = ref(false);
  const isDeleting = ref(false);
  const isContractDialogOpen = ref(false);
  const selectedContract = ref(null);
  const isDeleteContractModalOpen = ref(false);
  const tableRef = ref();
  const contractColumns = [
    { key: 'contractNumber', label: 'رقم العقد', type: 'text' },
    { key: 'name', label: 'اسم العقد', type: 'text' },
    { key: 'executingDepartment', label: 'الجهة المنفذة', type: 'text' },
    { key: 'cost', label: 'الكلفة', type: 'text' },
    { key: 'signingDate', label: 'تاريخ التوقيع', type: 'text' },
    { key: 'referralDate', label: 'تاريخ الإحالة', type: 'text' },
    { key: 'proceduresCount', label: 'عدد الاجراءات', type: 'text' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];
  const fetchProject = async () => {
    try {
      const projectId = parseInt(route.params.id);
      if (!projectId) {
        error.value = 'معرف المشروع غير صالح';
        return;
      }

      project.value = await store.fetchProjectById(projectId);

      if (!project.value) {
        error.value = 'المشروع غير موجود';
        return;
      }

      await store.fetchAllContracts();
    } catch (err) {
      console.error('Error fetching project:', err);
      error.value = err.message || 'حدث خطأ في تحميل بيانات المشروع';
    }
  };
  onMounted(() => {
    fetchProject();
  });
  const handleSaveProject = async (updatedProject) => {
    isSaving.value = true;
    try {
      const projectData = {
        ...updatedProject,
        projectStatus: parseInt(updatedProject.projectStatus) || 1,
      };

      const response = await axiosInstance.put(
        `/api/RegionalProject/${project.value.id}`,
        projectData
      );
      project.value = { ...project.value, ...response.data };
      await fetchProject();
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error saving project details:', error);
      let errorMessage = 'حدث خطأ أثناء الحفظ';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = [];
        for (const key in errors) {
          errorMessages.push(...errors[key]);
        }
        errorMessage = errorMessages.join('\n');
      }
      toast.error(errorMessage);
    } finally {
      isSaving.value = false;
    }
  };
  const handleCancelEdit = () => {
    fetchProject();
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
  const handleAdd = () => {
    selectedContract.value = null;
    isContractDialogOpen.value = true;
  };
  const handleEdit = (contract) => {
    selectedContract.value = contract;
    isContractDialogOpen.value = true;
  };
  const handleView = (contract) => {
    router.push(`/contracts/${contract.id}`);
  };
  const contractsWithProjects = computed(() => {
    return contracts.value.map((contract) => ({
      ...contract,
      proceduresCount: store.procedures.filter((p) => p.contractId === contract.id).length,
    }));
  });
  const exportToExcel = () => {
    const headerLabels = [
      'رقم العقد',
      'اسم العقد',
      'الجهة المنفذة',
      'الكلفة',
      'تاريخ التوقيع',
      'تاريخ الإحالة',
      'عدد الاجراءات',
    ];
    const formattedData = contractsWithProjects.value.map((contract) => ({
      'رقم العقد': contract.contractNumber ? `#${contract.contractNumber}` : '',
      'اسم العقد': contract.name || '',
      'الجهة المنفذة': contract.executingDepartment || '',
      الكلفة: contract.cost ? formatCurrency(contract.cost) : '',
      'تاريخ التوقيع': contract.signingDate ? formatDate(contract.signingDate) : '',
      'تاريخ الإحالة': contract.referralDate ? formatDate(contract.referralDate) : '',
      'عدد الاجراءات': contract.proceduresCount || 0,
    }));
    tableRef.value?.exportToExcel(formattedData, headerLabels, 'العقود');
  };
  const handleContractSubmit = async (formData) => {
    try {
      isSaving.value = true;
      if (selectedContract.value) {
        await store.updateContract(selectedContract.value.id, formData);
        toast.success('تم تعديل العقد بنجاح');
      } else {
        await store.createContract(formData);
        toast.success('تم إضافة العقد بنجاح');
      }
      closeContractDialog();
      await store.fetchAllContracts();
    } catch (error) {
      console.error('Error in contract process:', error);
      toast.error('حدث خطأ أثناء معالجة العقد');
    } finally {
      isSaving.value = false;
    }
  };
  const closeContractDialog = () => {
    selectedContract.value = null;
    isContractDialogOpen.value = false;
  };
  const handleDelete = (contract) => {
    selectedContract.value = contract;
    isDeleteContractModalOpen.value = true;
  };
  const confirmDeleteContract = async () => {
    try {
      isDeleting.value = true;
      await store.deleteContract(selectedContract.value.id);
      await store.fetchAllContracts();
      toast.success('تم حذف العقد بنجاح');
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('حدث خطأ أثناء حذف العقد');
    } finally {
      isDeleting.value = false;
      isDeleteContractModalOpen.value = false;
      selectedContract.value = null;
    }
  };
  const cancelDeleteContract = () => {
    isDeleteContractModalOpen.value = false;
    selectedContract.value = null;
  };
  const showDeleteConfirmation = () => {
    if (!project.value) return;
    showDeleteModal.value = true;
  };
  const confirmDeleteProject = async () => {
    isDeleting.value = true;
    try {
      await axiosInstance.delete(`/api/RegionalProject/${project.value.id}`);
      toast.success('تم حذف المشروع بنجاح');
      router.push('/regional-projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ أثناء حذف المشروع');
    } finally {
      isDeleting.value = false;
      showDeleteModal.value = false;
    }
  };
  const projectStatuses = [
    { value: 1, label: 'قيد التنفيذ' },
    { value: 2, label: 'منجزة' },
    { value: 3, label: 'متلكئة' },
    { value: 0, label: 'ملغاة' },
  ];
  const getStatusLabel = (status) => {
    const statusObj = projectStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : 'غير محدد';
  };
  const getStatusVariant = (status) => {
    switch (status) {
      case 1:
        return 'warning'; // قيد التنفيذ
      case 2:
        return 'success'; // منجزة
      case 3:
        return 'destructive'; // متلكئة
      case 0:
        return 'outline'; // ملغاة
      default:
        return 'secondary';
    }
  };
</script>
<style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 #e2e8f0;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-200 dark:bg-gray-700;
    border-radius: 0.25rem;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-400 dark:bg-gray-500;
    border-radius: 0.25rem;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500 dark:bg-gray-400;
  }
</style>
