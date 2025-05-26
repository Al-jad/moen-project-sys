export interface Attachment {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttachmentRequest {
  projectId: number;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface UpdateAttachmentRequest extends Partial<CreateAttachmentRequest> {
  id: number;
}
