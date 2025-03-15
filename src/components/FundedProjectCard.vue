<template>
  <div
    @click="router.push(`/funded-projects/${project.id}`)"
    class="group relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:cursor-pointer hover:border-blue-500/20 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="border-b border-gray-200 p-6 dark:border-gray-700">
      <div class="mb-6 flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="flex">
            <h3
              class="text-2xl font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
            >
              {{ project.name || 'لا يوجد اسم' }}
            </h3>
          </div>
        </div>
        <h3
          class="rounded-full bg-blue-500 px-4 py-1 text-xl font-medium text-white shadow-sm transition-all dark:bg-blue-600"
        >
          {{ formatCost(project.cost) || 0 }} $
        </h3>
      </div>
      <hr class="mb-6 w-full border-gray-200 dark:border-gray-700" />
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          class="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon icon="lucide:layers" class="h-5 w-5 text-gray-600 dark:text-gray-100" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">المكونات</h3>
            </div>
            <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
              {{ project.components?.length || 0 }}
            </h3>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon icon="lucide:list-todo" class="h-5 w-5 text-gray-600 dark:text-gray-100" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">الفعاليات</h3>
            </div>
            <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
              {{ getTotalActivities(project) || 0 }}
            </h3>
          </div>
        </div>
        <div
          class="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon icon="formkit:datetime" class="h-5 w-5 text-gray-600 dark:text-gray-100" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">فترة التنفيذ</h3>
            </div>
            <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
              {{ project.duration }}
              {{ project.periodType ? (project.periodType === 1 ? 'أسبوع' : 'شهر') : '' }}
            </h3>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon
                  icon="lucide:calendar-days"
                  class="h-5 w-5 text-gray-600 dark:text-gray-100"
                />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">تاريخ البدء</h3>
            </div>
            <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
              {{ formatDate(project.actualStartDate) }}
            </h3>
          </div>
        </div>
        <div
          class="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon
                  icon="fluent:money-calculator-24-regular"
                  class="h-5 w-5 text-gray-600 dark:text-gray-100"
                />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">الانجاز المالي</h3>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full bg-gray-600 transition-all dark:bg-gray-100"
                  :style="{ width: `${project.financialProgress || 0}%` }"
                ></div>
              </div>
              <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
                {{ project.financialProgress || 0 }}%
              </h3>
            </div>
          </div>
          <div class="flex items-center justify-between opacity-50 hover:cursor-not-allowed">
            <div class="flex items-center gap-2">
              <div class="rounded-full bg-gray-50 p-2 dark:bg-gray-500/10">
                <Icon
                  icon="hugeicons:percent-square"
                  class="h-5 w-5 text-gray-600 dark:text-gray-100"
                />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">الإنجاز الفني</h3>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full bg-gray-600 transition-all dark:bg-gray-100"
                  :style="{ width: `${project.actualProgress || 0}%` }"
                ></div>
              </div>
              <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-100">
                {{ project.actualProgress || 0 }}%
              </h3>
            </div>
          </div>
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
