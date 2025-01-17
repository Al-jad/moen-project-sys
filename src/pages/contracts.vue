<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold">العقود</h1>
      </div>

      <!-- Controls Container -->
      <div class="p-6 bg-white rounded-lg">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-6">
            <Button variant="outline" class="px-2">
              <FileSpreadsheet class="w-4 h-4 ml-2" />
              تصدير Excel
            </Button>

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
                  <SelectItem v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="min-w-[200px]">
              <Select v-model="selectedContract">
                <SelectTrigger class="flex flex-row-reverse w-full">
                  <SelectValue placeholder="اختر العقد" dir="rtl">
                    <div class="flex items-center gap-2">
                      <FileText class="w-5 h-5 text-gray-400" />
                      <span>{{ selectedContract === 'all' ? 'اختر العقد' : getContractName(selectedContract) }}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem v-for="contract in contractsList" :key="contract.id" :value="contract.id">
                    {{ contract.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Popover>
              <PopoverTrigger>
                <Button variant="outline" class="flex justify-start w-56 text-black">
                  <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
                  {{ dateFrom ? formatDate(dateFrom) : 'من تاريخ الى' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="dateFrom" />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Search -->
          <div class="relative min-w-[240px]">
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="بحث سريع"
              class="pr-10 border-gray-200 placeholder:text-gray-400 focus:border-gray-200"
            />
            <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
              <Search class="text-gray-400 size-6" />
            </span>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="space-y-4">
          <Card v-for="contract in filteredContracts" :key="contract.id" class="p-6 transition-all hover:shadow-md">
            <div class="grid grid-cols-3 gap-6">
              <!-- Contract Number -->
              <div class="text-right">
                <p class="mb-2 text-sm text-muted-foreground">رقم العقد</p>
                <p class="text-lg font-medium">{{ contract.number }}</p>
              </div>
              
              <!-- Company -->
              <div class="text-center">
                <p class="mb-2 text-sm text-muted-foreground">الشركة المنفذة</p>
                <p class="text-lg font-medium">{{ contract.company }}</p>
              </div>
              
              <!-- Amount -->
              <div class="text-left">
                <p class="mb-2 text-sm text-muted-foreground">المبلغ العقد</p>
                <p class="text-lg font-medium">{{ contract.amount.toLocaleString() }}</p>
              </div>

              <!-- Sign Date -->
              <div class="text-right">
                <p class="mb-2 text-sm text-muted-foreground">تاريخ التوقيع</p>
                <p class="text-lg font-medium">{{ contract.signDate }}</p>
              </div>
              
              <!-- Referral Date -->
              <div class="text-center">
                <p class="mb-2 text-sm text-muted-foreground">تاريخ الاحالة</p>
                <p class="text-lg font-medium">{{ contract.referralDate }}</p>
              </div>
              
              <!-- Change Orders -->
              <div class="text-left">
                <p class="mb-2 text-sm text-muted-foreground">عدد الاوامر التغييرية</p>
                <p class="text-lg font-medium">({{ contract.changeOrders }})</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious :disabled="currentPage === 1" @click="currentPage--">
                  التالي
                </PaginationPrevious>
              </PaginationItem>

              <PaginationItem v-for="page in totalPages" :key="page">
                <PaginationLink :isActive="page === currentPage" @click="currentPage = page">
                  {{ page }}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext :disabled="currentPage === totalPages" @click="currentPage++">
                  السابق
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
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
import { Card } from '@/components/ui/card'
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { 
  Search, 
  FileText, 
  Settings2, 
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Folder
} from 'lucide-vue-next'

const searchQuery = ref('')
const currentPage = ref(1)
const selectedProject = ref('all')
const selectedContract = ref('all')
const dateFrom = ref('')
const itemsPerPage = 7

// Mock data for dropdowns
const projects = ref([
  { id: 1, name: 'مشروع A' },
  { id: 2, name: 'مشروع B' },
  { id: 3, name: 'مشروع C' },
])

const contractsList = ref([
  { id: 1, name: 'عقد A' },
  { id: 2, name: 'عقد B' },
  { id: 3, name: 'عقد C' },
])

// Sample contracts data
const contracts = ref([
  {
    id: 1,
    number: '23/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6
  },
  {
    id: 2,
    number: '24/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6
  },
  {
    id: 3,
    number: '25/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6
  }
])

// Methods
const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'dd/MM/yyyy', { locale: ar })
}

const getProjectName = (id) => {
  const project = projects.value.find(p => p.id === id)
  return project ? project.name : ''
}

const getContractName = (id) => {
  const contract = contractsList.value.find(c => c.id === id)
  return contract ? contract.name : ''
}

// Computed
const filteredContracts = computed(() => {
  let filtered = contracts.value

  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract => 
      contract.number.toLowerCase().includes(searchTerm) ||
      contract.company.toLowerCase().includes(searchTerm)
    )
  }

  if (selectedProject.value !== 'all') {
    filtered = filtered.filter(contract => contract.projectId === selectedProject.value)
  }

  if (selectedContract.value !== 'all') {
    filtered = filtered.filter(contract => contract.id === selectedContract.value)
  }

  if (dateFrom.value) {
    filtered = filtered.filter(contract => new Date(contract.signDate) >= dateFrom.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredContracts.value.length / itemsPerPage))
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>