<template>
  <BaseAddEditModal
    v-model:open="isOpen"
    :edit-data="props.attachment"
    :default-form-data="defaultFormData"
    entity-name="المرفق"
    :loading="isLoading"
    :validate="validateForm"
    @save="handleSave"
    @cancel="cancel"
  >
    <template #form="{ formData, updateForm, isLoading: modalLoading }">
      <div
        v-if="props.attachment"
        class="mx-auto flex w-1/2 items-center justify-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2"
      >
        <Icon icon="lucide:folder" class="h-4 w-4 text-accent" />
        <span class="text-sm font-medium text-accent">{{
          props.attachment?.projectName || 'غير محدد'
        }}</span>
      </div>
      <div class="space-y-6">
        <!-- Title Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:type"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              :class="{ 'animate-pulse': modalLoading }"
            />
            <Label for="title" class="text-sm font-semibold text-foreground-body"
              >عنوان المرفق</Label
            >
            <span class="text-sm text-red-500">*</span>
          </div>
          <div class="group relative">
            <Input
              id="title"
              :model-value="formData.title"
              :disabled="modalLoading"
              placeholder="اكتب عنوانًا وصفيًا للمرفق..."
              @update:model-value="updateForm('title', $event)"
              class="h-12 rounded-xl border-2 border-border/60 bg-background/50 pl-12 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-border"
            />
          </div>
        </div>

        <!-- Description Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:align-left"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              :class="{ 'animate-pulse': modalLoading }"
            />
            <Label for="description" class="text-sm font-semibold text-foreground-body"
              >وصف المرفق</Label
            >
            <span class="text-xs text-muted-foreground">(اختياري)</span>
          </div>
          <div class="group relative">
            <Textarea
              id="description"
              :model-value="formData.description"
              :disabled="modalLoading"
              placeholder="أضف وصفًا مفصلًا للمرفق ليسهل العثور عليه لاحقًا..."
              @update:model-value="updateForm('description', $event)"
              class="max-h-[8rem] min-h-[5rem] resize-none rounded-xl border-2 border-border/60 bg-background/50 pl-12 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-border"
            />
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div
              class="h-2 w-2 rounded-full bg-primary"
              :class="{ 'animate-pulse': modalLoading }"
            ></div>
            <Label for="file" class="text-sm font-semibold text-foreground-body">رفع الملف</Label>
            <span v-if="!props.attachment" class="text-sm text-red-500">*</span>
          </div>

          <!-- Current File Display -->
          <div
            v-if="currentFile"
            class="rounded-xl border-2 border-dashed border-info/30 bg-info/5 p-4"
            :class="{ 'opacity-60': modalLoading }"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20">
                  <Icon icon="lucide:file-text" class="h-5 w-5 text-info" />
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground-body">الملف الحالي</p>
                  <p class="text-xs font-medium text-info">{{
                    currentFile.length > 25 ? currentFile.substring(0, 25) + '...' : currentFile
                  }}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                :disabled="modalLoading"
                @click="downloadCurrentFile"
                class="h-9 px-3 text-info hover:bg-info/10 hover:text-info/80 disabled:opacity-50"
              >
                <Icon icon="lucide:download" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- File Upload Area -->
          <div class="relative" :class="{ 'pointer-events-none opacity-60': modalLoading }">
            <input
              id="file"
              type="file"
              :required="!props.attachment"
              :disabled="modalLoading"
              @change="handleFileChange"
              class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <div
              class="group cursor-pointer rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition-all duration-300 hover:border-primary/60 hover:bg-primary/5"
              :class="[
                formData.file ? 'border-success/60 bg-success/5' : '',
                modalLoading ? 'cursor-not-allowed' : '',
              ]"
            >
              <div class="space-y-3">
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20"
                >
                  <Icon
                    v-if="!modalLoading"
                    :icon="formData.file ? 'lucide:check-circle' : 'lucide:upload-cloud'"
                    :class="formData.file ? 'h-6 w-6 text-success' : 'h-6 w-6 text-primary'"
                  />
                  <Icon v-else icon="lucide:loader-2" class="h-6 w-6 animate-spin text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground-body">
                    {{
                      modalLoading
                        ? 'جاري المعالجة...'
                        : formData.file
                          ? 'تم اختيار الملف بنجاح'
                          : 'اختر ملفًا للرفع'
                    }}
                  </p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ modalLoading || formData.file ? '' : 'أو اسحب الملف وأفلته هنا' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected File Preview -->
          <div v-if="formData.file" class="duration-300 animate-in slide-in-from-bottom-2">
            <div
              class="rounded-xl border border-success/30 bg-gradient-to-r from-success/10 to-success/5 p-4"
              :class="{ 'opacity-60': modalLoading }"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-success/20"
                >
                  <Icon v-if="!modalLoading" icon="lucide:file-plus" class="h-5 w-5 text-success" />
                  <Icon v-else icon="lucide:loader-2" class="h-5 w-5 animate-spin text-success" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-foreground-body">{{
                    formData.file.name
                  }}</p>
                  <div class="mt-1 flex items-center gap-2">
                    <div
                      class="h-2 w-2 rounded-full bg-success"
                      :class="modalLoading ? 'animate-spin' : 'animate-pulse'"
                    ></div>
                    <p class="text-xs font-medium text-success">
                      {{ modalLoading ? 'جاري الرفع...' : 'جاهز للرفع' }}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="modalLoading"
                  @click="clearFile"
                  class="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Icon icon="lucide:x" class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseAddEditModal>
</template>

<script setup>
  import BaseAddEditModal from '@/components/BaseAddEditModal.vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Icon } from '@iconify/vue';
  import { computed, ref, watch } from 'vue';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    attachment: {
      type: Object,
      default: () => null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: [Number, String],
      default: null,
    },
  });

  const emit = defineEmits(['update:open', 'confirm', 'cancel', 'success']);

  const isOpen = ref(props.open);
  const isLoading = ref(props.loading);
  const currentFile = ref('');

  const defaultFormData = computed(() => ({
    title: '',
    description: '',
    file: null,
  }));

  // Validation function
  const validateForm = (formData) => {
    return !!(formData.title && (formData.file || props.attachment));
  };

  // Watch for open prop changes
  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
      if (newVal) {
        if (props.attachment) {
          currentFile.value = props.attachment.url?.split('/').pop() || '';
        } else {
          currentFile.value = '';
        }
      }
    }
  );

  // Watch for loading prop changes
  watch(
    () => props.loading,
    (newVal) => {
      isLoading.value = newVal;
    }
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the file in the form data
      const fileInput = document.getElementById('file');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const clearFile = () => {
    if (isLoading.value) return;
    const fileInput = document.getElementById('file');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await emit('confirm', {
        ...formData,
        projectId: props.projectId,
      });

      // Emit success event for parent to handle reload
      emit('success', {
        action: props.attachment ? 'update' : 'create',
        attachment: result,
        projectId: props.projectId,
      });
    } catch (error) {
      console.error('Error saving attachment:', error);
      throw error; // Rethrow to keep modal open
    }
  };

  const cancel = () => {
    emit('cancel');
  };

  const downloadCurrentFile = () => {
    if (props.attachment?.url && !isLoading.value) {
      window.open(props.attachment.url, '_blank');
    }
  };
</script>

<style scoped>
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-in {
    animation: animate-in 0.3s ease-out;
  }

  .slide-in-from-bottom-2 {
    animation: slide-in-from-bottom 0.3s ease-out;
  }

  @keyframes slide-in-from-bottom {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
