<template>
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious :disabled="currentPage === 1" @click="emit('update:modelValue', currentPage - 1)">
          التالي
        </PaginationPrevious>
      </PaginationItem>

      <PaginationItem v-for="page in totalPages" :key="page">
        <PaginationLink :isActive="page === currentPage" @click="emit('update:modelValue', page)">
          {{ page }}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem>
        <PaginationNext :disabled="currentPage === totalPages" @click="emit('update:modelValue', currentPage + 1)">
          السابق
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</template>

<script setup>
import { computed } from 'vue';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['update:modelValue']);

const currentPage = computed(() => props.modelValue);
const totalPages = computed(() => {
  const total = Math.ceil(props.total / props.perPage)
  return total > 0 ? total : 1
});
</script> 