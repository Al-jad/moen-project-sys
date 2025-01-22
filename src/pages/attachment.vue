<template>
  <DefaultLayout>
    <main class="min-h-screen p-6 bg-gray-200 dark:bg-gray-900">
      <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <BackToMainButton />
          <h1 class="text-2xl font-semibold dark:text-white">المرفقات ({{ attachments.length }})</h1>
          </div>
          <div class="w-1/5">
            <CustomSelect
              v-model="selectedProject"
              :options="projectOptions"
              placeholder="اختر المشروع"
              :icon="Folder"
              trigger-class="flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        <!-- Grid of Attachments -->
        <div class="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <DocumentCard
            v-for="attachment in paginatedAttachments"
            :key="attachment.id"
            :title="attachment.title"
            class="dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-gray-600"
          />
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center mt-6">
          <Pagination
            v-model="currentPage"
            :total="attachments.length"
            :per-page="itemsPerPage"
          />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Folder } from 'lucide-vue-next'
import DocumentCard from '@/components/DocumentCard.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import Pagination from '@/components/Pagination.vue'
import BackToMainButton from '@/components/BackToMainButton.vue';

const router = useRouter()
const selectedProject = ref('all')

// Project options
const projectOptions = [
  { value: 'all', label: 'الكل' },
  { value: '1', label: 'جدول الكميات والمواصفات الفنية في المناقصة' }
]

// Static data
const mockAttachments = [
  { id: 1, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 2, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 3, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 4, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 5, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 6, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 7, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 8, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 9, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 10, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 11, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  { id: 12, title: 'جدول الكميات والمواصفات الفنية في المناقصة' }
]

const attachments = ref(mockAttachments)

// Pagination logic
const itemsPerPage = 8
const currentPage = ref(1)

const paginatedAttachments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return attachments.value.slice(start, end)
})
</script>
