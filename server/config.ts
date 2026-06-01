import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT ?? 4174);

export const config = {
  port,
  siteOrigin: process.env.SITE_ORIGIN ?? 'http://localhost:5173',
  ownerEmail: process.env.OWNER_EMAIL ?? 'owner@example.com',
  emailDeliveryMode: process.env.EMAIL_DELIVERY_MODE === 'smtp' ? 'smtp' : 'console',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM ?? 'Landing Contact <no-reply@example.com>'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL ?? 'gpt-5.5'
  }
};
