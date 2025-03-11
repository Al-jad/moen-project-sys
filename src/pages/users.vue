<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="p-6">
          <CustomTable
            :columns="columns"
            :data="users"
            :filters="filters"
            @export="exportToExcel"
            :is-export-premium="true"
            @cell-click="handleCellClick"
            @action-click="viewUserDetails"
          >
            <template #id="{ value }">
              <Button
                variant="link"
                class="h-auto p-0 text-blue-600 dark:text-blue-400"
                @click="$router.push(`/users/${value}`)"
              >
                {{ value }}
              </Button>
            </template>

            <template #role="{ value }">
              <Badge v-if="value === 'ADMIN'" variant="success" class="w-fit font-medium text-white bg-green-500 dark:bg-green-500/20">
                مدير
              </Badge>
              <Badge v-else-if="value === 'SUPERVISOR'" class="w-fit font-medium text-white bg-gray-500 dark:bg-gray-500/20 dark:text-gray-300">
                مشرف
              </Badge>
              <Badge v-else class="w-fit font-medium text-white dark:bg-gray-500/20 dark:text-gray-300">
                مدخل بيانات
              </Badge>
            </template>

            <template #createdAt="{ value }">
              <div>
                {{ new Date(value).toLocaleDateString('ar', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
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
                selectedUser?.[field.key]
              }}</span>
              <Badge v-else variant="success" class="w-fit font-medium dark:bg-green-500/20">
                {{ selectedUser?.[field.key] }}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomTable from '@/components/CustomTable.vue';
  import PrimaryButton from '@/components/PrimaryButton.vue';
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
import { onMounted, ref } from 'vue';
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

  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }

  const users = ref([])

  // User details configuration
  const userDetailsFields = [
    { key: 'name', label: 'الاسم الكامل' },
    { key: 'email', label: 'الايميل' },
    { key: 'role', label: 'الصلاحية' },
    { key: 'createdAt', label: 'تاريخ الاضافة' },
  ];

  // State
  const showDetailsDialog = ref(false);
  const selectedUser = ref<User | null>(null);

  // Methods
  const exportToExcel = () => {
    console.log('Exporting to Excel...');
  };

  function getUsers() {
    axiosInstance.get('/api/auth/users').then((res) => {
      users.value = res.data;
    });
  }

  const handleCellClick = ({ key, item }: { key: string; item: User }) => {
    if (key === 'name') {
      router.push(`/users/${item.id}`);
    }
  };

  const viewUserDetails = (user: User) => {
    selectedUser.value = user;
    showDetailsDialog.value = true;
  };

  onMounted(() => {
    getUsers();
  });
</script>
