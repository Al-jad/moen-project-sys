<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-100">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-6">
            <Button
              variant="link"
              @click="$router.push('/')"
              class="flex items-center text-blue-600"
            >
              <ArrowRight class="w-4 h-4" />
              الرئيسية
            </Button>
            <h1 class="text-xl font-bold">سجل الاحداث</h1>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="mb-4 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <div class="flex items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-6">
              <Button variant="outline" class="px-2">
                <FileSpreadsheet class="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>

              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" class="flex justify-start w-56 text-black">
                    <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
                    {{ dateFrom ? formatDate(dateFrom) : 'اختر التاريخ' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="dateFrom" />
                </PopoverContent>
              </Popover>

              <div class="min-w-[200px]">
                <Select v-model="selectedProject">
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر المشروع" dir="rtl">
                      <div class="flex items-center gap-2">
                        <Folder class="w-5 h-5 text-gray-400" />
                        <span>{{ selectedProject === 'all' ? 'اختر المشروع' : getProjectName(selectedProject) }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">اسم المشروع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="min-w-[200px]">
                <Select v-model="selectedEmployee">
                  <SelectTrigger class="flex flex-row-reverse w-full">
                    <SelectValue placeholder="اختر الموظف" dir="rtl">
                      <div class="flex items-center gap-2">
                        <User class="w-5 h-5 text-gray-400" />
                        <span>{{ selectedEmployee === 'all' ? 'اختر الموظف' : getEmployeeName(selectedEmployee) }}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem v-for="employee in employees" :key="employee.id" :value="employee.id">
                      {{ employee.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div class="relative min-w-[240px]">
              <Input 
                v-model="search"
                type="text" 
                placeholder="بحث سريع" 
                class="pr-10 border-gray-200 focus:border-gray-200 placeholder:text-gray-400" 
              />
              <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
                <Search class="text-gray-400 size-6" />
              </span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden bg-white border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-right">اسم الموظف</TableHead>
                  <TableHead class="text-right">المشروع</TableHead>
                  <TableHead class="text-right">تاريخ التعديل</TableHead>
                  <TableHead class="text-right">وقت التعديل</TableHead>
                  <TableHead class="text-right">حقل التعديل</TableHead>
                  <TableHead class="text-right">القيمة السابقة</TableHead>
                  <TableHead class="text-right">القيمة الجديدة</TableHead>
                  <TableHead class="text-right">عرض</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-50">
                  <TableCell>{{ log.employee_name }}</TableCell>
                  <TableCell class="text-primary">{{ log.project_name }}</TableCell>
                  <TableCell>{{ log.date }}</TableCell>
                  <TableCell>{{ log.time }}</TableCell>
                  <TableCell>{{ log.field }}</TableCell>
                  <TableCell>{{ log.old_value }}</TableCell>
                  <TableCell>{{ log.new_value }}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" @click="viewDetails(log)">
                      <Eye class="w-5 h-5" />
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
                    <PaginationPrevious 
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    />
                  </PaginationItem>
                  
                  <PaginationItem v-for="page in totalPages" :key="page">
                    <PaginationLink 
                      :isActive="page === currentPage"
                      @click="currentPage = page"
                    >
                      {{ page }}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- View Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل التعديل</DialogTitle>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">الموظف</Label>
              <div class="col-span-3">
                {{ selectedLog?.employee_name }}
              </div>
            </div>
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">المشروع</Label>
              <div class="col-span-3">
                {{ selectedLog?.project_name }}
              </div>
            </div>
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">التاريخ والوقت</Label>
              <div class="col-span-3">
                {{ selectedLog?.date }} {{ selectedLog?.time }}
              </div>
            </div>
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">حقل التعديل</Label>
              <div class="col-span-3">
                {{ selectedLog?.field }}
              </div>
            </div>
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">القيمة السابقة</Label>
              <div class="col-span-3">
                {{ selectedLog?.old_value }}
              </div>
            </div>
            <div class="grid items-center grid-cols-4 gap-4">
              <Label class="text-right">القيمة الجديدة</Label>
              <div class="col-span-3">
                {{ selectedLog?.new_value }}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  User, 
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Eye,
  ArrowRight,
  Folder
} from 'lucide-vue-next'

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

// State
const search = ref('')
const selectedProject = ref('all')
const selectedEmployee = ref('all')
const dateFrom = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showDetailsDialog = ref(false)
const selectedLog = ref(null)

// Mock data - replace with actual API calls
const logs = ref([
  {
    id: 1,
    employee_name: 'محمد انور',
    project_name: 'اسم المشروع',
    date: '2024/10/25',
    time: '10:33 ص',
    field: 'السعر',
    old_value: '1100$',
    new_value: '52145825'
  },
  {
    id: 2,
    employee_name: 'محمد انور',
    project_name: 'اسم المشروع',
    date: '2024/10/25',
    time: '10:33 ص',
    field: 'السعر',
    old_value: '1100$',
    new_value: '52145825'
  },
  {
    id: 3,
    employee_name: 'محمد انور',
    project_name: 'اسم المشروع',
    date: '2024/10/25',
    time: '10:33 ص',
    field: 'السعر',
    old_value: '1100$',
    new_value: '52145825'
  },
  {
    id: 4,
    employee_name: 'محمد انور',
    project_name: 'اسم المشروع',
    date: '2024/10/25',
    time: '10:33 ص',
    field: 'السعر',
    old_value: '1100$',
    new_value: '52145825'
  },
  {
    id: 5,
    employee_name: 'محمد انور',
    project_name: 'اسم المشروع',
    date: '2024/10/25',
    time: '10:33 ص',
    field: 'السعر',
    old_value: '1100$',
    new_value: '52145825'
  }
])

// Mock data for dropdowns
const projects = ref([
  { id: 1, name: 'مشروع A' },
  { id: 2, name: 'مشروع B' },
  { id: 3, name: 'مشروع C' },
])

const employees = ref([
  { id: 1, name: 'موظف 1' },
  { id: 2, name: 'موظف 2' },
])

// Computed properties
const filteredLogs = computed(() => {
  let filtered = logs.value

  if (search.value) {
    filtered = filtered.filter(log => 
      log.employee_name.includes(search.value) ||
      log.project_name.includes(search.value)
    )
  }

  if (selectedProject.value && selectedProject.value !== 'all') {
    filtered = filtered.filter(log => log.project_name === getProjectName(selectedProject.value))
  }

  if (selectedEmployee.value && selectedEmployee.value !== 'all') {
    filtered = filtered.filter(log => log.employee_name === getEmployeeName(selectedEmployee.value))
  }

  if (dateFrom.value) {
    filtered = filtered.filter(log => log.date >= dateFrom.value)
  }

  return filtered
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredLogs.value.length / itemsPerPage)
)

// Methods
const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'dd/MM/yyyy', { locale: ar })
}

const getProjectName = (id) => {
  const project = projects.value.find(p => p.id === id)
  return project ? project.name : ''
}

const getEmployeeName = (id) => {
  const employee = employees.value.find(e => e.id === id)
  return employee ? employee.name : ''
}

const exportToExcel = () => {
  // Implement Excel export functionality
  console.log('Exporting to Excel...')
}

const viewDetails = (log) => {
  selectedLog.value = log
  showDetailsDialog.value = true
}
</script>