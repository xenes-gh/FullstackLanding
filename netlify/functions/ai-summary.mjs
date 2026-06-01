const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8'
};

function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function createFallbackSummary(payload) {
  const stack = Array.isArray(payload.stack) ? payload.stack.slice(0, 5).join(', ') : 'TypeScript, frontend, API';

  return {
    source: 'fallback',
    summary: `Junior-разработчик с фокусом на понятный frontend, API-интеграции и аккуратную структуру проекта. Основной стек: ${stack}. В работе делает акцент на проверяемую логику, обработку ошибок и понятное описание решений.`
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(
      {
        success: false,
        message: 'Method not allowed'
      },
      405
    );
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    if (!process.env.OPENAI_API_KEY) {
      return json({
        success: true,
        message: 'Summary generated with fallback mode',
        data: createFallbackSummary(payload)
      });
    }

    const { default: OpenAI } = await import('openai');

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions:
        'Ты помогаешь сформулировать краткое профессиональное summary для junior/fullstack developer. Ответь по-русски, 1-2 предложения, без преувеличений.',
      input: JSON.stringify(payload)
    });

    return json({
      success: true,
      message: 'Summary generated',
      data: {
        source: 'openai',
        summary: response.output_text.trim()
      }
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return json(
        {
          success: false,
          message: 'Некорректный JSON-запрос'
        },
        400
      );
    }

    console.error('[ai-summary:error]', error);

    return json(
      {
        success: false,
        message: 'Не удалось сгенерировать AI-summary'
      },
      500
    );
  }
};
