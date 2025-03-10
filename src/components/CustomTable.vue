<template>
  <div>
    <!-- Filters Section -->
    <div
      v-if="showExport || showDateFilter || showSearch || filters.length > 0"
      class="mb-8 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-6">
          <Button
            v-if="showExport"
            variant="outline"
            class="px-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            :class="isExportPremium ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'"
            :disabled="!isExportPremium"
            @click="$emit('export')"
          >

            <Icon icon="lucide:file-spreadsheet" class="ml-2 h-4 w-4" :class="isExportPremium ? 'text-red-500' : ''"/>
            <span :class="isExportPremium ? 'text-red-500' : ''">تصدير Excel</span>
            <div v-if="isExportPremium" class="text-red-500 text-xs flex items-center gap-1">
              <span> – هذه الميزة غير متوفرة حاليا</span>
              <Icon icon="lucide:lock" class="h-4 w-4" />
            </div>
        </Button>

        <DateRangeInput v-if="showDateFilter" v-model="dateRange" />

        <div v-for="filter in filters" :key="filter.key" class="min-w-[200px]">
          <CustomSelect
            v-model="selectedFilters[filter.key]"
            :options="filter.options"
            :placeholder="filter.placeholder"
            :TriggerIcon="filter.icon"
            :trigger-class="filter.triggerClass"
          />
        </div>
      </div>

      <div v-if="showSearch" class="relative min-w-[240px]">
        <CustomInput v-model="searchQuery" placeholder="بحث سريع" :icon="'lucide:search'" />
      </div>
    </div>

    <!-- Table Section -->
    <Table class="overflow-hidden rounded-xl border dark:border-gray-700">
      <TableHeader>
        <TableRow class="bg-gray-100 dark:bg-gray-900">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            class="text-right text-gray-900 dark:text-gray-300"
            :class="{
              'first:rounded-tr-xl': column === columns[0],
              'w-10 last:rounded-tl-xl': column === columns[columns.length - 1],
            }"
          >
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow>
            <TableCell :colspan="columns.length" class="py-10 text-center">
              <div class="flex flex-col items-center justify-center">
                <div
                  class="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
                ></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">جاري التحميل...</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="filteredData.length === 0">
          <TableRow>
            <TableCell :colspan="columns.length" class="py-10 text-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">لا توجد بيانات</span>
            </TableCell>
          </TableRow>
        </template>
        <TableRow
          v-else
          v-for="(item, index) in filteredData"
          :key="index"
          class="hover:bg-gray-50/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
          :class="{
            'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl':
              index === filteredData.length - 1,
          }"
        >
          <TableCell v-for="column in columns" :key="column.key" :class="column.cellClass">
            <slot :name="column.key" :item="item" :value="item[column.key]">
              <template v-if="column.type === 'button'">
                <Button
                  variant="link"
                  class="h-auto p-0 text-blue-600 dark:text-blue-400"
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
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    @click="$emit('action-click', item)"
                  >
                    <Icon :icon="column.icon || 'lucide:eye'" class="h-4 w-4" />
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
    <div class="mt-4 flex items-center justify-center border-t py-3 dark:border-gray-700">
      <Pagination v-model="currentPage" :total="filteredData.length" :per-page="itemsPerPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Icon } from '@iconify/vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import CustomInput from './CustomInput.vue';
  import Pagination from './CustomPagination.vue';
  import CustomSelect from './CustomSelect.vue';
  import DateRangeInput from './DateRangeInput.vue';

  interface Column {
    key: string;
    label: string;
    type?: 'text' | 'button' | 'action';
    icon?: string;
    cellClass?: string;
  }

  interface FilterOption {
    value: string;
    label: string;
    icon?: string;
  }

  interface Filter {
    key: string;
    placeholder: string;
    options: FilterOption[];
    icon: string;
    triggerClass?: string;
  }

  interface Props {
    columns: Column[];
    data: any[];
    itemsPerPage?: number;
    filters?: Filter[];
    showExport?: boolean;
    showDateFilter?: boolean;
    showSearch?: boolean;
    initialFilters?: Record<string, string>;
    loading?: boolean;
    isExportPremium?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    itemsPerPage: 7,
    filters: () => [],
    showExport: true,
    showDateFilter: true,
    showSearch: true,
    initialFilters: () => ({}),
    loading: false,
    isExportPremium: false,
  });

  const emit = defineEmits([
    'cell-click',
    'action-click',
    'filter-change',
    'search-change',
    'date-change',
    'export',
  ]);

  const currentPage = ref(1);
  const searchQuery = ref('');
  const dateRange = ref<DateRange>();

  // Initialize selectedFilters with default values from props.filters
  const selectedFilters = ref<Record<string, string>>(
    props.filters.reduce(
      (acc, filter) => {
        acc[filter.key] = props.initialFilters[filter.key] || 'all';
        return acc;
      },
      {} as Record<string, string>
    )
  );

  console.log('Initial selectedFilters:', selectedFilters.value);

  // Still keep the onMounted hook to ensure values are updated if props change
  onMounted(() => {
    console.log('CustomTable onMounted, props.filters:', props.filters);
    console.log('CustomTable onMounted, props.initialFilters:', props.initialFilters);
    props.filters.forEach((filter) => {
      if (!selectedFilters.value[filter.key]) {
        selectedFilters.value[filter.key] = props.initialFilters[filter.key] || 'all';
      }
    });
    console.log(
      'CustomTable onMounted, selectedFilters after initialization:',
      selectedFilters.value
    );
  });

  // Date formatting
  const df = new DateFormatter('ar', { dateStyle: 'medium' });
  const dateRangeText = computed(() => {
    if (!dateRange.value?.start) return '';

    if (!dateRange.value?.end) {
      return df.format(dateRange.value.start.toDate(getLocalTimeZone()));
    }

    return `${df.format(dateRange.value.start.toDate(getLocalTimeZone()))} - ${df.format(dateRange.value.end.toDate(getLocalTimeZone()))}`;
  });

  // Filtered data
  const filteredData = computed(() => {
    let result = [...props.data];

    // Apply search filter - search across all fields
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((item) => {
        // Check all properties of the item for a match
        return Object.entries(item).some(([key, value]) => {
          // Skip searching in objects or arrays
          if (typeof value === 'object' && value !== null) return false;

          // Convert value to string and check if it includes the query
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // Apply select filters - skip projectId as it's handled by the API
    Object.entries(selectedFilters.value).forEach(([key, value]) => {
      // Skip projectId filtering as it's handled by the API
      if (key === 'projectId') return;

      if (value && value !== 'all') {
        result = result.filter((item) => item[key] === value);
      }
    });

    // Apply date filter
    if (dateRange.value?.start) {
      const start = dateRange.value.start.toDate(getLocalTimeZone());
      const end = dateRange.value.end?.toDate(getLocalTimeZone());

      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        if (itemDate < start) return false;
        if (end && itemDate > end) return false;
        return true;
      });
    }

    return result;
  });

  // Paginated data
  const paginatedData = computed(() => {
    console.log('Computing paginatedData, filteredData:', filteredData.value);
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    const result = filteredData.value.slice(start, end);
    console.log('Computing paginatedData, result:', result);
    return result;
  });

  // Watch for filter changes
  watch(
    [searchQuery, selectedFilters, dateRange],
    ([newSearch, newFilters, newDate], [oldSearch, oldFilters, oldDate]) => {
      // Only emit search-change, don't trigger filter-change for search
      if (newSearch !== oldSearch) {
        emit('search-change', newSearch);
      }

      // Only emit filter-change when filters change (not when search changes)
      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        emit('filter-change', newFilters);
      }

      // Only emit date-change when date changes
      if (JSON.stringify(newDate) !== JSON.stringify(oldDate)) {
        emit('date-change', newDate);
      }

      currentPage.value = 1; // Reset to first page when filters change
    },
    { deep: true }
  );
</script>
