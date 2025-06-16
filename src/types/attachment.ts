export interface Attachment {
  url: string;
  title: string;
  description: string;
  projectId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttachmentRequest {
  url: string;
  title: string;
  description: string;
  projectId: string;
}

export interface UpdateAttachmentRequest extends Partial<CreateAttachmentRequest> {
  id: number;
}
