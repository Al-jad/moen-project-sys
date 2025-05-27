<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BackToMainButton />
          <h1 class="text-xl font-bold dark:text-white">الجهات المستفيدة</h1>
        </div>
        <div class="flex items-center gap-4">
          <PrimaryButton @click="handleAdd">
            <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
            اضافة جهة مستفيدة
          </PrimaryButton>
        </div>
      </div>

      <!-- Table Card -->
      <div class="rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="beneficiaries"
            @export="exportToExcel"
            :loading="isLoading"
            :showDateFilter="false"
            :showSearch="true"
            :showExport="true"
            :isExportPremium="false"
          >
            <template #name="{ item }">
              <span class="dark:text-gray-300">{{ item.name }}</span>
            </template>
            <template #referenceEntity="{ item }">
              <span class="dark:text-gray-300">{{ item.referenceEntity }}</span>
            </template>
            <template #location="{ item }">
              <span class="dark:text-gray-300">{{ item.location }}</span>
            </template>
            <template #createdAt="{ item }">
              <span class="dark:text-gray-300">{{
                new Date(item.createdAt).toLocaleDateString('en-US')
              }}</span>
            </template>
            <template #action="{ item }">
              <div class="flex items-center justify-center gap-4">
                <button
                  @click="handleEdit(item as Beneficiary)"
                  class="inline-flex items-center gap-1 text-nowrap text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Icon icon="lucide:edit" class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(item as Beneficiary)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 text-nowrap text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Icon icon="lucide:trash" class="h-4 w-4" />
                </button>
              </div>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <AddBeneficiaryModal v-model:open="showModal" :edit-data="editingEntity" @save="handleSave" />

      <!-- Delete Modal -->
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
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue-sonner';

  // Define Column type
  type ColumnType = 'button' | 'text' | 'action' | 'actions' | 'custom';
  interface Column {
    key: string;
    label: string;
    type?: ColumnType;
  }

  // Table configuration with proper typing
  const columns: Column[] = [
    { key: 'name', label: 'اسم الجهة المستفيدة', type: 'text' },
    { key: 'referenceEntity', label: 'اسم الجهة المرجعية', type: 'text' },
    { key: 'location', label: 'العنوان', type: 'text' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];

  // Use our new composable
  const {
    beneficiaries,
    isLoading,
    fetchBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
  } = useBeneficiaries();

  // State with proper typing
  const showModal = ref(false);
  const editingEntity = ref<Beneficiary | null>(null);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedEntity = ref<Beneficiary | null>(null);
  const tableRef = ref();

  // Fetch beneficiaries on component mount
  onMounted(async () => {
    await fetchBeneficiaries(true);
  });

  // Methods
  const handleSave = async (data: Partial<Beneficiary>) => {
    try {
      const payload = {
        name: data.name,
        referenceEntity: data.referenceEntity,
        location: data.location,
      };

      if (data.id) {
        // Edit existing entity
        await updateBeneficiary(data.id, payload);
        toast.success('تم تحديث الجهة المستفيدة بنجاح');
      } else {
        // Add new entity
        await addBeneficiary(payload as Omit<Beneficiary, 'id'>);
        toast.success('تمت إضافة الجهة المستفيدة بنجاح');
      }
      showModal.value = false;
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      toast.error('حدث خطأ أثناء حفظ بيانات الجهة المستفيدة');
    }
  };

  const handleEdit = (entity: Beneficiary) => {
    editingEntity.value = {
      ...entity, // Spread all properties to include createdAt and updatedAt
    };
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
