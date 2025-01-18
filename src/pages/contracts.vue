<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50">
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
              <h1 class="text-xl font-bold">العقود</h1>
            </div>
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
                  {{ date?.start ? dateRangeText : 'اختر التاريخ' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <RangeCalendar v-model="date" :number-of-months="2" />
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
        <div class="space-y-3">
          <ContractCard 
            v-for="contract in filteredContracts" 
            :key="contract.id"
            :contract="contract"
            @show-details="$router.push(`/contract-details/${contract.id}`)"
          />
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

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import type { DateRange } from 'radix-vue'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ContractCard from '@/components/ContractCard.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
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
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Folder
} from 'lucide-vue-next'

interface Project {
  id: string
  name: string
}

interface ContractListItem {
  id: string
  name: string
}

interface Contract {
  id: number
  number: string
  company: string
  amount: number
  signDate: string
  referralDate: string
  changeOrders: number
  projectId?: string
}

const searchQuery = ref('')
const currentPage = ref(1)
const selectedProject = ref<string>('all')
const selectedContract = ref<string>('all')
const date = ref<DateRange>()
const itemsPerPage = 7

const df = new DateFormatter('ar', { dateStyle: 'medium' })

const dateRangeText = computed(() => {
  if (!date.value?.start) return ''

  if (!date.value?.end) {
    return df.format(date.value.start.toDate(getLocalTimeZone()))
  }

  return `${df.format(date.value.start.toDate(getLocalTimeZone()))} - ${df.format(date.value.end.toDate(getLocalTimeZone()))}`
})

// Mock data for dropdowns
const projects = ref<Project[]>([
  { id: '1', name: 'مشروع A' },
  { id: '2', name: 'مشروع B' },
  { id: '3', name: 'مشروع C' },
])

const contractsList = ref<ContractListItem[]>([
  { id: '1', name: 'عقد A' },
  { id: '2', name: 'عقد B' },
  { id: '3', name: 'عقد C' },
])

// Update the contracts data with projectId
const contracts = ref<Contract[]>([
  {
    id: 1,
    number: '23/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6,
    projectId: '1'
  },
  {
    id: 2,
    number: '24/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6,
    projectId: '2'
  },
  {
    id: 3,
    number: '25/2025',
    company: 'شركة الاتحاد الجاد للبرمجيات',
    amount: 23333000,
    signDate: '8/07/2025',
    referralDate: '6/07/2025',
    changeOrders: 6,
    projectId: '3'
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

// Update the filteredContracts computed to handle type checking
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
    filtered = filtered.filter(contract => contract.id === Number(selectedContract.value))
  }

  if (date.value?.start) {
    const startDate = date.value.start.toDate(getLocalTimeZone())
    const endDate = date.value.end?.toDate(getLocalTimeZone())
    
    filtered = filtered.filter(contract => {
      const contractDate = new Date(contract.signDate)
      if (contractDate < startDate) return false
      if (endDate && contractDate > endDate) return false
      return true
    })
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