<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-gray-200 dark:bg-gray-900">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <BackToMainButton />
          <h1 class="text-xl font-bold dark:text-white">الجهات المستفيدة</h1>
        </div>
        <div class="flex items-center gap-4">
          <PrimaryButton @click="handleAdd">
            <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
            اضافة جهة مستفيدة
          </PrimaryButton>
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            :columns="columns"
            :data="entities"
            @export="exportToExcel"
            :loading="isLoading"
          >
            <template #name="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
            </template>
            <template #referenceEntity="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
            </template>
            <template #location="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
            </template>
            <template #createdAt="{ value }">
              <span class="dark:text-gray-300">{{
                new Date(value).toLocaleDateString('ar-SA')
              }}</span>
            </template>
            <template #action="{ item }">
              <div class="flex items-center justify-center gap-4">
                <button
                  @click="handleEdit(item)"
                  class="inline-flex items-center gap-1 text-gray-600 text-nowrap hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Icon icon="lucide:edit" class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(item)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 text-red-600 text-nowrap hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Icon icon="lucide:trash" class="w-4 h-4" />
                </button>
              </div>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <AddBeneficiaryModal v-model:open="showModal" :edit-data="editingEntity" @save="handleSave"  />

      <!-- Delete Modal -->
      <DeleteModal
        v-model:open="isDeleteModalOpen"
        :loading="isDeleting"
        title="حذف الجهة المستفيدة"
        description="تأكيد حذف الجهة المستفيدة"
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

<script setup>
  import AddBeneficiaryModal from '@/components/AddBeneficiaryModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { beneficiaryService } from '@/services/beneficiaryService';
  import { Icon } from '@iconify/vue';
  import { toast } from 'vue-sonner';

  // Table configuration
  const columns = [
    { key: 'name', label: 'اسم الجهة المستفيدة' },
    { key: 'referenceEntity', label: 'اسم الجهة المرجعية' },
    { key: 'location', label: 'العنوان' },
    { key: 'action', label: 'الإجراءات', type: 'action' },
  ];

  // State
  const showModal = ref(false);
  const editingEntity = ref(null);
  const entities = ref([]);
  const isLoading = ref(true);
  const isDeleting = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedEntity = ref(null);

  // Fetch beneficiaries on component mount
  onMounted(async () => {
    await fetchBeneficiaries();
  });

  // Fetch beneficiaries from API
  const fetchBeneficiaries = async () => {
    isLoading.value = true;
    try {
      const response = await beneficiaryService.getAllBeneficiaries();
      entities.value = response.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      toast.error('حدث خطأ أثناء جلب بيانات الجهات المستفيدة');
    } finally {
      isLoading.value = false;
    }
  };

  // Methods
  const handleSave = async (data) => {
    try {
      const payload = {
        name: data.name,
        referenceEntity: data.referenceEntity,
        location: data.location,
      };

      if (data.id) {
        // Edit existing entity
        await beneficiaryService.updateBeneficiary(data.id, payload);
        toast.success('تم تحديث الجهة المستفيدة بنجاح');
      } else {
        // Add new entity
        await beneficiaryService.createBeneficiary(payload);
        toast.success('تمت إضافة الجهة المستفيدة بنجاح');
      }
      // Refresh the list
      await fetchBeneficiaries();
      showModal.value = false;
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      toast.error('حدث خطأ أثناء حفظ بيانات الجهة المستفيدة');
    }
  };

  const handleEdit = (entity) => {
    editingEntity.value = {
      id: entity.id,
      name: entity.name,
      referenceEntity: entity.referenceEntity,
      location: entity.location,
    };
    showModal.value = true;
  };

  const handleAdd = () => {
    editingEntity.value = null;
    showModal.value = true;
  };

  const handleDelete = (entity) => {
    selectedEntity.value = entity;
    isDeleteModalOpen.value = true;
  };

  const confirmDelete = async () => {
    try {
      isDeleting.value = true;
      await beneficiaryService.deleteBeneficiary(selectedEntity.value.id);
      toast('تم حذف الجهة المستفيدة', {
        description: `تم حذف الجهة المستفيدة "${selectedEntity.value.name}" بنجاح`,
        type: 'success',
      });
      await fetchBeneficiaries();
      isDeleteModalOpen.value = false;
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      toast('خطأ في حذف الجهة المستفيدة', {
        description: 'حدث خطأ أثناء محاولة حذف الجهة المستفيدة',
        type: 'error',
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
  };
</script>
