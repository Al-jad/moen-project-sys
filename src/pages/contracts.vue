<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-background">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <BackToMainButton />
          <h1 class="text-xl font-bold">العقود</h1>
        </div>
        <div class="flex items-center gap-4">
          <PrimaryButton @click="handleAdd">
            <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
            اضافة عقد جديد
          </PrimaryButton>
        </div>
      </div>
      <div class="rounded-lg shadow-sm border-border bg-background-surface">
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
            @edit="(item: any) => handleEdit(item as ContractWithProject)"
            @delete="(item: any) => handleDelete(item as ContractWithProject)"
            @view="(item: any) => handleView(item as ContractWithProject)"
          >
            <template #contractNumber="{ item }: { item: any }">
              <span>{{ (item as ContractWithProject).contractNumber }}</span>
            </template>
            <template #name="{ item }: { item: any }">
              <span>{{ (item as ContractWithProject).name }}</span>
            </template>
            <template #projectName="{ item }: { item: any }">
              <div class="flex items-center gap-2">
                <span>{{ (item as ContractWithProject).project?.name || 'غير محدد' }}</span>
                <button
                  v-if="(item as ContractWithProject).project"
                  @click="router.push(`/project/${(item as ContractWithProject).project!.id}`)"
                  class="p-1 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50"
                >
                  <Icon icon="lucide:external-link" class="w-4 h-4" />
                </button>
              </div>
            </template>
            <template #executingDepartment="{ item }: { item: any }">
              <span>{{ (item as ContractWithProject).executingDepartment }}</span>
            </template>
            <template #cost="{ item }: { item: any }">
              <span v-html="formatCurrency((item as ContractWithProject).cost)" />
            </template>
            <template #signingDate="{ item }: { item: any }">
              <span>{{ formatDate((item as ContractWithProject).signingDate) }}</span>
            </template>
            <template #referralDate="{ item }: { item: any }">
              <span>{{ formatDate((item as ContractWithProject).referralDate) }}</span>
            </template>
            <template #proceduresCount="{ item }: { item: any }">
              <span>{{ (item as ContractWithProject).proceduresCount || 0 }}</span>
            </template>
            <template #action="{ item }: { item: any }">
              <div class="flex items-center justify-center gap-4">
                <button
                  @click="handleEdit(item as ContractWithProject)"
                  class="inline-flex items-center gap-1 text-gray-600 text-nowrap hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Icon icon="lucide:edit" class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(item as ContractWithProject)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 text-red-600 text-nowrap hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Icon icon="lucide:trash" class="w-4 h-4" />
                </button>
                <button
                  @click="handleView(item as ContractWithProject)"
                  class="inline-flex items-center gap-1 text-blue-600 text-nowrap hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Icon icon="lucide:eye" class="w-4 h-4" />
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
  interface Project {
    id: number;
    name: string;
  }
  interface Procedure {
    id: number;
    contractId: number;
  }
  interface ContractWithProject extends Contract {
    project?: {
      id: number;
      name: string;
    };
    proceduresCount?: number;
  }
  const columns: Column[] = [
    { key: 'contractNumber', label: 'رقم العقد', type: 'text' },
    { key: 'name', label: 'اسم العقد', type: 'text' },
    { key: 'projectName', label: 'اسم المشروع', type: 'text' },
    { key: 'executingDepartment', label: 'الجهة المنفذة', type: 'text' },
    { key: 'cost', label: 'الكلفة', type: 'text' },
    { key: 'signingDate', label: 'تاريخ التوقيع', type: 'text' },
    { key: 'referralDate', label: 'تاريخ الإحالة', type: 'text' },
    { key: 'proceduresCount', label: 'عدد الاجراءات', type: 'text' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];
  const showModal = ref(false);
  const editingContract = ref<Contract | null>(null);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedContract = ref<Contract | null>(null);
  const tableRef = ref<any>(null);
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
  const contractsWithProjects = computed<ContractWithProject[]>(() => {
    return contracts.value.map((contract) => ({
      ...contract,
      project: regionalProjectStore.projects.find((p: Project) => p.id === contract.projectId),
      proceduresCount: regionalProjectStore.procedures.filter(
        (p: Procedure) => p.contractId === contract.id
      ).length,
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
      regionalProjectStore.fetchAllProcedures(),
    ]);
  });
</script>
<style scoped>
  .rtl {
    direction: rtl;
  }
</style>
