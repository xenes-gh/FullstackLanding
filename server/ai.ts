import OpenAI from 'openai';
import { config } from './config.js';

export type SummaryResult = {
  summary: string;
  source: 'openai' | 'fallback';
};

type SummaryPayload = {
  role?: string;
  stack?: string[];
  focus?: string[];
};

function createFallbackSummary(payload: SummaryPayload): SummaryResult {
  const stack = payload.stack?.slice(0, 5).join(', ') || 'TypeScript, frontend, API';

  return {
    source: 'fallback',
    summary: `Junior-разработчик с фокусом на понятный frontend, API-интеграции и аккуратную структуру проекта. Основной стек: ${stack}. В работе делает акцент на проверяемую логику, обработку ошибок и понятное описание решений.`
  };
}

export async function generateSummary(payload: SummaryPayload): Promise<SummaryResult> {
  if (!config.openai.apiKey) {
    return createFallbackSummary(payload);
  }

  const client = new OpenAI({ apiKey: config.openai.apiKey });

  const response = await client.responses.create({
    model: config.openai.model,
    instructions:
      'Ты помогаешь сформулировать краткое профессиональное summary для junior/fullstack developer. Ответь по-русски, 1-2 предложения, без преувеличений.',
    input: JSON.stringify(payload)
  });

  return {
    source: 'openai',
    summary: response.output_text.trim()
  };
}
