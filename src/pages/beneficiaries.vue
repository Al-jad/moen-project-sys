<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-background">
      <div class="border shadow-lg rounded-xl border-border bg-card">
        <div class="p-8">
          <div class="pb-6 mb-8 border-b border-border">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <BackToMainButton />
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">الجهات المستفيدة</h1>
                </div>
                <p class="text-foreground-muted">إدارة وعرض جميع الجهات المستفيدة في النظام</p>
              </div>
              <div class="flex items-center gap-4">
                <PrimaryButton @click="handleAdd">
                  <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
                  اضافة جهة مستفيدة
                </PrimaryButton>
              </div>
            </div>
          </div>
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="beneficiaries"
            :filters="filters"
            @export="exportToExcel"
            :loading="isLoading"
            :showDateFilter="false"
            :showSearch="true"
            :showExport="true"
            :isExportPremium="false"
          >
            <template #name="{ item }">
              <span class="font-medium text-foreground-body">{{ item.name }}</span>
            </template>
            <template #referenceEntity="{ item }">
              <span class="font-medium text-foreground-body">{{ item.referenceEntity }}</span>
            </template>
            <template #location="{ item }">
              <span class="font-medium text-foreground-body">{{ item.location }}</span>
            </template>
            <template #createdAt="{ item }">
              <div class="font-medium text-foreground-body">
                {{
                  new Date(item.createdAt).toLocaleDateString('ar', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                }}
              </div>
            </template>
            <template #action="{ item }">
              <div class="flex items-center justify-center gap-4">
                <button
                  @click="handleEdit(item as Beneficiary)"
                  class="inline-flex items-center gap-1 transition-colors text-nowrap text-primary hover:text-primary-hover"
                >
                  <Icon icon="lucide:edit" class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(item as Beneficiary)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 transition-colors hover:text-destructive-hover text-nowrap text-destructive"
                >
                  <Icon icon="lucide:trash" class="w-4 h-4" />
                </button>
              </div>
            </template>
          </CustomTable>
        </div>
      </div>
      <AddBeneficiaryModal v-model:open="showModal" :edit-data="editingEntity" @save="handleSave" />
      <DeleteModal
        v-model:open="isDeleteModalOpen"
        :loading="isDeleting"
        title="حذف الجهة المستفيدة"
        :message="
          selectedEntity?.name
            ? 'هل أنت متأكد من حذف الجهة المستفيدة ' + selectedEntity.name + '؟'
            : ''
        "
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </main>
  </DefaultLayout>
</template>
<script setup lang="ts">
  import AddBeneficiaryModal from '@/components/AddBeneficiaryModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { useBeneficiaries } from '@/composables/useBeneficiaries';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import type { Beneficiary } from '@/types';
  import { Icon } from '@iconify/vue';
  import { onMounted, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';
  type ColumnType = 'button' | 'text' | 'action' | 'actions' | 'custom';
  interface Column {
    key: string;
    label: string;
    type?: ColumnType;
  }
  interface Filter {
    key: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    icon: string;
    triggerClass?: string;
  }
  const columns: Column[] = [
    { key: 'name', label: 'اسم الجهة المستفيدة', type: 'text' },
    { key: 'referenceEntity', label: 'اسم الجهة المرجعية', type: 'text' },
    { key: 'location', label: 'العنوان', type: 'text' },
    { key: 'createdAt', label: 'تاريخ الإنشاء', type: 'text' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];
  const filters: Filter[] = [
    {
      key: 'location',
      placeholder: 'اختر المنطقة',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'baghdad', label: 'بغداد' },
        { value: 'basra', label: 'البصرة' },
        { value: 'najaf', label: 'النجف' },
      ],
      icon: 'lucide:map-pin',
      triggerClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];
  const {
    beneficiaries,
    isLoading,
    fetchBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
  } = useBeneficiaries();
  const showModal = ref(false);
  const editingEntity = ref<Beneficiary | null>(null);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedEntity = ref<Beneficiary | null>(null);
  const tableRef = ref();
  watch(showModal, (newVal) => {
    if (!newVal) {
      editingEntity.value = null;
    }
  });
  onMounted(async () => {
    await fetchBeneficiaries(true);
  });
  const handleSave = async (data: Partial<Beneficiary>) => {
    try {
      const payload = {
        name: data.name,
        referenceEntity: data.referenceEntity,
        location: data.location,
      };
      if (data.id) {
        await updateBeneficiary(data.id, payload);
        toast.success('تم تحديث الجهة المستفيدة بنجاح');
        await fetchBeneficiaries(true);
      } else {
        await addBeneficiary(payload as Omit<Beneficiary, 'id'>);
        toast.success('تمت إضافة الجهة المستفيدة بنجاح');
        await fetchBeneficiaries(true);
      }
      showModal.value = false;
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      toast.error('حدث خطأ أثناء حفظ بيانات الجهة المستفيدة');
    }
  };
  const handleEdit = (entity: Beneficiary) => {
    editingEntity.value = JSON.parse(JSON.stringify(entity));
    showModal.value = true;
  };
  const handleAdd = () => {
    editingEntity.value = null;
    showModal.value = true;
  };
  const handleDelete = (entity: Beneficiary) => {
    selectedEntity.value = entity;
    isDeleteModalOpen.value = true;
  };
  const confirmDelete = async () => {
    if (!selectedEntity.value?.id) return;
    try {
      isDeleting.value = true;
      await deleteBeneficiary(selectedEntity.value.id);
      toast.success('تم حذف الجهة المستفيدة', {
        description: `تم حذف الجهة المستفيدة "${selectedEntity.value.name}" بنجاح`,
      });
      isDeleteModalOpen.value = false;
      await fetchBeneficiaries(true);
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      toast.error('خطأ في حذف الجهة المستفيدة', {
        description: 'حدث خطأ أثناء محاولة حذف الجهة المستفيدة',
      });
    } finally {
      isDeleting.value = false;
      selectedEntity.value = null;
    }
  };
  const cancelDelete = () => {
    isDeleteModalOpen.value = false;
    selectedEntity.value = null;
  };
  const exportToExcel = () => {
    const headerLabels = ['اسم الجهة المستفيدة', 'اسم الجهة المرجعية', 'العنوان', 'تاريخ الإنشاء'];
    const formattedData = beneficiaries.value.map((entity) => ({
      'اسم الجهة المستفيدة': entity.name || '',
      'اسم الجهة المرجعية': entity.referenceEntity || '',
      العنوان: entity.location || '',
      'تاريخ الإنشاء': entity.createdAt || '',
    }));
    tableRef.value?.exportToExcel(formattedData, headerLabels, 'الجهات المستفيدة');
  };
</script>
