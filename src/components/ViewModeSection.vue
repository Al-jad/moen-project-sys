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

    <slot name="view-content" :isEditing="isEditing">
      <!-- Default fallback content -->
      <div class="p-4">
        <p class="text-foreground-muted">No content provided</p>
      </div>
    </slot>
  </div>
</template>

<script setup>
  import PrimaryButton from '@/components/PrimaryButton.vue';
  import { Icon } from '@iconify/vue';

  defineProps({
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
  });

  defineEmits(['toggle-edit']);
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
