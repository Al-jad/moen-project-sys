<template>
  <div class="min-h-screen overflow-x-auto">
    <!-- Filters Section -->
    <div
      v-if="showExport || showDateFilter || showSearch || filters.length > 0"
      class="mb-8 flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-background-surface/60 p-6 sm:flex-row sm:items-center"
    >
      <div class="flex flex-wrap items-center gap-4">
        <PrimaryButton
          v-if="showExport"
          variant="outline"
          :class="
            isExportPremium
              ? 'border-destructive/20 bg-destructive/10 text-destructive'
              : 'border-success/20 bg-success/10 text-success'
          "
          :disabled="isExportPremium"
          @click="$emit('export')"
        >
          <Icon
            icon="lucide:file-spreadsheet"
            class="ml-2 h-4 w-4"
            :class="isExportPremium ? 'text-destructive' : 'text-success'"
          />
          <span :class="isExportPremium ? 'text-destructive' : 'text-success'" class="font-medium"
            >تصدير Excel</span
          >
          <div v-if="isExportPremium" class="flex items-center gap-1 text-xs text-destructive">
            <span> – هذه الميزة غير متوفرة حاليا</span>
            <Icon icon="lucide:lock" class="h-4 w-4" />
          </div>
        </PrimaryButton>

        <DateRangeInput v-if="showDateFilter" v-model="dateRange" :isPremium="isPremium" />

        <div v-for="filter in filters" :key="filter.key" class="min-w-[12.5rem]">
          <CustomSelect
            v-model="selectedFilters[filter.key]"
            :options="filter.options"
            :placeholder="filter.placeholder"
            :TriggerIcon="filter.icon"
            :trigger-class="`${filter.triggerClass} `"
          />
        </div>
      </div>

      <div v-if="showSearch" class="relative min-w-[15rem]">
        <CustomInput v-model="searchQuery" placeholder="بحث سريع" :icon="'lucide:search'" />
      </div>
    </div>

    <!-- Table Section -->
    <Table class="overflow-hidden rounded-xl border border-border shadow-sm">
      <TableHeader>
        <TableRow class="border-b border-border bg-background-card hover:bg-background-card">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            class="h-14 whitespace-nowrap px-6 text-right font-semibold text-foreground-heading"
            :class="{
              'first:rounded-tr-xl': column === columns[0],
              'w-10 last:rounded-tl-xl': column === columns[columns.length - 1],
            }"
          >
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody class="border-border bg-background-surface">
        <template v-if="loading">
          <TableRow>
            <TableCell :colspan="columns.length" class="py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <div
                  class="border-3 mb-4 h-8 w-8 animate-spin rounded-full border-primary border-t-transparent"
                ></div>
                <span class="text-sm font-medium text-foreground-muted">جاري التحميل...</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="filteredData.length === 0">
          <TableRow>
            <TableCell :colspan="columns.length" class="py-16 text-center">
              <div class="flex flex-col items-center justify-center gap-3">
                <div class="rounded-full bg-background-surface/30 p-4">
                  <Icon icon="lucide:inbox" class="h-8 w-8 text-foreground-muted" />
                </div>
                <span class="text-sm font-medium text-foreground-muted">لا توجد بيانات للعرض</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow
          v-else
          v-for="(item, index) in paginatedData"
          :key="index"
          class="border border-border transition-all duration-200 last:border-b-0 hover:bg-background-surface/20"
          :class="{
            'last:[&>td:first-child]:rounded-br-xl last:[&>td:last-child]:rounded-bl-xl':
              index === paginatedData.length - 1,
          }"
        >
          <TableCell
            v-for="column in columns"
            :key="column.key"
            :class="[column.cellClass, column.width ? `w-[${column.width}]` : '', 'px-6 py-4']"
          >
            <slot :name="column.key" :item="item" :value="item[column.key]">
              <template v-if="column.type === 'button'">
                <Button
                  variant="link"
                  class="h-auto p-0 font-medium text-primary transition-colors hover:text-primary-hover"
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
                      action.class ||
                      'text-foreground-muted hover:bg-background-hover hover:text-foreground'
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
                    class="text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
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
                <span class="text-foreground-body">{{ item[column.key] }}</span>
              </template>
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div
      class="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border-t border-border bg-background-surface/40 p-4 pt-6 sm:flex-row"
    >
      <Pagination v-model="currentPage" :total="filteredData.length" :per-page="itemsPerPage" />
      <div
        class="whitespace-nowrap rounded-lg border border-border bg-background-card/70 px-4 py-2 text-sm text-foreground-muted"
      >
        عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} من
        {{ filteredData.length }} نتيجة
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PrimaryButton from '@/components/PrimaryButton.vue';
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
