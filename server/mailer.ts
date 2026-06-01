import nodemailer from 'nodemailer';
import { config } from './config.js';
import type { ContactFormData } from './validation.js';

export type DeliveryResult = {
  deliveryMode: 'smtp' | 'console';
  ownerEmail: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createOwnerEmail(data: ContactFormData): string {
  return `
    <h2>Новое сообщение с лендинга</h2>
    <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Комментарий:</strong></p>
    <p>${escapeHtml(data.comment).replaceAll('\n', '<br>')}</p>
  `;
}

function createUserCopyEmail(data: ContactFormData): string {
  return `
    <h2>${escapeHtml(data.name)}, спасибо за сообщение!</h2>
    <p>Это копия вашего обращения с лендинга Ксении Чернышевой.</p>
    <p><strong>Ваш комментарий:</strong></p>
    <p>${escapeHtml(data.comment).replaceAll('\n', '<br>')}</p>
  `;
}

function isSmtpConfigured(): boolean {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}

export async function sendContactEmails(data: ContactFormData): Promise<DeliveryResult> {
  if (config.emailDeliveryMode !== 'smtp' || !isSmtpConfigured()) {
    console.info('[contact-form:console-mode]', {
      toOwner: config.ownerEmail,
      copyToUser: data.email,
      payload: data
    });

    return {
      deliveryMode: 'console',
      ownerEmail: config.ownerEmail
    };
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to: config.ownerEmail,
    replyTo: data.email,
    subject: `Новое сообщение с лендинга от ${data.name}`,
    html: createOwnerEmail(data)
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to: data.email,
    subject: 'Копия вашего сообщения с лендинга',
    html: createUserCopyEmail(data)
  });

  return {
    deliveryMode: 'smtp',
    ownerEmail: config.ownerEmail
  };
}
