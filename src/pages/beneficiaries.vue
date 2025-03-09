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
            :columns="columns"
            :data="entities"
            @export="exportToExcel"
            @action-click="handleEdit"
            :loading="isLoading"
          >
            <template #name="{ value, item }">
              <div class="flex items-center gap-2">
                <span class="dark:text-gray-300">{{ value }}</span>
              </div>
            </template>
            <template #reference="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
            </template>
            <template #address="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <AddBeneficiaryModal v-model:open="showModal" :edit-data="editingEntity" @save="handleSave" />

      <!-- Quick Name Edit Modal -->
      <Dialog v-model:open="showQuickNameModal">
        <DialogContent class="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle class="text-right text-xl font-semibold">
              تعديل اسم الجهة المستفيدة
            </DialogTitle>
          </DialogHeader>

          <form @submit.prevent="saveQuickNameEdit" class="py-4">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="text-right">اسم الجهة</Label>
                <Input
                  v-model="quickEditName"
                  dir="rtl"
                  placeholder="اسم الجهة المستفيدة"
                  class="border-gray-200"
                />
              </div>
            </div>

            <div class="mt-6 flex flex-row-reverse gap-2">
              <Button type="submit" class="w-2/4">
                <Icon icon="lucide:check" class="ml-2 h-4 w-4" />
                حفظ
              </Button>
              <Button
                type="button"
                variant="outline"
                class="w-1/4"
                @click="showQuickNameModal = false"
              >
                <Icon icon="lucide:x" class="ml-2 h-4 w-4" />
                الغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import AddBeneficiaryModal from '@/components/AddBeneficiaryModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Button } from '@/components/ui/button';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { beneficiaryService } from '@/services/beneficiaryService';
  import { Icon } from '@iconify/vue';
  import { toast } from 'vue-sonner';

  // Table configuration
  const columns = [
    { key: 'name', label: 'اسم الجهة المستفيدة' },
    { key: 'reference', label: 'اسم الجهة المرجعية' },
    { key: 'address', label: 'العنوان' },
    { key: 'actions', label: '', type: 'action', icon: 'lucide:pencil' },
  ];

  // State
  const showModal = ref(false);
  const editingEntity = ref(null);
  const entities = ref([]);
  const isLoading = ref(true);

  // Quick name edit state
  const showQuickNameModal = ref(false);
  const quickEditName = ref('');
  const quickEditEntityId = ref(null);

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
      if (data.id) {
        // Edit existing entity
        await beneficiaryService.updateBeneficiary(data.id, data);
        toast.success('تم تحديث الجهة المستفيدة بنجاح');
      } else {
        // Add new entity
        await beneficiaryService.createBeneficiary(data);
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
    editingEntity.value = entity;
    showModal.value = true;
  };

  const handleAdd = () => {
    editingEntity.value = null;
    showModal.value = true;
  };

  // Quick name edit methods
  const handleQuickNameEdit = (entity) => {
    quickEditEntityId.value = entity.id;
    quickEditName.value = entity.name;
    showQuickNameModal.value = true;
  };

  const saveQuickNameEdit = async () => {
    if (!quickEditName.value.trim()) {
      toast.error('يرجى إدخال اسم الجهة المستفيدة');
      return;
    }

    try {
      await beneficiaryService.updateBeneficiaryName(quickEditEntityId.value, quickEditName.value);
      toast.success('تم تحديث اسم الجهة المستفيدة بنجاح');
      await fetchBeneficiaries();
      showQuickNameModal.value = false;
    } catch (error) {
      console.error('Error updating beneficiary name:', error);
      toast.error('حدث خطأ أثناء تحديث اسم الجهة المستفيدة');
    }
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
  };
</script>
