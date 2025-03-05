<template>
  <div
    @click="router.push(`/funded-projects/${project.id}`)"
    class="group overflow-hidden rounded-lg border bg-white transition-all hover:cursor-pointer hover:border-blue-500/20 hover:bg-gray-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="border-b p-4 dark:border-gray-700">
      <div class="mb-4 flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
            <div
              class="flex h-full w-full items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400"
            >
              {{ project.id }}
            </div>
          </div>
          <div class="flex flex-col">
            <h3 class="font-medium text-gray-900 dark:text-gray-100">
              {{ project.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ project.executingDepartment }}
            </p>
          </div>
        </div>
        <Button
          @click.stop="openAttachmentDialog"
          variant="outline"
          size="sm"
          class="flex items-center gap-2 border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
        >
          <Icon icon="lucide:paperclip" class="h-4 w-4" />
          إضافة مرفق
        </Button>
      </div>
      <div class="flex items-center gap-8">
        <div class="flex-1">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:dollar-sign" class="h-4 w-4 text-amber-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300">الانجاز المالي</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">24%</span>
          </div>
          <div class="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              class="absolute inset-y-0 left-0 bg-amber-500 transition-all"
              :style="{ width: '24%' }"
            ></div>
          </div>
        </div>
        <div class="flex-1">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:target" class="h-4 w-4 text-blue-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300">الانجاز الفني</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">24%</span>
          </div>
          <div class="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              class="absolute inset-y-0 left-0 bg-blue-500 transition-all"
              :style="{ width: '24%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
      <div class="p-4 text-center">
        <div class="mb-1 flex items-center justify-center gap-2">
          <Icon icon="lucide:layers" class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-500 dark:text-gray-400">المكونات</span>
        </div>
        <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ project.components?.length || 0 }}
        </div>
      </div>
      <div class="p-4 text-center">
        <div class="mb-1 flex items-center justify-center gap-2">
          <Icon icon="lucide:list-todo" class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-500 dark:text-gray-400">الفعاليات</span>
        </div>
        <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ getTotalActivities(project) }}
        </div>
      </div>
      <div class="p-4 text-center">
        <div class="mb-1 flex items-center justify-center gap-2">
          <Icon icon="lucide:calendar" class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-500 dark:text-gray-400">تاريخ البدء</span>
        </div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ formatDate(project.actualStartDate) }}
        </div>
      </div>
      <div class="p-4 text-center">
        <div class="mb-1 flex items-center justify-center gap-2">
          <Icon icon="lucide:dollar-sign" class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-500 dark:text-gray-400">مبلغ التمويل</span>
        </div>
        <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${{ formatCost(project.cost) }}
        </div>
      </div>
    </div>
    <Dialog :open="isAttachmentDialogOpen" @update:open="updateDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-center">إضافة مرفق جديد</DialogTitle>
          <DialogDescription class="text-center"> قم بإضافة مرفق جديد للمشروع </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleAttachmentSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">عنوان المرفق</label>
            <input
              v-model="attachmentData.title"
              type="text"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
            <textarea
              v-model="attachmentData.description"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">الملف</label>
            <input
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              required
            />
          </div>
          <DialogFooter class="flex justify-center gap-4 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              @click="closeAttachmentDialog"
              class="min-w-[8rem]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              :disabled="isUploading"
              class="min-w-[8rem] bg-blue-600 hover:bg-blue-700"
            >
              <Icon v-if="isUploading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
              {{ isUploading ? 'جاري الرفع...' : 'رفع المرفق' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
<script setup>
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import axiosInstance from '@/plugins/axios';
  import { Icon } from '@iconify/vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const isAttachmentDialogOpen = ref(false);
  const isUploading = ref(false);
  const fileInput = ref(null);
  const attachmentData = ref({
    title: '',
    description: '',
    url: '',
    projectId: 0,
  });
  const props = defineProps({
    project: {
      type: Object,
      required: true,
    },
  });
  const getTotalActivities = (project) => {
    return (
      project.components?.reduce((total, comp) => total + (comp.activities?.length || 0), 0) || 0
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const formatCost = (value) => {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const openAttachmentDialog = (e) => {
    e.stopPropagation();
    isAttachmentDialogOpen.value = true;
    attachmentData.value.projectId = props.project.id;
  };
  const closeAttachmentDialog = () => {
    isAttachmentDialogOpen.value = false;
    resetForm();
  };
  const updateDialogOpen = (value) => {
    isAttachmentDialogOpen.value = value;
    if (!value) resetForm();
  };
  const resetForm = () => {
    attachmentData.value = {
      title: '',
      description: '',
      url: '',
      projectId: props.project.id,
    };
    if (fileInput.value) fileInput.value.value = '';
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      attachmentData.value.url = URL.createObjectURL(file);
    }
  };
  const handleAttachmentSubmit = async () => {
    try {
      isUploading.value = true;
      const file = fileInput.value.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await axiosInstance.post(
        'https://encode.ibaity.com/uploads/raw',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      attachmentData.value.url = uploadResponse.data.url;
      await axiosInstance.post('/Attachment', attachmentData.value);
      closeAttachmentDialog();
      emit('attachment-added');
    } catch (error) {
      console.error('Error in attachment process:', error);
    } finally {
      isUploading.value = false;
    }
  };
  const emit = defineEmits(['attachment-added']);
</script>
