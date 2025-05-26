<template>
  <div class="min-h-screen overflow-x-auto">
    <!-- Filters Section -->
    <div
      v-if="showExport || showDateFilter || showSearch || filters.length > 0"
      class="mb-8 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-6">
        <Button
          v-if="showExport"
          variant="outline"
          class="border-border bg-background-card px-2"
          :class="isExportPremium ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'"
          :disabled="isExportPremium"
          @click="$emit('export')"
        >
          <Icon
            icon="lucide:file-spreadsheet"
            class="ml-2 h-4 w-4"
            :class="isExportPremium ? 'text-red-500' : 'text-green-500'"
          />
          <span :class="isExportPremium ? 'text-red-500' : 'text-green-500'">تصدير Excel</span>
          <div v-if="isExportPremium" class="flex items-center gap-1 text-xs text-red-500">
            <span> – هذه الميزة غير متوفرة حاليا</span>
            <Icon icon="lucide:lock" class="h-4 w-4" />
          </div>
        </Button>

        <DateRangeInput v-if="showDateFilter" v-model="dateRange" :isPremium="isPremium" />

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
    <Table class="overflow-hidden rounded-xl border-border">
      <TableHeader>
        <TableRow class="bg-background-surface">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            class="whitespace-nowrap text-right font-medium text-gray-700 dark:text-gray-300"
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
                  class="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
                ></div>
                <span class="text-sm text-muted-foreground">جاري التحميل...</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="filteredData.length === 0">
          <TableRow>
            <TableCell :colspan="columns.length" class="py-10 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <Icon icon="lucide:inbox" class="h-8 w-8 text-gray-400" />
                <span class="text-sm text-muted-foreground">لا توجد بيانات</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow
          v-else
          v-for="(item, index) in paginatedData"
          :key="index"
          class="transition-colors hover:bg-background-hover"
          :class="{
            'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl':
              index === paginatedData.length - 1,
          }"
        >
          <TableCell
            v-for="column in columns"
            :key="column.key"
            :class="[column.cellClass, column.width ? `w-[${column.width}]` : '', 'py-3']"
          >
            <slot :name="column.key" :item="item" :value="item[column.key]">
              <template v-if="column.type === 'button'">
                <Button
                  variant="link"
                  class="h-auto p-0 text-primary hover:text-primary/80"
                  @click="emit('cell-click', { key: column.key, item })"
                >
                  {{ item[column.key] }}
                </Button>
              </template>
              <template v-else-if="column.type === 'actions'">
                <div class="flex items-center gap-2">
                  <Button
                    v-for="action in column.actions"
                    :key="action.key"
                    :variant="action.variant || 'ghost'"
                    size="icon"
                    :class="
                      action.class || 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    "
                    @click="emit('action-click', action.key, item)"
                  >
                    <Icon :icon="action.icon" class="h-4 w-4" />
                  </Button>
                </div>
              </template>
              <template v-else-if="column.type === 'action'">
                <slot name="action" :item="item">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    @click="emit('action-click', 'view', item)"
                  >
                    <Icon :icon="column.icon || 'lucide:eye'" class="h-4 w-4" />
                  </Button>
                </slot>
              </template>
              <template v-else-if="column.type === 'custom'">
                <slot :name="column.key" :item="item">
                  {{ item[column.key] }}
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
    <div class="mt-4 flex items-center justify-between border-t py-3 dark:border-gray-700">
      <Pagination v-model="currentPage" :total="filteredData.length" :per-page="itemsPerPage" />
      <div class="whitespace-nowrap text-sm text-gray-500">
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} من
        {{ filteredData.length }} نتيجة
      </div>
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
  import { useToast } from '@/composables/useToast';
  import { Icon } from '@iconify/vue';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  import type { DateRange } from 'radix-vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import * as XLSX from 'xlsx';
  import CustomInput from './CustomInput.vue';
  import Pagination from './CustomPagination.vue';
  import CustomSelect from './CustomSelect.vue';
  import DateRangeInput from './DateRangeInput.vue';

  interface FileType {
    type: string;
    icon: string;
    color: string;
  }

  interface Attachment {
    id: number;
    title: string;
    description: string;
    url: string;
    createdAt: string;
    fileType: string;
    date?: string;
    [key: string]: any;
  }

  interface Action {
    key: string;
    icon: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    class?: string;
  }

  interface Column {
    key: string;
    label: string;
    type?: 'text' | 'button' | 'action' | 'actions' | 'custom';
    icon?: string;
    cellClass?: string;
    width?: string;
    actions?: Action[];
  }

  interface TableItem extends Record<string, any> {
    date?: string;
    [key: string]: any;
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
    data: Record<string, any>[];
    items?: Attachment[];
    itemsPerPage?: number;
    filters?: Filter[];
    showExport?: boolean;
    showDateFilter?: boolean;
    isPremium?: boolean;
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
    isPremium: false,
    showSearch: true,
    initialFilters: () => ({}),
    loading: false,
    isExportPremium: false,
    items: () => [],
  });

  const emit = defineEmits<{
    'cell-click': [{ key: string; item: TableItem }];
    'action-click': [action: string, row: TableItem];
    'filter-change': [filters: Record<string, string>];
    'search-change': [query: string];
    'date-change': [range: DateRange | null];
    export: [];
  }>();

  const currentPage = ref(1);
  const searchQuery = ref('');
  const dateRange = ref<DateRange>();

  const { showSuccess, showError } = useToast();

  // Export function
  const exportToExcel = (data: any[], headers: string[], fileName: string) => {
    try {
      // Create worksheet data
      const wsData = [
        headers, // Headers row
        ...data.map((item) => {
          // Map each item to match the header order
          return headers.map((header) => {
            // Get the value based on the header key
            const value = item[header] || '';

            // Handle dates
            if (header.toLowerCase().includes('date') || header.toLowerCase().includes('تاريخ')) {
              return new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              });
            }
            return value;
          });
        }),
      ];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      const colWidths = headers.map(() => ({ wch: 20 })); // Set default width for all columns
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Generate Excel file
      XLSX.writeFile(
        wb,
        `${fileName}_${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}.xlsx`
      );

      showSuccess('تم تصدير البيانات بنجاح', 'تم حفظ الملف في مجلد التنزيلات');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showError('حدث خطأ أثناء تصدير البيانات', 'يرجى المحاولة مرة أخرى');
    }
  };

  // Expose the export function
  defineExpose({
    exportToExcel,
  });

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

  // Still keep the onMounted hook to ensure values are updated if props change
  onMounted(() => {
    props.filters.forEach((filter) => {
      if (!selectedFilters.value[filter.key]) {
        selectedFilters.value[filter.key] = props.initialFilters[filter.key] || 'all';
      }
    });
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
    const sourceData = props.items?.length > 0 ? props.items : props.data;
    let result = [...sourceData];

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
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    const result = filteredData.value.slice(start, end);
    return result;
  });

  // Watch for filter changes
  watch(
    [searchQuery, selectedFilters, dateRange],
    ([newSearch, newFilters, newDate], [oldSearch, oldFilters, oldDate]) => {
      if (newSearch !== oldSearch) {
        emit('search-change', newSearch);
      }

      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        emit('filter-change', newFilters);
      }

      if (JSON.stringify(newDate) !== JSON.stringify(oldDate)) {
        emit('date-change', newDate || null); // Handle undefined case
      }

      currentPage.value = 1;
    },
    { deep: true }
  );
</script>
