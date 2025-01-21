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
      <Pagination
        v-model="currentPage"
        :total="projects.length"
        :per-page="itemsPerPage"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProjectCard from './ProjectCard.vue'
import DetailedProjectCard from './DetailedProjectCard.vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})

const route = useRoute()
const useDetailedCard = computed(() => route.path === '/projects')

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = 8

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.projects.slice(start, end)
})
</script> 