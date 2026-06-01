import './styles.scss';
import { generateAiSummary, sendContactForm } from './api';
import { profile } from './profile';
import type { ApiResponse, ApiState, ContactPayload } from './types';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root was not found');
}

let contactState: ApiState = 'idle';
let aiState: ApiState = 'idle';
let formMessage = '';
let aiSummary = 'Нажмите кнопку, чтобы сгенерировать короткое AI-summary профиля.';
let fieldErrors: Record<string, string> = {};

function render(): void {
  app.innerHTML = `
    <header class="site-header">
      <a class="logo" href="#top" aria-label="На главную">KC</a>
      <nav class="nav" aria-label="Главная навигация">
        <a href="#about">О себе</a>
        <a href="#workflow">Подход</a>
        <a href="#projects">Кейсы</a>
        <a href="#contact">Контакты</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero section">
        <div class="hero__content">
          <p class="eyebrow">${profile.city}</p>
          <h1>${profile.name}<br /><span>${profile.role}</span></h1>
          <p class="hero__lead">${profile.intro}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="#contact">Связаться</a>
            <a class="button button--ghost" href="${profile.github}" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <aside class="hero-card" aria-label="Краткая информация">
          <span class="hero-card__label">Focus</span>
          <strong>Frontend → API → Error handling → Result</strong>
          <p>Мне важно показывать не только интерфейс, но и рабочую логику: запросы, валидацию, состояние загрузки, успех и ошибки.</p>
        </aside>
      </section>

      <section class="section grid-section" id="about">
        <div>
          <p class="eyebrow">01 / About</p>
          <h2>О себе и стеке</h2>
          <p class="section-text">Я развиваюсь как junior/fullstack-разработчик. В проектах стараюсь сначала понять задачу, потом разделить её на понятные этапы и проверять результат на каждом шаге.</p>
        </div>
        <div class="card-grid">
          <article class="card">
            <h3>Стек</h3>
            <div class="tags">${profile.stack.map((item) => `<span>${item}</span>`).join('')}</div>
          </article>
          <article class="card">
            <h3>Опыт</h3>
            <ul>${profile.experience.map((item) => `<li>${item}</li>`).join('')}</ul>
          </article>
          <article class="card">
            <h3>Направления</h3>
            <ul>${profile.directions.map((item) => `<li>${item}</li>`).join('')}</ul>
          </article>
        </div>
      </section>

      <section class="section workflow" id="workflow">
        <p class="eyebrow">02 / Workflow</p>
        <h2>Как я работаю</h2>
        <div class="steps">
          ${[
            ['Разобраться', 'Уточняю цель, ограничения и ожидаемый результат.'],
            ['Разбить задачу', 'Делю работу на небольшие шаги: интерфейс, API, валидация, состояния.'],
            ['Реализовать', 'Пишу код с понятной структурой и проверяю основные сценарии.'],
            ['Проверить', 'Тестирую успешный сценарий, ошибки, пустые поля и некорректные данные.']
          ]
            .map(
              ([title, text], index) => `
              <article class="step">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <h3>${title}</h3>
                <p>${text}</p>
              </article>`
            )
            .join('')}
        </div>
        <div class="ai-panel">
          <div>
            <p class="eyebrow">AI helper</p>
            <h3>AI-summary профиля</h3>
            <p>${aiSummary}</p>
          </div>
          <button class="button button--primary" id="ai-summary-button" ${aiState === 'loading' ? 'disabled' : ''}>
            ${aiState === 'loading' ? 'Генерация...' : 'Generate summary'}
          </button>
        </div>
      </section>

      <section class="section" id="projects">
        <p class="eyebrow">03 / Cases</p>
        <h2>Кейсы и опыт</h2>
        <div class="project-list">
          ${profile.projects
            .map(
              (project) => `
              <article class="project-card">
                <div>
                  <p class="project-card__type">${project.type}</p>
                  <h3>${project.title}</h3>
                  <p>${project.description}</p>
                  <p><strong>Что делала лично:</strong> ${project.contribution}</p>
                </div>
                <div class="tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
              </article>`
            )
            .join('')}
        </div>
      </section>

      <section class="section contact" id="contact">
        <div>
          <p class="eyebrow">04 / Contact</p>
          <h2>Форма обратной связи</h2>
          <p class="section-text">Форма отправляет данные на backend API. Сервер валидирует поля, формирует письмо владельцу сайта и копию пользователю. В интерфейсе есть loading, success и error состояния.</p>
          <div class="contact-links">
            <a href="mailto:${profile.email}">${profile.email}</a>
            <a href="${profile.github}" target="_blank" rel="noreferrer">github.com/xenes-gh</a>
          </div>
        </div>
        <form class="contact-form" id="contact-form" novalidate>
          <label>
            Имя
            <input name="name" type="text" placeholder="Ваше имя" autocomplete="name" />
            <span class="field-error">${fieldErrors.name ?? ''}</span>
          </label>
          <label>
            Телефон
            <input name="phone" type="tel" placeholder="+7 999 000-00-00" autocomplete="tel" />
            <span class="field-error">${fieldErrors.phone ?? ''}</span>
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="name@example.com" autocomplete="email" />
            <span class="field-error">${fieldErrors.email ?? ''}</span>
          </label>
          <label>
            Комментарий
            <textarea name="comment" rows="5" placeholder="Напишите сообщение"></textarea>
            <span class="field-error">${fieldErrors.comment ?? ''}</span>
          </label>
          <button class="button button--primary" type="submit" ${contactState === 'loading' ? 'disabled' : ''}>
            ${contactState === 'loading' ? 'Отправка...' : 'Отправить'}
          </button>
          <p class="form-status form-status--${contactState}" role="status">${formMessage}</p>
        </form>
      </section>
    </main>
  `;

  bindEvents();
}

function bindEvents(): void {
  document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', handleContactSubmit);
  document.querySelector<HTMLButtonElement>('#ai-summary-button')?.addEventListener('click', handleAiSummaryClick);
}

function getFormPayload(form: HTMLFormElement): ContactPayload {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    comment: String(formData.get('comment') ?? '').trim()
  };
}

async function handleContactSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;

  contactState = 'loading';
  formMessage = 'Отправляем сообщение...';
  fieldErrors = {};
  render();

  try {
    const result = await sendContactForm(getFormPayload(form));
    contactState = 'success';
    formMessage = result.data?.deliveryMode === 'console'
      ? 'Демо-режим: письмо сформировано и выведено в консоль сервера. Для реальной отправки настройте SMTP.'
      : 'Сообщение успешно отправлено. Копия письма отправлена на указанный email.';
  } catch (error) {
    const apiError = error as ApiResponse<unknown>;
    contactState = 'error';
    formMessage = apiError.message || 'Не удалось отправить сообщение. Проверьте данные и попробуйте ещё раз.';
    fieldErrors = apiError.errors ?? {};
  }

  render();
}

async function handleAiSummaryClick(): Promise<void> {
  aiState = 'loading';
  aiSummary = 'Генерирую краткое описание...';
  render();

  try {
    const result = await generateAiSummary();
    aiState = 'success';
    aiSummary = result.data?.summary ?? 'AI-summary не вернул текст.';
  } catch (error) {
    aiState = 'error';
    aiSummary = 'AI-summary сейчас недоступен. Основной функционал формы продолжает работать.';
  }

  render();
}

render();
