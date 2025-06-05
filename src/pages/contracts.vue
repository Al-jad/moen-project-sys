<template>
  <DefaultLayout>
    <Toaster position="bottom-left" />
    <main class="min-h-screen bg-background p-6">
      <div class="rounded-xl border border-border bg-card shadow-lg">
        <div class="p-8">
          <!-- Page Header -->
          <div class="mb-8 border-b border-border pb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <BackToMainButton />
                <div>
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">
                    العقود
                    <span v-if="!loading" class="text-lg font-medium text-foreground-muted">
                      ({{ contracts.length }})
                    </span>
                  </h1>
                  <p class="text-foreground-muted">عرض وإدارة جميع العقود في النظام</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading && contracts.length === 0" class="space-y-6">
            <div class="flex items-center justify-center py-16">
              <div class="flex flex-col items-center gap-4">
                <div
                  class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
                ></div>
                <p class="text-foreground-muted">جاري تحميل العقود...</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-else-if="contracts.length > 0">
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
                <span class="font-medium text-foreground-body">{{
                  (item as ContractWithProject).contractNumber
                }}</span>
              </template>
              <template #name="{ item }: { item: any }">
                <div class="max-w-xs">
                  <p
                    class="truncate font-medium text-foreground-heading"
                    :title="(item as ContractWithProject).name"
                  >
                    {{ (item as ContractWithProject).name }}
                  </p>
                </div>
              </template>
              <template #projectName="{ item }: { item: any }">
                <Badge
                  class="w-fit border-0 bg-accent font-medium text-accent-foreground shadow-sm"
                >
                  {{ (item as ContractWithProject).project?.name || 'غير محدد' }}
                </Badge>
              </template>
              <template #executingDepartment="{ item }: { item: any }">
                <span class="font-medium text-foreground-body">{{
                  (item as ContractWithProject).executingDepartment
                }}</span>
              </template>
              <template #cost="{ item }: { item: any }">
                <span
                  class="font-medium text-foreground-body"
                  v-html="formatCurrency((item as ContractWithProject).cost)"
                />
              </template>
              <template #signingDate="{ item }: { item: any }">
                <span class="font-medium text-foreground-body">{{
                  formatDate((item as ContractWithProject).signingDate)
                }}</span>
              </template>
              <template #referralDate="{ item }: { item: any }">
                <span class="font-medium text-foreground-body">{{
                  formatDate((item as ContractWithProject).referralDate)
                }}</span>
              </template>
              <template #proceduresCount="{ item }: { item: any }">
                <span class="font-medium text-foreground-body">{{
                  (item as ContractWithProject).proceduresCount || 0
                }}</span>
              </template>
              <template #action="{ item }: { item: any }">
                <div class="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-500/10"
                    @click="handleEdit(item as ContractWithProject)"
                    :title="'تعديل ' + item.name"
                  >
                    <Icon icon="lucide:edit" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    @click="handleDelete(item as ContractWithProject)"
                    :disabled="isDeleting"
                    :title="'حذف ' + item.name"
                  >
                    <Icon icon="lucide:trash" class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-primary hover:bg-primary/10 hover:text-primary"
                    @click="handleView(item as ContractWithProject)"
                    :title="'عرض ' + item.name"
                  >
                    <Icon icon="lucide:eye" class="h-4 w-4" />
                  </Button>
                </div>
              </template>
            </CustomTable>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-16">
            <div class="rounded-full bg-muted p-6">
              <Icon icon="lucide:file-plus" class="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-foreground-heading">لا توجد عقود</h3>
            <p class="mt-2 max-w-sm text-center text-foreground-muted">
              لم يتم العثور على أي عقود في النظام. ابدأ بإضافة عقد جديد.
            </p>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <AddContractModal
        v-model:open="showModal"
        :edit-data="editingContract"
        :projects="projects"
        @save="handleSave"
      />

      <!-- Delete Confirmation Dialog -->
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
        :sub-message="'سيتم حذف العقد نهائياً من النظام'"
        :checklist="[
          {
            text: 'لن يمكنك استعادة البيانات بعد الحذف',
            icon: 'lucide:x-circle',
          },
          {
            text: 'سيتم إزالة العقد من جميع السجلات',
            icon: 'lucide:alert-triangle',
          },
        ]"
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
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Toaster } from '@/components/ui/sonner';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useRegionalProjectStore } from '@/stores/regionalProjectStore';
  import type { Contract, CreateContractRequest } from '@/types/contract';
  import type { Procedure } from '@/types/procedure';
  import type { Project } from '@/types/project-type';
  import { Icon } from '@iconify/vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue-sonner';

  interface Column {
    key: string;
    label: string;
    type: 'text' | 'button' | 'action' | 'actions' | 'custom';
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

  const handleSave = async (data: Partial<CreateContractRequest>) => {
    try {
      const payload: CreateContractRequest = {
        name: data.name || '',
        projectId: data.projectId!,
        executingDepartment: data.executingDepartment!,
        cost: data.cost!,
        referralDate: data.referralDate,
        signingDate: data.signingDate,
        contractNumber: data.contractNumber!,
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
