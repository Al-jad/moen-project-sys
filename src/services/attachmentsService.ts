import axiosInstance from '@/plugins/axios';
import type { CreateAttachmentRequest, UpdateAttachmentRequest } from '@/types/attachment';

class AttachmentsService {
  async getAllAttachments(projectId?: string | number) {
    let url = '/api/Attachment';
    if (projectId && projectId !== 'all') {
      url = `/api/Attachment?projectId=${projectId}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  }

  async getAttachmentById(id: string | number) {
    const response = await axiosInstance.get(`/api/Attachment/${id}`);
    return response.data;
  }

  async createAttachment(attachmentData: CreateAttachmentRequest) {
    const response = await axiosInstance.post('/api/Attachment', attachmentData);
    return response.data;
  }

  async updateAttachment(id: string | number, attachmentData: UpdateAttachmentRequest) {
    const response = await axiosInstance.put(`/api/Attachment/${id}`, attachmentData);
    return response.data;
  }

  async deleteAttachment(id: string | number) {
    const response = await axiosInstance.delete(`/api/Attachment/${id}`);
    return response.data;
  }

  async getAttachmentsByProject(projectId: string | number) {
    const response = await axiosInstance.get(`/api/Attachment?projectId=${projectId}`);
    return response.data;
  }
}

export const attachmentsService = new AttachmentsService();
export default attachmentsService;
