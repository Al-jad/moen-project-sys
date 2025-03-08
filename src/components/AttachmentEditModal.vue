<template>
  <Dialog :open="isOpen" @update:open="updateOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="mb-2 mt-4 flex flex-row gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-start">
            <DialogTitle class="text-xl font-semibold">تعديل المرفق</DialogTitle>
          </div>
          <DialogDescription class="text-right">
            قم بتعديل بيانات المرفق هنا. اضغط حفظ عند الانتهاء.
          </DialogDescription>
        </div>
        <Button variant="ghost" @click="cancel">
          <Icon icon="lucide:x" class="h-4 w-4" />
        </Button>
      </DialogHeader>
      <div class="h-px bg-gray-200 dark:bg-gray-700"></div>
      <div class="space-y-5 py-6">
        <div class="grid gap-2">
          <Label for="project" class="text-[0.925rem]">المشروع</Label>
          <div
            class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50"
          >
            <Icon icon="lucide:folder" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ props.attachment?.projectName }}
            </span>
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="title" class="text-[0.925rem]">العنوان</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="عنوان المرفق"
            class="dark:bg-gray-800"
          />
        </div>

        <div class="grid gap-2">
          <Label for="description" class="text-[0.925rem]">الوصف</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="وصف المرفق"
            class="min-h-[6rem] dark:bg-gray-800"
          />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="file" class="text-[0.925rem]">الملف</Label>
            <div v-if="currentFile" class="flex items-center gap-2 text-sm text-gray-500">
              <span>الملف الحالي:</span>
              <a
                :href="props.attachment?.url"
                target="_blank"
                class="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Icon icon="lucide:file" class="h-4 w-4" />
                <span>{{ currentFile }}</span>
                <Icon icon="lucide:external-link" class="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <div class="space-y-3">
            <Input
              id="file"
              type="file"
              class="h-14 cursor-pointer file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 dark:bg-gray-800 dark:file:bg-blue-950 dark:file:text-blue-400 dark:hover:file:bg-blue-900"
              @change="handleFileChange"
            />
            <div
              v-if="form.file"
              class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <Icon icon="lucide:file-plus" class="h-4 w-4 text-green-500" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ form.file.name }} (ملف جديد)
              </span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="border-t pt-4 dark:border-gray-700">
        <div class="flex w-full items-center justify-end gap-3">
          <Button variant="outline" @click="cancel">إلغاء</Button>
          <Button type="submit" :disabled="isLoading" @click="confirm">
            <Icon v-if="isLoading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            حفظ التغييرات
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
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
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Icon } from '@iconify/vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    attachment: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:open', 'confirm', 'cancel']);

  const isOpen = ref(props.open);
  const isLoading = ref(props.loading);
  const form = ref({
    title: '',
    description: '',
    file: null,
  });
  const currentFile = ref('');

  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
      if (newVal && props.attachment) {
        form.value = {
          title: props.attachment.title || '',
          description: props.attachment.description || '',
          file: null,
        };
        currentFile.value = props.attachment.url?.split('/').pop() || '';
      }
    }
  );

  watch(
    () => props.loading,
    (newVal) => {
      isLoading.value = newVal;
    }
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      form.value.file = file;
    }
  };

  const updateOpen = (value) => {
    isOpen.value = value;
    emit('update:open', value);
  };

  const confirm = () => {
    emit('confirm', { ...form.value });
  };

  const cancel = () => {
    form.value = {
      title: '',
      description: '',
      file: null,
    };
    currentFile.value = '';
    emit('cancel');
    updateOpen(false);
  };
</script>
