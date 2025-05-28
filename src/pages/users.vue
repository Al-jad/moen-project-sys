<template>
  <DefaultLayout>
    <main class="min-h-screen bg-background p-6">
      <div class="rounded-xl border border-border bg-card shadow-lg">
        <div class="p-8">
          <!-- Page Header -->
          <div class="mb-8 border-b border-border pb-6">
            <h1 class="mb-2 text-2xl font-bold text-foreground-heading">إدارة المستخدمين</h1>
            <p class="text-foreground-muted">إدارة وعرض جميع المستخدمين في النظام</p>
          </div>

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
                class="h-auto p-0 font-medium text-primary transition-colors hover:text-primary-hover"
                @click="$router.push(`/users/${item.id}`)"
              >
                {{ item.id }}
              </Button>
            </template>

            <template #role="{ item }">
              <Badge
                v-if="item.role === 'ADMIN'"
                class="w-fit border-0 bg-success font-medium text-success-foreground shadow-sm"
              >
                مدير
              </Badge>
              <Badge
                v-else-if="item.role === 'MANAGER'"
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

      <!-- User Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="border border-border bg-background shadow-xl sm:max-w-[36rem]">
          <DialogHeader>
            <DialogTitle class="text-right text-xl font-bold text-foreground-heading"
              >تفاصيل المستخدم</DialogTitle
            >
            <DialogDescription class="text-right text-foreground-muted">
              معلومات المستخدم الكاملة والتفصيلية
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-y-6 py-6">
            <div
              v-for="(field, index) in userDetailsFields"
              :key="index"
              class="grid grid-cols-[7.5rem_1fr] items-center gap-6 rounded-lg border border-border bg-background-surface/50 p-4"
            >
              <span class="text-right font-medium text-foreground-muted">{{ field.label }}</span>
              <span v-if="field.type !== 'badge'" class="font-medium text-foreground-body">{{
                selectedUser?.[field.key as keyof User]
              }}</span>
              <Badge
                v-else
                class="w-fit border-0 bg-success font-medium text-success-foreground shadow-sm"
              >
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
  import type { User } from '@/types';
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
      format: (role: string) => {
        if (role === 'admin') return 'مدير';
        if (role === 'manager') return 'مشرف';
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
      الصلاحية: user.role === 'admin' ? 'مدير' : user.role === 'manager' ? 'مشرف' : 'مدخل بيانات',
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
    axiosInstance.get('/api/auth/users').then((res: any) => {
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
