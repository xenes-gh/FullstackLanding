import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZodError } from 'zod';
import { generateSummary } from './ai.js';
import { config } from './config.js';
import { sendContactEmails } from './mailer.js';
import { contactSchema, mapZodErrors } from './validation.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

app.use(cors({ origin: config.siteOrigin }));
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ success: true, message: 'API is running' });
});

app.post('/api/contact', async (request, response) => {
  try {
    const data = contactSchema.parse(request.body);
    const delivery = await sendContactEmails(data);

    response.json({
      success: true,
      message: 'Сообщение обработано',
      data: delivery
    });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        success: false,
        message: 'Проверьте поля формы',
        errors: mapZodErrors(error)
      });
      return;
    }

    console.error('[contact-form:error]', error);
    response.status(500).json({
      success: false,
      message: 'Не удалось отправить сообщение. Попробуйте позже.'
    });
  }
});

app.post('/api/ai-summary', async (request, response) => {
  try {
    const result = await generateSummary(request.body);

    response.json({
      success: true,
      message: 'Summary generated',
      data: result
    });
  } catch (error) {
    console.error('[ai-summary:error]', error);
    response.status(500).json({
      success: false,
      message: 'Не удалось сгенерировать AI-summary'
    });
  }
});

app.use(express.static(distDir));

app.get('*', (_request, response) => {
  response.sendFile(path.join(distDir, 'index.html'));
});

app.listen(config.port, () => {
  console.info(`API server started: http://localhost:${config.port}`);
});
