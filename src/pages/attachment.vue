<template>
  <DefaultLayout>
    <main class="min-h-screen bg-gray-200 p-6 dark:bg-gray-900">
      <div class="rounded-lg bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <BackToMainButton />
            <h1 class="text-2xl font-semibold dark:text-white"
              >المرفقات ({{ attachments.length }})</h1
            >
          </div>
          <div class="w-1/5">
            <CustomSelect
              v-model="selectedProject"
              :options="projectOptions"
              placeholder="اختر المشروع"
              icon="lucide:folder"
              trigger-class="flex-row-reverse dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        <!-- Grid of Attachments -->
        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <DocumentCard
            v-for="attachment in paginatedAttachments"
            :key="attachment.id"
            :title="attachment.title"
            class="dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-center">
          <Pagination v-model="currentPage" :total="attachments.length" :per-page="itemsPerPage" />
        </div>
      </div>
    </main>
  </DefaultLayout>
</template>

<script setup>
  import BackToMainButton from '@/components/BackToMainButton.vue';
  import CustomSelect from '@/components/CustomSelect.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import Pagination from '@/components/Pagination.vue';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const selectedProject = ref('all');

  // Project options
  const projectOptions = [
    { value: 'all', label: 'الكل' },
    { value: '1', label: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  ];

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
    { id: 12, title: 'جدول الكميات والمواصفات الفنية في المناقصة' },
  ];

  const attachments = ref(mockAttachments);

  // Pagination logic
  const itemsPerPage = 8;
  const currentPage = ref(1);

  const paginatedAttachments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return attachments.value.slice(start, end);
  });
</script>
