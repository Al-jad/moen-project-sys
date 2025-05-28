import { attachmentsService } from '@/services/attachmentsService';
import type {
  Attachment,
  CreateAttachmentRequest,
  UpdateAttachmentRequest,
} from '@/types/attachment';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAttachmentsStore = defineStore('attachments', () => {
  // State
  const attachments = ref<Attachment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetch = ref<number | null>(null);
  const selectedProjectId = ref<string | number>('all');

  // Getters
  const getAllAttachments = computed(() => attachments.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);
  const getSelectedProjectId = computed(() => selectedProjectId.value);

  const getAttachmentsByProject = computed(() => (projectId: string | number) => {
    if (projectId === 'all') return attachments.value;
    return attachments.value.filter(
      (attachment) => attachment.projectId?.toString() === projectId?.toString()
    );
  });

  const getAttachmentById = computed(() => (id: string | number) => {
    return attachments.value.find((attachment) => attachment.id?.toString() === id?.toString());
  });

  const getAttachmentsCount = computed(() => attachments.value.length);

  // Actions
  const fetchAttachments = async (projectId?: string | number, force = false) => {
    // If we have data and it's less than 2 minutes old, don't refetch
    const CACHE_TIME = 2 * 60 * 1000; // 2 minutes
    if (
      !force &&
      attachments.value.length > 0 &&
      lastFetch.value &&
      Date.now() - lastFetch.value < CACHE_TIME &&
      (projectId === selectedProjectId.value || (!projectId && selectedProjectId.value === 'all'))
    ) {
      return attachments.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await attachmentsService.getAllAttachments(projectId);
      attachments.value = response;
      selectedProjectId.value = projectId || 'all';
      lastFetch.value = Date.now();
      return attachments.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch attachments';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addAttachment = async (attachmentData: CreateAttachmentRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await attachmentsService.createAttachment(attachmentData);
      attachments.value.push(response);
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add attachment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAttachment = async (id: string | number, attachmentData: UpdateAttachmentRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await attachmentsService.updateAttachment(id, attachmentData);
      const index = attachments.value.findIndex((a) => a.id?.toString() === id?.toString());
      if (index !== -1) {
        attachments.value[index] = response;
      }
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update attachment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteAttachment = async (id: string | number) => {
    loading.value = true;
    error.value = null;

    try {
      await attachmentsService.deleteAttachment(id);
      attachments.value = attachments.value.filter((a) => a.id?.toString() !== id?.toString());
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete attachment';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setSelectedProjectId = (projectId: string | number) => {
    selectedProjectId.value = projectId;
  };

  const clearError = () => {
    error.value = null;
  };

  const refreshAttachments = async () => {
    return await fetchAttachments(selectedProjectId.value, true);
  };

  return {
    // State
    attachments,
    loading,
    error,
    selectedProjectId,
    // Getters
    getAllAttachments,
    isLoading,
    getError,
    getSelectedProjectId,
    getAttachmentsByProject,
    getAttachmentById,
    getAttachmentsCount,
    // Actions
    fetchAttachments,
    addAttachment,
    updateAttachment,
    deleteAttachment,
    setSelectedProjectId,
    clearError,
    refreshAttachments,
  };
});
