<template>
  <div class="rounded-xl border bg-background-surface">
    <div class="flex items-center justify-between border-b p-4">
      <div class="flex items-center gap-2">
        <Icon :icon="icon" class="text-foreground-subheading h-5 w-5" />
        <h4 class="font-medium text-foreground-heading">{{ title }}</h4>
      </div>
      <PrimaryButton
        v-if="editEnabled"
        @click="$emit('toggle-edit')"
        :variant="!isEditing ? 'ghost' : 'destructive'"
        size="sm"
        :icon="!isEditing ? 'lucide:edit' : 'lucide:x'"
      />
    </div>

    <div class="p-4">
      <slot
        name="content"
        :isEditing="isEditing"
        :formData="formData"
        :updateFormData="updateFormData"
      >
        <div class="text-sm text-foreground-muted">No content provided</div>
      </slot>
    </div>

    <div v-if="isEditing && editEnabled" class="flex justify-end gap-2 border-t p-4">
      <PrimaryButton variant="outline" @click="$emit('cancel')"> إلغاء </PrimaryButton>
      <PrimaryButton
        variant="primary"
        @click="$emit('save', formData)"
        :icon="isSaving ? 'lucide:loader-2' : 'lucide:save'"
        :disabled="isSaving"
      >
        حفظ التغييرات
      </PrimaryButton>
    </div>
  </div>
</template>

<script setup>
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Icon } from '@iconify/vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'lucide:info',
    },
    editEnabled: {
      type: Boolean,
      default: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  });

  const formData = ref({ ...props.initialData });

  // Watch for changes in initial data
  watch(
    () => props.initialData,
    (newVal) => {
      formData.value = { ...newVal };
    },
    { deep: true }
  );

  const updateFormData = (key, value) => {
    formData.value[key] = value;
  };

  const emit = defineEmits(['toggle-edit', 'save', 'cancel']);
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
