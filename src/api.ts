import type { AiSummaryResponse, ApiResponse, ContactPayload, ContactResponse } from './types';

async function requestJson<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw data;
  }

  return data;
}

export function sendContactForm(payload: ContactPayload): Promise<ApiResponse<ContactResponse>> {
  return requestJson<ContactResponse>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function generateAiSummary(): Promise<ApiResponse<AiSummaryResponse>> {
  return requestJson<AiSummaryResponse>('/api/ai-summary', {
    method: 'POST',
    body: JSON.stringify({
      role: 'Junior Fullstack Developer',
      stack: ['TypeScript', 'HTML', 'SCSS', 'C#/.NET', 'SQL', 'Unity basics'],
      focus: ['frontend', 'API integration', 'forms', 'clear project structure']
    })
  });
}
