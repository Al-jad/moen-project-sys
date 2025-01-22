<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-gray-200 dark:bg-gray-900">
      <div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-6">
            <BackToMainButton />
            <h1 class="text-xl font-bold dark:text-white">قائمة المستخدمين</h1>
          </div>
          <PrimaryButton 
            variant="primary"
          >
            <UserPlus class="w-4 h-4" />
            اضافة مستخدم جديد
          </PrimaryButton>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6">
          <CustomTable
            :columns="columns"
            :data="users"
            :filters="filters"
            @export="exportToExcel"
            @cell-click="handleCellClick"
            @action-click="viewUserDetails"
          >
            <template #name="{ value }">
              <Button 
                variant="link" 
                class="h-auto p-0 text-blue-600 dark:text-blue-400"
                @click="$router.push('/users/1')"
              >
                {{ value }}
              </Button>
            </template>
          </CustomTable>
        </div>
      </div>

      <!-- User Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle class="text-right dark:text-white">تفاصيل المستخدم</DialogTitle>
            <DialogDescription class="text-right dark:text-gray-400">
              معلومات المستخدم الكاملة
            </DialogDescription>
          </DialogHeader>
          <div class="grid py-4 gap-y-4">
            <div v-for="(field, index) in userDetailsFields" :key="index" class="grid grid-cols-[120px_1fr] items-center gap-4">
              <span class="text-right text-gray-500 dark:text-gray-400">{{ field.label }}</span>
              <span v-if="field.type !== 'badge'" class="dark:text-gray-300">{{ selectedUser?.[field.key] }}</span>
              <Badge v-else variant="success" class="font-medium w-fit dark:bg-green-500/20">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackToMainButton from '@/components/BackToMainButton.vue';
import {
  Building2,
  ShieldCheck,
  Eye,
  UserPlus,
} from 'lucide-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CustomTable from '@/components/CustomTable.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import PrimaryButton from '@/components/PrimaryButton.vue'

const router = useRouter()

// Table configuration
interface Column {
  key: string
  label: string
  type?: 'text' | 'button' | 'action'
  icon?: any
  cellClass?: string
}

const columns: Column[] = [
  { key: 'name', label: 'اسم الموظف', type: 'button' },
  { key: 'department', label: 'الدائرة' },
  { key: 'section', label: 'القسم' },
  { key: 'division', label: 'الشعبة' },
  { key: 'role', label: 'الصلاحية' },
  { key: 'project', label: 'المشروع' },
  { key: 'actions', label: '', type: 'action', icon: Eye }
]

const filters = [
  {
    key: 'department',
    placeholder: 'اختر الدائرة',
    options: [
      { value: 'all', label: 'الكل' },
      { value: '1', label: 'دائرة حماية وتحسين البيئة' }
    ],
    icon: Building2,
    triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  },
  {
    key: 'role',
    placeholder: 'اختر الصلاحية',
    options: [
      { value: 'all', label: 'الكل' },
      { value: '1', label: 'مدير مشروع' }
    ],
    icon: ShieldCheck,
    triggerClass: 'flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
]

// Mock data
const users = ref(Array(7).fill(null).map((_, index) => ({
  id: index + 1,
  name: index % 2 === 0 ? 'محمد انور' : 'دعاء الشيخلي',
  department: 'دائرة حماية وتحسين البيئة',
  section: 'قسم المشاريع',
  division: 'شعبة المتابعة',
  role: 'مدير مشروع',
  project: 'تجهيز وتنصيب وتشغيل محطات الأنواء الجوية',
  addDate: '2024/10/25',
  status: 'فعال'
})))

// User details configuration
const userDetailsFields = [
  { key: 'name', label: 'الاسم الكامل' },
  { key: 'department', label: 'الدائرة' },
  { key: 'section', label: 'القسم' },
  { key: 'division', label: 'الشعبة' },
  { key: 'role', label: 'الصلاحية' },
  { key: 'addDate', label: 'تاريخ الاضافة' },
  { key: 'status', label: 'الحالة', type: 'badge' }
]

// State
const showDetailsDialog = ref(false)
const selectedUser = ref(null)

// Methods
const exportToExcel = () => {
  console.log('Exporting to Excel...')
}

const handleCellClick = ({ key, item }) => {
  if (key === 'name') {
    router.push(`/users/${item.id}`)
  }
}

const viewUserDetails = (user) => {
  selectedUser.value = user
  showDetailsDialog.value = true
}
</script>
