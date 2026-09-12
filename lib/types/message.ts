export interface MessageAddResponse {
  success: boolean;
  data: {
    _id: string;
    type: 'sms' | 'email';
    title: string;
    content: string;
    recipients: string[];
    scheduleType: 'now' | 'scheduled' | 'draft';
    scheduleDate?: string;
    scheduleTime?: string;
    status: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled';
    deliveryStats: {
      total: number;
      sent: number;
      delivered: number;
      failed: number;
    };
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    templateId?: {
      _id: string;
      name: string;
      category: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface MessageListResponse {
  success: boolean;
  data: {
    messages: MessageAddResponse['data'][];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
