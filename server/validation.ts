import { z } from 'zod';

export const contactSchema = z.object({
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

export type ContactFormData = z.infer<typeof contactSchema>;

export function mapZodErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = String(issue.path[0]);
    acc[field] = issue.message;
    return acc;
  }, {});
}
