<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold">الجهات المستفيدة</h1>
        <div class="flex items-center gap-4">
          <Button variant="default" class="flex items-center gap-2" @click="handleAdd">
            <Plus class="w-4 h-4" />
            اضافة جهة مستفيدة
          </Button>
        </div>
      </div>
      <!-- Table -->
      <div class="p-6 overflow-hidden bg-white border rounded-lg">
        <div class="flex items-center justify-between gap-4 py-4">
          <Button variant="outline" class="flex items-center gap-2">
            <FileSpreadsheet class="w-4 h-4" />
            تصدير Excel
          </Button>
          <div class="relative min-w-[240px]">
            <Input
              v-model="search"
              type="text"
              placeholder="بحث سريع"
              class="pr-10 border-gray-200 placeholder:text-gray-400 focus:border-gray-200"
            />
            <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
              <Search class="text-gray-400 size-6" />
            </span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow class="bg-gray-100">
              <TableHead class="text-right">اسم الجهة المستفيدة</TableHead>
              <TableHead class="text-right">اسم الجهة المرجعية</TableHead>
              <TableHead class="text-right">العنوان</TableHead>
              <TableHead class="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="entity in paginatedEntities" :key="entity.id" class="hover:bg-gray-50">
              <TableCell>{{ entity.name }}</TableCell>
              <TableCell>{{ entity.reference }}</TableCell>
              <TableCell>{{ entity.address }}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" @click="handleEdit(entity)">
                  <Pencil class="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious :disabled="currentPage === 1" @click="currentPage--" />
              </PaginationItem>

              <PaginationItem v-for="page in totalPages" :key="page">
                <PaginationLink :isActive="page === currentPage" @click="currentPage = page">
                  {{ page }}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext :disabled="currentPage === totalPages" @click="currentPage++" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <AddBeneficiaryModal 
        v-model:open="showModal"
        :edit-data="editingEntity"
        @save="handleSave"
      />
    </main>
  </DefaultLayout>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Search, FileSpreadsheet, Plus, Pencil } from 'lucide-vue-next';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination';
  import AddBeneficiaryModal from '@/components/AddBeneficiaryModal.vue';

  // State
  const search = ref('');
  const currentPage = ref(1);
  const showModal = ref(false);
  const editingEntity = ref(null);
  const itemsPerPage = 7;

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
    {
      id: 7,
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
    {
      id: 7,
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
      const index = entities.value.findIndex(e => e.id === data.id);
      if (index !== -1) {
        entities.value[index] = data;
      }
    } else {
      // Add new entity
      entities.value.push({
        id: entities.value.length + 1,
        ...data
      });
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

  // Computed
  const filteredEntities = computed(() => {
    if (!search.value) return entities.value;

    const searchTerm = search.value.toLowerCase();
    return entities.value.filter(
      (entity) =>
        entity.name.toLowerCase().includes(searchTerm) ||
        entity.reference.toLowerCase().includes(searchTerm) ||
        entity.address.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedEntities = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEntities.value.slice(start, end);
  });

  const totalPages = computed(() => Math.ceil(filteredEntities.value.length / itemsPerPage));
</script>
