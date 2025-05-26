<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            ref="tableRef"
            :columns="columns"
            :data="users"
            :filters="filters"
            @export="exportToExcel"
            @cell-click="handleCellClick"
            @action-click="viewUserDetails"
            :isExportPremium="false"
          >
            <template #id="{ item }">
              <Button
                variant="link"
                class="h-auto p-0 text-blue-600 dark:text-blue-400"
                @click="$router.push(`/users/${item.id}`)"
              >
                {{ item.id }}
              </Button>
            </template>

            <template #role="{ item }">
              <Badge
                v-if="item.role === 'admin'"
                variant="success"
                class="w-fit bg-green-500 font-medium text-white dark:bg-green-500/20"
              >
                مدير
              </Badge>
              <Badge
                v-else-if="item.role === 'supervisor'"
                class="w-fit bg-gray-500 font-medium text-white dark:bg-gray-500/20 dark:text-gray-300"
              >
                مشرف
              </Badge>
              <Badge
                v-else
                class="w-fit font-medium text-white dark:bg-gray-500/20 dark:text-gray-300"
              >
                مدخل بيانات
              </Badge>
            </template>

            <template #createdAt="{ item }">
              <div>
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

      <!-- User Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="dark:border-gray-700 dark:bg-gray-800 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle class="text-right dark:text-white">تفاصيل المستخدم</DialogTitle>
            <DialogDescription class="text-right dark:text-gray-400">
              معلومات المستخدم الكاملة
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-y-4 py-4">
            <div
              v-for="(field, index) in userDetailsFields"
              :key="index"
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <span class="text-right text-gray-500 dark:text-gray-400">{{ field.label }}</span>
              <span v-if="field.type !== 'badge'" class="dark:text-gray-300">{{
                selectedUser?.[field.key as keyof User]
              }}</span>
              <Badge v-else variant="success" class="w-fit font-medium dark:bg-green-500/20">
                {{ selectedUser?.[field.key as keyof User] }}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import CustomTable from '@/components/CustomTable.vue';
  import { Badge } from '@/components/ui/badge';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import axiosInstance from '@/plugins/axios';
  import type { User, UserRole } from '@/types';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // Table configuration
  interface Column {
    key: string;
    label: string;
    type?: 'text' | 'button' | 'action';
    icon?: string;
    cellClass?: string;
  }

  const columns: Column[] = [
    { key: 'name', label: 'اسم الموظف', type: 'button' },
    { key: 'email', label: 'الايميل' },
    { key: 'role', label: 'الصلاحية' },
    { key: 'createdAt', label: 'تاريخ الاضافة' },
    // { key: 'department', label: 'الدائرة' },
    // { key: 'section', label: 'القسم' },
    // { key: 'division', label: 'الشعبة' },
    // { key: 'project', label: 'المشروع' },
    // { key: 'actions', label: '', type: 'action', icon: 'lucide:eye' },
  ];

  interface Filter {
    key: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    icon: string;
    triggerClass?: string;
  }

  const filters: Filter[] = [
    {
      key: 'department',
      placeholder: 'اختر الدائرة',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'دائرة حماية وتحسين البيئة' },
      ],
      icon: 'lucide:building-2',
      triggerClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
    {
      key: 'role',
      placeholder: 'اختر الصلاحية',
      options: [
        { value: 'all', label: 'الكل' },
        { value: '1', label: 'مدير مشروع' },
      ],
      icon: 'lucide:shield-check',
      triggerClass: 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    },
  ];

  const users = ref<User[]>([]);

  // User details configuration
  const userDetailsFields = computed(() => [
    { label: 'الاسم الكامل', key: 'username' },
    { label: 'اسم المستخدم', key: 'username' },
    { label: 'الايميل', key: 'email' },
    {
      label: 'الدور',
      key: 'role',
      format: (role: UserRole) => {
        if (role === UserRole.ADMIN) return 'مدير';
        if (role === UserRole.MANAGER) return 'مشرف';
        return 'مدخل بيانات';
      },
    },
    {
      label: 'تاريخ الاضافة',
      key: 'createdAt',
      format: (date: string) =>
        date
          ? new Date(date).toLocaleDateString('ar', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '',
    },
  ]);

  // State
  const showDetailsDialog = ref(false);
  const selectedUser = ref<User | null>(null);

  // Methods
  const exportToExcel = () => {
    const headerLabels = ['اسم الموظف', 'الايميل', 'الصلاحية', 'تاريخ الاضافة'];
    const formattedData = users.value.map((user: User) => ({
      'اسم الموظف':
        user.username ||
        (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''),
      الايميل: user.email || '',
      الصلاحية:
        user.role === 'admin' ? 'مدير' : user.role === 'supervisor' ? 'مشرف' : 'مدخل بيانات',
      'تاريخ الاضافة': user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('ar', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '',
    }));
    const tableRef = ref();
    tableRef.value?.exportToExcel(formattedData, headerLabels, 'المستخدمين');
  };

  function getUsers() {
    axiosInstance.get('/api/auth/users').then((res) => {
      users.value = res.data;
    });
  }

  const handleCellClick = (row: Record<string, any>, key: string) => {
    if (key === 'name') {
      router.push(`/users/${(row as User).id}`);
    }
  };

  const viewUserDetails = (action: string, row: Record<string, any>) => {
    selectedUser.value = row as User;
    showDetailsDialog.value = true;
  };

  onMounted(() => {
    getUsers();
  });
</script>
