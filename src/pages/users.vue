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
                  <h1 class="mb-2 text-2xl font-bold text-foreground-heading">إدارة المستخدمين</h1>
                </div>
                <p class="text-foreground-muted">إدارة وعرض جميع المستخدمين في النظام</p>
              </div>
              <div class="flex items-center gap-4">
                <PrimaryButton>
                  <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
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
                class="inline-flex items-center gap-1 font-medium transition-colors text-primary hover:text-primary-hover hover:underline"
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
                class="font-medium border-0 shadow-sm w-fit bg-success text-success-foreground"
              >
                مدير
              </Badge>
              <Badge
                v-else-if="item.role === 'SUPERVISOR'"
                class="font-medium border-0 shadow-sm w-fit bg-accent text-accent-foreground"
              >
                مشرف
              </Badge>
              <Badge
                v-else
                class="font-medium border-0 shadow-sm w-fit bg-secondary text-secondary-foreground"
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
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Badge } from '@/components/ui/badge';
  import UserDetailsModal from '@/components/UserDetailsModal.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { useUserStore } from '@/stores/useUserStore';
  import type { User } from '@/types/users';
  import { Icon } from '@iconify/vue';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';

  const userStore = useUserStore();
  const { users, isLoading, selectedUser } = storeToRefs(userStore);

  const showDetailsDialog = ref(false);

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

  const handleViewDetails = (user: User) => {
    selectedUser.value = user;
    showDetailsDialog.value = true;
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
