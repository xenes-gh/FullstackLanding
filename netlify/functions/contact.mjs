import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя минимум из 2 символов').max(80, 'Имя слишком длинное'),
  phone: z
    .string()
    .trim()
    .min(7, 'Укажите телефон')
    .max(30, 'Телефон слишком длинный')
    .regex(/^[+\d\s()\-.]+$/, 'Телефон содержит недопустимые символы'),
  email: z.string().trim().email('Укажите корректный email').max(120, 'Email слишком длинный'),
  comment: z.string().trim().min(10, 'Комментарий должен быть не короче 10 символов').max(1500, 'Комментарий слишком длинный')
});

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

function mapZodErrors(error) {
  return error.issues.reduce((acc, issue) => {
    const field = String(issue.path[0]);
    acc[field] = issue.message;
    return acc;
  }, {});
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createOwnerEmail(data) {
  return `
    <h2>Новое сообщение с лендинга</h2>
    <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Комментарий:</strong></p>
    <p>${escapeHtml(data.comment).replaceAll('\n', '<br>')}</p>
  `;
}

function createUserCopyEmail(data) {
  return `
    <h2>${escapeHtml(data.name)}, спасибо за сообщение!</h2>
    <p>Это копия вашего обращения с лендинга Ксении Чернышевой.</p>
    <p><strong>Ваш комментарий:</strong></p>
    <p>${escapeHtml(data.comment).replaceAll('\n', '<br>')}</p>
  `;
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendContactEmails(data) {
  const ownerEmail = process.env.OWNER_EMAIL || 'owner@example.com';
  const deliveryMode = process.env.EMAIL_DELIVERY_MODE === 'smtp' ? 'smtp' : 'console';

  if (deliveryMode !== 'smtp' || !isSmtpConfigured()) {
    console.info('[contact-form:console-mode]', {
      toOwner: ownerEmail,
      copyToUser: data.email,
      payload: data
    });

    return {
      deliveryMode: 'console',
      ownerEmail
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const from = process.env.MAIL_FROM || 'Landing Contact <no-reply@example.com>';

  await transporter.sendMail({
    from,
    to: ownerEmail,
    replyTo: data.email,
    subject: `Новое сообщение с лендинга от ${data.name}`,
    html: createOwnerEmail(data)
  });

  await transporter.sendMail({
    from,
    to: data.email,
    subject: 'Копия вашего сообщения с лендинга',
    html: createUserCopyEmail(data)
  });

  return {
    deliveryMode: 'smtp',
    ownerEmail
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
    const body = JSON.parse(event.body || '{}');
    const data = contactSchema.parse(body);
    const delivery = await sendContactEmails(data);

    return json({
      success: true,
      message: 'Сообщение обработано',
      data: delivery
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json(
        {
          success: false,
          message: 'Проверьте поля формы',
          errors: mapZodErrors(error)
        },
        400
      );
    }

    if (error instanceof SyntaxError) {
      return json(
        {
          success: false,
          message: 'Некорректный JSON-запрос'
        },
        400
      );
    }

    console.error('[contact-form:error]', error);

    return json(
      {
        success: false,
        message: 'Не удалось отправить сообщение. Попробуйте позже.'
      },
      500
    );
  }
};
