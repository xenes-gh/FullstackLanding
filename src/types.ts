export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  comment: string;
};

export type ApiState = 'idle' | 'loading' | 'success' | 'error';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

export type ContactResponse = {
  deliveryMode: 'smtp' | 'console';
  ownerEmail: string;
};

export type AiSummaryResponse = {
  summary: string;
  source: 'openai' | 'fallback';
};
