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
          >
            <template #name="{ value }">
              <span class="dark:text-gray-300">{{ value }}</span>
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
    </main>
  </DefaultLayout>
</template>

<script setup>
  import AddBeneficiaryModal from '@/components/AddBeneficiaryModal.vue';
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';

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

  // Mock data
  const entities = ref([
    {
      id: 1,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 2,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 3,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 4,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 5,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 6,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
    {
      id: 7,
      name: 'مديرية بلدية بغداد',
      reference: 'دائرة حماية وتحسين البيئة في منطقة الوسط',
      address: 'بغداد ساحة الاندلس',
    },
  ]);

  // Methods
  const handleSave = (data) => {
    if (data.id) {
      // Edit existing entity
      const index = entities.value.findIndex((e) => e.id === data.id);
      if (index !== -1) {
        entities.value[index] = data;
      }
    } else {
      // Add new entity
      entities.value.push({
        id: entities.value.length + 1,
        ...data,
      });
    }
    showModal.value = false;
  };

  const handleEdit = (entity) => {
    editingEntity.value = entity;
    showModal.value = true;
  };

  const handleAdd = () => {
    editingEntity.value = null;
    showModal.value = true;
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
  };
</script>
