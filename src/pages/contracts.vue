<template>
  <DefaultLayout>
    <main class="p-6 bg-gray-50 dark:bg-[#0f172a]">
      <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-6">
              <Button
                variant="link"
                @click="$router.push('/')"
                class="flex items-center text-blue-600 dark:text-blue-400"
              >
                <ArrowRight class="w-4 h-4" />
                الرئيسية
              </Button>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">العقود</h1>
            </div>
          </div>

      <!-- Controls Container -->
      <div class="p-6 bg-white dark:bg-gray-800/95 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/50">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-6">
            <Button variant="outline" class="px-2">
              <FileSpreadsheet class="w-4 h-4 ml-2" />
              تصدير Excel
            </Button>

            <div class="min-w-[200px]">
              <CustomSelect
                v-model="selectedProject"
                :options="[
                  { value: 'all', label: 'الكل' },
                  ...projects.map(p => ({ value: p.id, label: p.name }))
                ]"
                placeholder="اختر المشروع"
                :triggerClass="'flex flex-row-reverse w-full'"
              >
              <template #icon>
                  <Folder class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </template>
              </CustomSelect>
            </div>

            <div class="min-w-[200px]">
              <CustomSelect
                v-model="selectedContract"
                :options="[
                  { value: 'all', label: 'الكل' },
                  ...contractsList.map(c => ({ value: c.id, label: c.name }))
                ]"
                placeholder="اختر العقد"
                :triggerClass="'flex flex-row-reverse w-full'"
              >
                <template #icon>
                  <FileText class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </template>
              </CustomSelect>
            </div>

            <Popover>
              <PopoverTrigger>
                <Button variant="outline" class="flex justify-start w-56 text-gray-700 dark:text-gray-200">
                  <CalendarIcon class="w-4 h-4 ml-2 text-gray-400 dark:text-gray-500" />
                  {{ date?.start ? dateRangeText : 'اختر التاريخ' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
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
              class="pr-10 border-gray-200 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-200 dark:focus:border-gray-700"
            />
            <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
              <Search class="text-gray-400 dark:text-gray-500 size-6" />
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
                <PaginationPrevious :disabled="currentPage === 1" @click="currentPage--" class="dark:text-gray-300">
                  التالي
                </PaginationPrevious>
              </PaginationItem>

              <PaginationItem v-for="page in totalPages" :key="page">
                <PaginationLink :isActive="page === currentPage" @click="currentPage = page" class="dark:text-gray-300 dark:hover:bg-gray-700/50">
                  {{ page }}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext :disabled="currentPage === totalPages" @click="currentPage++" class="dark:text-gray-300">
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
import CustomSelect from '@/components/CustomSelect.vue'

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