<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50">
      <div class="p-6 bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <Button variant="ghost" class="gap-2 text-muted-foreground" @click="router.back()">
          <ArrowRight class="w-4 h-4" />
          رجوع
        </Button>
      </div>
      

      <!-- Project Selector -->
      <div class="flex items-center justify-start mb-6">
        <div class="w-1/3">
          <Select v-model="selectedProject">
            <SelectTrigger class="flex flex-row-reverse w-full">
              <SelectValue placeholder="اختر المشروع" dir="rtl">
                <div class="flex items-center gap-2">
                  <Folder class="w-4 h-4 text-gray-400 " />
                  <span class="p-4">{{ selectedProject === 'all' ? 'اختر المشروع' : 'جدول الكميات والمواصفات الفنية في المناقصة' }}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="1"> جدول الكميات والمواصفات الفنية في المناقصة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Title -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold">المرفقات ({{ attachments.length }})</h1>
      </div>

      <!-- Grid of Attachments -->
      <div class="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <DocumentCard
          v-for="attachment in paginatedAttachments"
          :key="attachment.id"
          :title="attachment.title"
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
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Button } from '@/components/ui/button';
import { ArrowRight, Folder } from 'lucide-vue-next';
import DocumentCard from '@/components/DocumentCard.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedProject = ref('all');

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

const totalPages = computed(() => Math.ceil(attachments.value.length / itemsPerPage));

const paginatedAttachments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return attachments.value.slice(start, end);
});

const goToPage = (page) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>
