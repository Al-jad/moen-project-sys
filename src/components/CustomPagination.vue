<template>
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          :disabled="currentPage === 1"
          @click="emit('update:modelValue', currentPage - 1)"
        >
          السابق
        </PaginationPrevious>
      </PaginationItem>

      <!-- First Page -->
      <PaginationItem v-if="showFirstPage">
        <PaginationLink :isActive="currentPage === 1" @click="emit('update:modelValue', 1)">
          1
        </PaginationLink>
      </PaginationItem>

      <!-- Left Ellipsis -->
      <PaginationItem v-if="showLeftEllipsis">
        <PaginationEllipsis />
      </PaginationItem>

      <!-- Middle Pages -->
      <PaginationItem v-for="page in visiblePages" :key="page">
        <PaginationLink :isActive="page === currentPage" @click="emit('update:modelValue', page)">
          {{ page }}
        </PaginationLink>
      </PaginationItem>

      <!-- Right Ellipsis -->
      <PaginationItem v-if="showRightEllipsis">
        <PaginationEllipsis />
      </PaginationItem>

      <!-- Last Page -->
      <PaginationItem v-if="showLastPage">
        <PaginationLink
          :isActive="currentPage === totalPages"
          @click="emit('update:modelValue', totalPages)"
        >
          {{ totalPages }}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem>
        <PaginationNext
          :disabled="currentPage === totalPages"
          @click="emit('update:modelValue', currentPage + 1)"
        >
          التالي
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</template>

<script setup>
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination';

  const props = defineProps({
    modelValue: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    maxVisiblePages: {
      type: Number,
      default: 5,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const currentPage = computed(() => props.modelValue);
  const totalPages = computed(() => {
    const total = Math.ceil(props.total / props.perPage);
    return total > 0 ? total : 1;
  });

  // Calculate visible pages
  const visiblePages = computed(() => {
    const maxVisible = props.maxVisiblePages;
    const half = Math.floor(maxVisible / 2);
    let start = currentPage.value - half;
    let end = currentPage.value + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, totalPages.value);
    }

    if (end > totalPages.value) {
      end = totalPages.value;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Show/hide ellipsis and first/last pages
  const showFirstPage = computed(() => visiblePages.value[0] > 1);
  const showLastPage = computed(
    () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value
  );
  const showLeftEllipsis = computed(() => visiblePages.value[0] > 2);
  const showRightEllipsis = computed(
    () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
  );
</script>
