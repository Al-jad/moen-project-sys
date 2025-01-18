<template>
  <div>
    <div class="grid gap-4" :class="useDetailedCard ? 'grid-cols-1' : 'grid-cols-4'">
      <component 
        :is="useDetailedCard ? DetailedProjectCard : ProjectCard"
        v-for="project in paginatedProjects" 
        :key="project.id"
        v-bind="{ 
          ...project,
          duration: '12'
        }"
      />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious @click="prevPage" :disabled="currentPage === 1" />
          </PaginationItem>

          <PaginationItem v-for="page in totalPages" :key="page">
            <PaginationLink 
              :isActive="currentPage === page"
              @click="goToPage(page)"
            >
              {{ page }}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext @click="nextPage" :disabled="currentPage === totalPages" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProjectCard from './ProjectCard.vue'
import DetailedProjectCard from './DetailedProjectCard.vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})

const route = useRoute()
const useDetailedCard = computed(() => route.path === '/projects')

// Pagination logic
const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(props.projects.length / itemsPerPage))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.projects.slice(start, end)
})

const goToPage = (page) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script> 