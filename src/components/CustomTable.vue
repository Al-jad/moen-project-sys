<template>
  <div>
    <!-- Filters Section -->
    <div class="flex items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-6">
        <Button variant="outline" class="px-2" @click="$emit('export')">
          <FileSpreadsheet class="w-4 h-4 ml-2" />
          تصدير Excel
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" class="flex justify-start w-56 text-black">
              <CalendarIcon class="w-4 h-4 ml-2 text-gray-400" />
              {{ dateRange?.start ? dateRangeText : 'اختر التاريخ' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <RangeCalendar v-model="dateRange" :number-of-months="2" />
          </PopoverContent>
        </Popover>

        <div v-for="filter in filters" :key="filter.key" class="min-w-[200px]">
          <Select v-model="selectedFilters[filter.key]">
            <SelectTrigger class="flex flex-row-reverse w-full">
              <SelectValue :placeholder="filter.placeholder">
                <div class="flex items-center justify-end gap-2">
                  <span>{{ 
                    selectedFilters[filter.key] === 'all' ? 
                    filter.placeholder : 
                    filter.options.find(o => o.value === selectedFilters[filter.key])?.label 
                  }}</span>
                  <component :is="filter.icon" class="w-4 h-4 text-gray-400" />
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem 
                v-for="option in filter.options" 
                :key="option.value" 
                :value="option.value"
                class="text-right"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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

    <!-- Table Section -->
    <Table class="overflow-hidden border rounded-xl">
      <TableHeader>
        <TableRow class="bg-gray-100">
          <TableHead 
            v-for="column in columns" 
            :key="column.key"
            class="text-right text-gray-900"
            :class="{
              'first:rounded-tr-xl': column === columns[0],
              'last:rounded-tl-xl w-10': column === columns[columns.length - 1]
            }"
          >
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow 
          v-for="(item, index) in filteredData" 
          :key="index"
          class="hover:bg-gray-50/50"
          :class="{ 
            'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl': 
              index === filteredData.length - 1 
          }"
        >
          <TableCell 
            v-for="column in columns" 
            :key="column.key"
            :class="column.cellClass"
          >
            <slot 
              :name="column.key" 
              :item="item"
              :value="item[column.key]"
            >
              <template v-if="column.type === 'button'">
                <Button 
                  variant="link" 
                  class="h-auto p-0 text-blue-600"
                  @click="$emit('cell-click', { key: column.key, item })"
                >
                  {{ item[column.key] }}
                </Button>
              </template>
              <template v-else-if="column.type === 'action'">
                <slot name="action" :item="item">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    class="text-gray-400 hover:text-gray-600"
                    @click="$emit('action-click', item)"
                  >
                    <component :is="column.icon || Eye" class="w-4 h-4" />
                  </Button>
                </slot>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div class="flex items-center justify-center py-3 mt-4 border-t">
      <Pagination
        v-model="currentPage"
        :total="filteredData.length"
        :per-page="itemsPerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DateRange } from 'radix-vue'
import { Eye, Search, FileSpreadsheet, Calendar as CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Pagination from './Pagination.vue'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

interface Column {
  key: string
  label: string
  type?: 'text' | 'button' | 'action'
  icon?: any
  cellClass?: string
}

interface Filter {
  key: string
  placeholder: string
  options: { value: string, label: string }[]
  icon: any
}

interface Props {
  columns: Column[]
  data: any[]
  itemsPerPage?: number
  filters?: Filter[]
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 7,
  filters: () => []
})

const emit = defineEmits(['cell-click', 'action-click', 'filter-change', 'search-change', 'date-change', 'export'])

const currentPage = ref(1)
const searchQuery = ref('')
const dateRange = ref<DateRange>()
const selectedFilters = ref<Record<string, string>>({})

// Date formatting
const df = new DateFormatter('ar', { dateStyle: 'medium' })
const dateRangeText = computed(() => {
  if (!dateRange.value?.start) return ''

  if (!dateRange.value?.end) {
    return df.format(dateRange.value.start.toDate(getLocalTimeZone()))
  }

  return `${df.format(dateRange.value.start.toDate(getLocalTimeZone()))} - ${df.format(dateRange.value.end.toDate(getLocalTimeZone()))}`
})

// Filtered data
const filteredData = computed(() => {
  let result = [...props.data]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      )
    )
  }

  // Apply select filters
  Object.entries(selectedFilters.value).forEach(([key, value]) => {
    if (value && value !== 'all') {
      result = result.filter(item => item[key] === value)
    }
  })

  // Apply date filter
  if (dateRange.value?.start) {
    const start = dateRange.value.start.toDate(getLocalTimeZone())
    const end = dateRange.value.end?.toDate(getLocalTimeZone())
    
    result = result.filter(item => {
      const itemDate = new Date(item.date)
      if (itemDate < start) return false
      if (end && itemDate > end) return false
      return true
    })
  }

  return result
})

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredData.value.slice(start, end)
})

// Watch for filter changes
watch([searchQuery, selectedFilters, dateRange], ([newSearch, newFilters, newDate]) => {
  emit('search-change', newSearch)
  emit('filter-change', newFilters)
  emit('date-change', newDate)
  currentPage.value = 1 // Reset to first page when filters change
}, { deep: true })
</script> 