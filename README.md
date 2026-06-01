# Ksenia Fullstack Landing

Небольшой лендинг-презентация junior/fullstack-разработчика.

Проект показывает полный цикл: frontend → API → валидация → отправка формы → loading/success/error состояния → optional AI-интеграция.

## Стек

- TypeScript
- HTML
- SCSS
- Vite
- Node.js
- Express
- Zod
- Nodemailer
- OpenAI API опционально

## Что реализовано

- адаптивный лендинг с секциями: о себе, стек, подход к работе, кейсы, контакты;
- форма обратной связи с полями: имя, телефон, email, комментарий;
- клиентская отправка формы через `fetch`;
- backend API `/api/contact`;
- серверная валидация данных через `zod`;
- обработка loading/success/error состояний на frontend;
- формирование письма владельцу сайта;
- формирование копии письма пользователю;
- режим `console` для локальной проверки без SMTP;
- режим `smtp` для реальной отправки писем;
- optional AI endpoint `/api/ai-summary` для генерации краткого summary профиля.

## Как запустить проект локально

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. Запустить frontend и backend:

```bash
npm run dev
```

4. Открыть сайт:

```text
http://localhost:5173
```

Backend API работает на:

```text
http://localhost:4174
```

## Как проверить форму

По умолчанию включён режим:

```env
EMAIL_DELIVERY_MODE=console
```

В этом режиме реальные письма не отправляются, но backend принимает форму, валидирует данные и выводит сформированное сообщение в консоль сервера.

Для реальной отправки писем нужно указать SMTP-настройки в `.env`:

```env
EMAIL_DELIVERY_MODE=smtp
OWNER_EMAIL=your-email@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM="Ksenia Landing <no-reply@example.com>"
```

После этого при отправке формы:

- письмо приходит владельцу сайта на `OWNER_EMAIL`;
- копия письма приходит пользователю на email из формы.

## Как реализована API часть

API реализован на Node.js + Express.

Основные endpoints:

```text
GET /api/health
POST /api/contact
POST /api/ai-summary
```

`POST /api/contact`:

1. принимает данные формы;
2. валидирует их через `zod`;
3. возвращает ошибки по полям, если данные некорректные;
4. формирует письмо владельцу сайта;
5. формирует копию письма пользователю;
6. возвращает успешный ответ frontend.

## AI-интеграция

В проекте есть endpoint:

```text
POST /api/ai-summary
```

Он используется кнопкой `Generate summary` на лендинге.

Если задан `OPENAI_API_KEY`, backend обращается к OpenAI API и генерирует короткое summary профиля.

Если ключ не задан, используется fallback-summary. Это сделано, чтобы проект можно было проверить локально без платного API-ключа.

Пример переменных:

```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-5.5
```

API-ключ используется только на сервере и не попадает в frontend.

## Какие AI-инструменты использовались

При выполнении проекта использовался AI-assisted подход:

- помощь в декомпозиции тестового задания;
- помощь в планировании структуры проекта;
- помощь в формулировке README;
- помощь в проверке требований: frontend, API, обработка ошибок, состояния формы;
- помощь в генерации чернового кода, который затем проверялся и корректировался вручную.

## Что пришлось исправлять и контролировать вручную

Вручную контролировались:

- структура проекта;
- корректность TypeScript-типов;
- валидация формы;
- тексты для страницы;
- логика loading/success/error состояний;
- безопасность API-ключей: OpenAI и SMTP находятся только в `.env` на серверной стороне;
- проверка, что форма работает не только визуально, но и через backend API.

## Сборка и запуск production-версии

```bash
npm run build
npm start
```

После сборки Express отдаёт frontend из папки `dist` и обслуживает API.

## Структура проекта

```text
src/
  api.ts
  main.ts
  profile.ts
  styles.scss
  types.ts
server/
  ai.ts
  app.ts
  config.ts
  mailer.ts
  validation.ts
```

## Деплой

Проект можно задеплоить на Render, Railway или аналогичную платформу как Node.js приложение.

Рекомендуемые команды для деплоя:

```bash
npm install
npm run build
npm start
```

Необходимо добавить environment variables из `.env.example` в настройках платформы.
