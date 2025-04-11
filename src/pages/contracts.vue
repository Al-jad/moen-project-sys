<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BackToMainButton />
          <h1 class="text-xl font-bold dark:text-white">العقود</h1>
        </div>
        <div class="flex items-center gap-4">
          <PrimaryButton @click="handleAdd">
            <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
            اضافة عقد جديد
          </PrimaryButton>
        </div>
      </div>
      <div class="rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="contractsWithProjects"
            @export="exportToExcel"
            :loading="loading"
            :showDateFilter="false"
            :showSearch="true"
            :showExport="true"
            :isExportPremium="false"
            @edit="handleEdit"
            @delete="handleDelete"
          >
            <template #contractNumber="{ item }">
              <span class="dark:text-gray-300">#{{ item.contractNumber }}</span>
            </template>
            <template #name="{ item }">
              <span class="dark:text-gray-300">{{ item.name }}</span>
            </template>
            <template #projectName="{ item }">
              <div class="flex items-center gap-2">
                <span class="dark:text-gray-300">{{ item.project?.name || 'غير محدد' }}</span>
                <button
                  v-if="item.project"
                  @click="router.push(`/project/${item.project.id}`)"
                  class="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                >
                  <Icon icon="lucide:external-link" class="h-4 w-4" />
                </button>
              </div>
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
      </div>
      <AddContractModal
        v-model:open="showModal"
        :edit-data="editingContract"
        :projects="projects"
        @save="handleSave"
      />
      <DeleteModal
        v-model:open="isDeleteModalOpen"
        :loading="isDeleting"
        title="حذف العقد"
        description="تأكيد حذف العقد"
        :message="
          selectedContract?.contractNumber
            ? 'هل أنت متأكد من حذف العقد رقم ' + selectedContract.contractNumber + '؟'
            : ''
        "
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </main>
  </DefaultLayout>
</template>
<script setup lang="ts">
  import AddContractModal from '@/components/AddContractModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';
  interface Column {
    key: string;
    label: string;
    type: 'text' | 'button' | 'action' | 'actions' | 'custom';
  }
  interface Contract {
    id: number;
    name: string;
    contractNumber: number;
    executingDepartment: string;
    cost: number;
    signingDate: string;
    referralDate: string;
    projectId: number;
    project?: {
      id: number;
      name: string;
    };
  }
  const columns: Column[] = [
    { key: 'contractNumber', label: 'رقم العقد', type: 'text' },
    { key: 'name', label: 'اسم العقد', type: 'text' },
    { key: 'projectName', label: 'اسم المشروع', type: 'text' },
    { key: 'executingDepartment', label: 'الجهة المنفذة', type: 'text' },
    { key: 'cost', label: 'الكلفة', type: 'text' },
    { key: 'signingDate', label: 'تاريخ التوقيع', type: 'text' },
    { key: 'referralDate', label: 'تاريخ الإحالة', type: 'text' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];
  const showModal = ref(false);
  const editingContract = ref<Contract | null>(null);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedContract = ref<Contract | null>(null);
  const tableRef = ref();
  const regionalProjectStore = useRegionalProjectStore();
  const contracts = computed<Contract[]>(() => regionalProjectStore.contracts);
  const projects = computed(() => regionalProjectStore.projects);
  const loading = computed(() => regionalProjectStore.loading);
  const router = useRouter();
  const formatDate = (dateString: string) => {
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
  const formatCurrency = (value: number) => {
    if (!value) return '0';
    const formattedNumber = new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value);
    return `${formattedNumber} د.ع`;
  };
  const handleSave = async (data: Partial<Contract>) => {
    try {
      const payload = {
        name: data.name || '',
        projectId: data.projectId,
        executingDepartment: data.executingDepartment,
        cost: data.cost,
        referralDate: data.referralDate,
        signingDate: data.signingDate,
        contractNumber: data.contractNumber,
      };

      if (editingContract.value?.id) {
        // Edit existing contract
        await regionalProjectStore.updateContract(editingContract.value.id, payload);
        toast.success('تم تحديث العقد بنجاح');
      } else {
        // Add new contract
        await regionalProjectStore.createContract(payload);
        toast.success('تمت إضافة العقد بنجاح');
      }

      // Close modal first
      showModal.value = false;

      // Then refresh the data
      await Promise.all([
        regionalProjectStore.fetchAllContracts(),
        regionalProjectStore.fetchAllProjects(),
      ]);
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('حدث خطأ أثناء حفظ بيانات العقد');
    }
  };
  const handleEdit = (contract: Contract) => {
    editingContract.value = { ...contract };
    showModal.value = true;
  };
  const handleAdd = () => {
    editingContract.value = null;
    showModal.value = true;
  };
  const handleDelete = (contract: Contract) => {
    selectedContract.value = contract;
    isDeleteModalOpen.value = true;
  };
  const handleView = (contract: Contract) => {
    router.push(`/contracts/${contract.id}`);
  };
  const confirmDelete = async () => {
    try {
      isDeleting.value = true;
      await regionalProjectStore.deleteContract(selectedContract.value?.id!);
      toast.success('تم حذف العقد', {
        description: `تم حذف العقد رقم "${selectedContract.value?.contractNumber}" بنجاح`,
      });
      await regionalProjectStore.fetchAllContracts();
      isDeleteModalOpen.value = false;
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('خطأ في حذف العقد', {
        description: 'حدث خطأ أثناء محاولة حذف العقد',
      });
    } finally {
      isDeleting.value = false;
      selectedContract.value = null;
    }
  };
  const cancelDelete = () => {
    isDeleteModalOpen.value = false;
    selectedContract.value = null;
  };
  const contractsWithProjects = computed(() => {
    return contracts.value.map((contract) => ({
      ...contract,
      project: regionalProjectStore.projects.find((p) => p.id === contract.projectId),
    }));
  });
  const exportToExcel = () => {
    const headerLabels = [
      'رقم العقد',
      'اسم العقد',
      'اسم المشروع',
      'الجهة المنفذة',
      'الكلفة',
      'تاريخ التوقيع',
      'تاريخ الإحالة',
    ];
    const formattedData = contractsWithProjects.value.map((contract) => ({
      'رقم العقد': contract.contractNumber ? `#${contract.contractNumber}` : '',
      'اسم العقد': contract.name || '',
      'اسم المشروع': contract.project?.name || 'غير محدد',
      'الجهة المنفذة': contract.executingDepartment || '',
      الكلفة: contract.cost ? formatCurrency(contract.cost) : '',
      'تاريخ التوقيع': contract.signingDate ? formatDate(contract.signingDate) : '',
      'تاريخ الإحالة': contract.referralDate ? formatDate(contract.referralDate) : '',
    }));
    tableRef.value?.exportToExcel(formattedData, headerLabels, 'العقود');
  };
  onMounted(async () => {
    await Promise.all([
      regionalProjectStore.fetchAllContracts(),
      regionalProjectStore.fetchAllProjects(),
    ]);
  });
</script>
<style scoped>
  .rtl {
    direction: rtl;
  }
</style>
