<template>
  <BaseModal
    :open="isOpen"
    @update:open="updateOpen"
    @close="cancel"
    @confirm="confirm"
    content-class="sm:max-w-[32rem] max-h-[90vh] flex flex-col overflow-hidden"
    header-class="pb-0 flex-shrink-0"
    title-class="text-xl font-bold text-foreground-heading"
    footer-class="flex justify-center gap-3 pt-6 mt-6 border-t border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm"
    :cancel-text="'إلغاء'"
    :confirm-text="props.attachment ? 'حفظ التغييرات' : 'إضافة المرفق'"
    :show-confirm="true"
    confirm-button-class="bg-primary hover:bg-primary/90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <template #title>
      <div class="space-y-3 p-6 pb-4 text-center" :class="{ 'opacity-60': isLoading }">
        <!-- Icon Header -->

        <!-- Title & Subtitle -->
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 shadow-lg transition-all duration-300"
              :class="{ 'animate-pulse': isLoading }"
            >
              <Icon
                v-if="!isLoading"
                :icon="props.attachment ? 'lucide:edit-3' : 'lucide:file-plus'"
                class="h-6 w-6 text-primary"
              />
              <Icon v-else icon="lucide:loader-2" class="h-6 w-6 animate-spin text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-foreground-heading">
              {{
                isLoading
                  ? props.attachment
                    ? 'جاري حفظ التغييرات...'
                    : 'جاري إضافة المرفق...'
                  : props.attachment
                    ? 'تعديل المرفق'
                    : 'إضافة مرفق جديد'
              }}
            </h3>
          </div>
          <p class="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
            {{
              isLoading
                ? 'يرجى الانتظار، جاري معالجة طلبك...'
                : props.attachment
                  ? 'قم بتحديث معلومات المرفق وإعادة رفع الملف إذا لزم الأمر'
                  : 'أضف ملفًا جديدًا مع المعلومات المطلوبة لحفظه في النظام'
            }}
          </p>
        </div>

        <!-- Project Info Badge (for editing) -->
        <div
          v-if="props.attachment"
          class="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2"
        >
          <Icon icon="lucide:folder" class="h-4 w-4 text-accent" />
          <span class="text-sm font-medium text-accent">{{
            props.attachment?.projectName || 'غير محدد'
          }}</span>
        </div>

        <!-- Loading Progress Bar -->
        <div v-if="isLoading" class="w-full">
          <div class="h-1 w-full overflow-hidden rounded-full bg-primary/20">
            <div class="animate-pulse-slow h-full bg-gradient-to-r from-primary to-accent"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Scrollable Content -->
    <div
      class="flex-1 overflow-y-auto px-6 pb-2"
      :class="{ 'pointer-events-none opacity-60': isLoading }"
    >
      <div class="space-y-6">
        <!-- Title Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:type"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              :class="{ 'animate-pulse': isLoading }"
            />
            <Label for="title" class="text-sm font-semibold text-foreground-body"
              >عنوان المرفق</Label
            >
            <span class="text-sm text-red-500">*</span>
          </div>
          <div class="group relative">
            <Input
              id="title"
              v-model="form.title"
              :disabled="isLoading"
              placeholder="اكتب عنوانًا وصفيًا للمرفق..."
              class="h-12 rounded-xl border-2 border-border/60 bg-background/50 pl-12 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-border"
            />
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
              <div class="h-1 w-16 overflow-hidden rounded-full bg-primary/30">
                <div class="h-full animate-pulse bg-primary"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Field -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:align-left"
              class="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary"
              :class="{ 'animate-pulse': isLoading }"
            />
            <Label for="description" class="text-sm font-semibold text-foreground-body"
              >وصف المرفق</Label
            >
            <span class="text-xs text-muted-foreground">(اختياري)</span>
          </div>
          <div class="group relative">
            <Textarea
              id="description"
              v-model="form.description"
              :disabled="isLoading"
              placeholder="أضف وصفًا مفصلًا للمرفق ليسهل العثور عليه لاحقًا..."
              class="max-h-[8rem] min-h-[5rem] resize-none rounded-xl border-2 border-border/60 bg-background/50 pl-12 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-border"
            />
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
              <div class="h-1 w-20 overflow-hidden rounded-full bg-primary/30">
                <div class="h-full animate-pulse bg-primary"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div
              class="h-2 w-2 rounded-full bg-primary"
              :class="{ 'animate-pulse': isLoading }"
            ></div>
            <Label for="file" class="text-sm font-semibold text-foreground-body">رفع الملف</Label>
            <span v-if="!props.attachment" class="text-sm text-red-500">*</span>
          </div>

          <!-- Current File Display -->
          <div
            v-if="currentFile"
            class="rounded-xl border-2 border-dashed border-info/30 bg-info/5 p-4"
            :class="{ 'opacity-60': isLoading }"
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
                :disabled="isLoading"
                @click="downloadCurrentFile"
                class="h-9 px-3 text-info hover:bg-info/10 hover:text-info/80 disabled:opacity-50"
              >
                <Icon icon="lucide:download" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- File Upload Area -->
          <div class="relative" :class="{ 'pointer-events-none opacity-60': isLoading }">
            <input
              id="file"
              type="file"
              :required="!props.attachment"
              :disabled="isLoading"
              @change="handleFileChange"
              class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <div
              class="group cursor-pointer rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition-all duration-300 hover:border-primary/60 hover:bg-primary/5"
              :class="[
                form.file ? 'border-success/60 bg-success/5' : '',
                isLoading ? 'cursor-not-allowed' : '',
              ]"
            >
              <div class="space-y-3">
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20"
                >
                  <Icon
                    v-if="!isLoading"
                    :icon="form.file ? 'lucide:check-circle' : 'lucide:upload-cloud'"
                    :class="form.file ? 'h-6 w-6 text-success' : 'h-6 w-6 text-primary'"
                  />
                  <Icon v-else icon="lucide:loader-2" class="h-6 w-6 animate-spin text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground-body">
                    {{
                      isLoading
                        ? 'جاري المعالجة...'
                        : form.file
                          ? 'تم اختيار الملف بنجاح'
                          : 'اختر ملفًا للرفع'
                    }}
                  </p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ isLoading || form.file ? '' : 'أو اسحب الملف وأفلته هنا' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected File Preview -->
          <div v-if="form.file" class="duration-300 animate-in slide-in-from-bottom-2">
            <div
              class="rounded-xl border border-success/30 bg-gradient-to-r from-success/10 to-success/5 p-4"
              :class="{ 'opacity-60': isLoading }"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-success/20"
                >
                  <Icon v-if="!isLoading" icon="lucide:file-plus" class="h-5 w-5 text-success" />
                  <Icon v-else icon="lucide:loader-2" class="h-5 w-5 animate-spin text-success" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-foreground-body">{{
                    form.file.name
                  }}</p>
                  <div class="mt-1 flex items-center gap-2">
                    <div
                      class="h-2 w-2 rounded-full bg-success"
                      :class="isLoading ? 'animate-spin' : 'animate-pulse'"
                    ></div>
                    <p class="text-xs font-medium text-success">
                      {{ isLoading ? 'جاري الرفع...' : 'جاهز للرفع' }}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="isLoading"
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
    </div>

    <template #footer>
      <div class="flex justify-center gap-3 px-6">
        <Button
          variant="outline"
          @click="cancel"
          :disabled="isLoading"
          class="h-11 min-w-[7rem] border-2 border-border/60 transition-all duration-300 hover:border-border hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          :disabled="isLoading || !isValid"
          @click="confirm"
          class="h-11 min-w-[7rem] bg-gradient-to-r from-primary to-primary/90 px-6 text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-primary hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="isLoading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
          <Icon
            v-else
            :icon="props.attachment ? 'lucide:save' : 'lucide:plus'"
            class="mr-2 h-4 w-4"
          />
          {{
            isLoading
              ? props.attachment
                ? 'جاري الحفظ...'
                : 'جاري الإضافة...'
              : props.attachment
                ? 'حفظ التغييرات'
                : 'إضافة المرفق'
          }}
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
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
  const form = ref({
    title: '',
    description: '',
    file: null,
  });
  const currentFile = ref('');

  const isValid = computed(() => {
    return form.value.title && (form.value.file || props.attachment);
  });

  watch(
    () => props.open,
    (newVal) => {
      isOpen.value = newVal;
      if (newVal) {
        if (props.attachment) {
          form.value = {
            title: props.attachment.title || '',
            description: props.attachment.description || '',
            file: null,
          };
          currentFile.value = props.attachment.url?.split('/').pop() || '';
        } else {
          form.value = {
            title: '',
            description: '',
            file: null,
          };
          currentFile.value = '';
        }
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

  const clearFile = () => {
    if (isLoading.value) return;
    form.value.file = null;
    // Reset the file input
    const fileInput = document.getElementById('file');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const updateOpen = (value) => {
    isOpen.value = value;
    emit('update:open', value);
  };

  const confirm = async () => {
    if (!isValid.value || isLoading.value) return;

    try {
      const result = await emit('confirm', { ...form.value, projectId: props.projectId });

      // Emit success event for parent to handle reload
      emit('success', {
        action: props.attachment ? 'update' : 'create',
        attachment: result,
        projectId: props.projectId,
      });

      // Reset form and close modal
      form.value = {
        title: '',
        description: '',
        file: null,
      };
      currentFile.value = '';
      updateOpen(false);
    } catch (error) {
      console.error('Error saving attachment:', error);
      // Keep modal open on error
    }
  };

  const cancel = () => {
    if (isLoading.value) return;

    form.value = {
      title: '',
      description: '',
      file: null,
    };
    currentFile.value = '';
    emit('cancel');
    updateOpen(false);
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

  .animate-pulse-slow {
    animation: pulse-slow 2s infinite;
  }

  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
