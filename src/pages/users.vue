<template>
  <DefaultLayout>
    <main class="min-h-screen bg-background p-6">
      <div class="rounded-xl border border-border bg-card shadow-lg">
        <div class="p-8">
          <div class="mb-8 border-b border-border pb-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <BackToMainButton />
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">إدارة المستخدمين</h1>
                </div>
                <p class="text-foreground-muted">إدارة وعرض جميع المستخدمين في النظام</p>
              </div>
              <div class="flex items-center gap-4">
                <PrimaryButton @click="handleAdd">
                  <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
                  اضافة مستخدم
                </PrimaryButton>
              </div>
            </div>
          </div>
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="users"
            :filters="filters"
            @export="exportToExcel"
            :loading="isLoading"
            :showDateFilter="false"
            :showSearch="true"
            :showExport="true"
            :isExportPremium="false"
            @cell-click="handleCellClick"
          >
            <template #name="{ item }">
              <button
                @click="handleViewDetails(item as User)"
                class="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
              >
                {{ item.name }}
              </button>
            </template>
            <template #email="{ item }">
              <span class="font-medium text-foreground-body">{{ item.email }}</span>
            </template>
            <template #role="{ item }">
              <Badge
                v-if="item.role === 'ADMIN'"
                class="w-fit border-0 bg-success font-medium text-success-foreground shadow-sm"
              >
                مدير
              </Badge>
              <Badge
                v-else-if="item.role === 'SUPERVISOR'"
                class="w-fit border-0 bg-accent font-medium text-accent-foreground shadow-sm"
              >
                مشرف
              </Badge>
              <Badge
                v-else
                class="w-fit border-0 bg-secondary font-medium text-secondary-foreground shadow-sm"
              >
                مدخل بيانات
              </Badge>
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
          </CustomTable>
        </div>
      </div>

      <!-- User Details Modal -->
      <UserDetailsModal v-model:open="showDetailsDialog" :user-data="selectedUser" />

      <!-- Delete Confirmation Modal -->
      <DeleteModal
        v-model:open="showDeleteDialog"
        :loading="isDeleting"
        title="حذف المستخدم"
        :message="
          selectedUser?.name ? 'هل أنت متأكد من حذف المستخدم ' + selectedUser.name + '؟' : ''
        "
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import DeleteModal from '@/components/DeleteModal.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Badge } from '@/components/ui/badge';
  import UserDetailsModal from '@/components/UserDetailsModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useUserStore } from '@/stores/useUserStore';
  import type { User } from '@/types/users';
  import { Icon } from '@iconify/vue';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const userStore = useUserStore();
  const { users, isLoading, selectedUser } = storeToRefs(userStore);

  const showDetailsDialog = ref(false);
  const showDeleteDialog = ref(false);
  const isDeleting = ref(false);
  const tableRef = ref();

  interface Column {
    key: string;
    label: string;
    type?: 'text' | 'action' | 'button' | 'custom';
  }

  const columns: Column[] = [
    { key: 'name', label: 'اسم المستخدم', type: 'text' },
    { key: 'email', label: 'البريد الإلكتروني', type: 'text' },
    { key: 'role', label: 'الصلاحية', type: 'text' },
    { key: 'createdAt', label: 'تاريخ الإنشاء', type: 'text' },
  ];

  const filters = [
    {
      key: 'role',
      placeholder: 'اختر الصلاحية',
      options: [
        { value: 'all', label: 'الكل' },
        { value: 'ADMIN', label: 'مدير' },
        { value: 'SUPERVISOR', label: 'مشرف' },
        { value: 'CLERK', label: 'مدخل بيانات' },
      ],
      icon: 'lucide:shield-check',
      triggerClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  // Handlers
  const handleAdd = () => {
    router.push('/users/new');
  };

  const handleViewDetails = (user: User) => {
    selectedUser.value = user;
    showDetailsDialog.value = true;
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const openDeleteModal = (user: User) => {
    selectedUser.value = user;
    showDeleteDialog.value = true;
  };

  const confirmDelete = async () => {
    if (!selectedUser.value?.id) return;

    isDeleting.value = true;
    const success = await userStore.deleteUser(selectedUser.value.id);
    if (success) {
      showDeleteDialog.value = false;
      selectedUser.value = null;
    }
    isDeleting.value = false;
  };

  const cancelDelete = () => {
    showDeleteDialog.value = false;
    selectedUser.value = null;
  };

  const exportToExcel = () => {
    const headerLabels = ['اسم المستخدم', 'البريد الإلكتروني', 'الصلاحية', 'تاريخ الإنشاء'];
    const formattedData = users.value.map((user) => ({
      'اسم المستخدم': user.name || '',
      'البريد الإلكتروني': user.email || '',
      الصلاحية:
        user.role === 'ADMIN' ? 'مدير' : user.role === 'SUPERVISOR' ? 'مشرف' : 'مدخل بيانات',
      'تاريخ الإنشاء': user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('ar', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '',
    }));
    tableRef.value?.exportToExcel(formattedData, headerLabels, 'المستخدمين');
  };

  const handleCellClick = (data: { item: any; key: string }) => {
    handleViewDetails(data.item as User);
  };

  onMounted(async () => {
    await userStore.fetchUsers();
  });
</script>
