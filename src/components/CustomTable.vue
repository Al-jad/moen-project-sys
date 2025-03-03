<template>
  <div>
    <!-- Filters Section -->
    <div class="mb-8 flex items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <Button
          variant="outline"
          class="px-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="$emit('export')"
        >
          <Icon icon="lucide:file-spreadsheet" class="ml-2 h-4 w-4" />
          تصدير Excel
        </Button>
        <DateRangeInput v-model="dateRange" />

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

      <div class="relative min-w-[240px]">
        <CustomInput v-model="searchQuery" placeholder="بحث سريع" :TriggerIcon="'lucide:search'" />
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
        <TableRow
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
  import { Button } from '@/components/ui/button';
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
  import { computed, ref, watch } from 'vue';
  import CustomInput from './CustomInput.vue';
  import CustomSelect from './CustomSelect.vue';
  import DateRangeInput from './DateRangeInput.vue';
  import Pagination from './Pagination.vue';

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
  }

  const props = withDefaults(defineProps<Props>(), {
    itemsPerPage: 7,
    filters: () => [],
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
  const selectedFilters = ref<Record<string, string>>({});

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

    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(query))
      );
    }

    // Apply select filters
    Object.entries(selectedFilters.value).forEach(([key, value]) => {
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
    return filteredData.value.slice(start, end);
  });

  // Watch for filter changes
  watch(
    [searchQuery, selectedFilters, dateRange],
    ([newSearch, newFilters, newDate]) => {
      emit('search-change', newSearch);
      emit('filter-change', newFilters);
      emit('date-change', newDate);
      currentPage.value = 1; // Reset to first page when filters change
    },
    { deep: true }
  );
</script>
