export const profile = {
  name: 'Ксения Чернышева',
  role: 'Junior Fullstack Developer',
  city: 'Сургут / удалённо',
  email: 'chernyshevaKV@icloud.com',
  github: 'https://github.com/xenes-gh',
  intro:
    'Развиваюсь в fullstack-разработке: frontend, API, C#/.NET и прикладные проекты. Мне важно писать понятный код, разбираться в задаче и доводить результат до рабочей проверки.',
  stack: ['TypeScript', 'JavaScript', 'HTML', 'SCSS/CSS', 'C#', '.NET', 'SQL', 'Git', 'Unity basics'],
  directions: ['Frontend', 'API-интеграции', 'C#/.NET backend', 'Unity / симуляторы', 'AI-assisted development'],
  experience: [
    'Учебные и тестовые проекты на C#/.NET и TypeScript',
    'Работа с SQL-запросами, базами данных и базовой серверной логикой',
    'Тестовый Unity-проект на Mirror + VContainer для сетевых сообщений',
    'Опыт оформления README, структуры проекта и демонстрации результата'
  ],
  projects: [
    {
      title: 'Mirror Network Messages Test',
      type: 'Unity / C#',
      description:
        'Тестовый проект с сервисом сетевых сообщений на Mirror. Реализованы сообщения от клиента к серверу и от сервера клиентам, VContainer DI и простая демонстрация через UI.',
      contribution: 'Лично настраивала Unity-проект, Mirror, транспорт, сервис сообщений, тестовый UI, README и GitHub-репозиторий.',
      tags: ['Unity', 'Mirror', 'C#', 'VContainer']
    },
    {
      title: 'Zeno Life Planner',
      type: 'Blazor / C#',
      description:
        'Учебный проект веб-приложения-планировщика с рабочим пространством, виджетами и идеей drag-and-drop конструктора.',
      contribution:
        'Прорабатывала структуру страниц, логику пользовательского рабочего пространства, модель данных и презентацию проекта.',
      tags: ['Blazor', 'C#', 'UI', 'Planning']
    },
    {
      title: 'Fullstack Landing with API',
      type: 'TypeScript / Node.js',
      description:
        'Этот лендинг: адаптивный frontend, backend API для формы, обработка loading/success/error и optional AI summary endpoint.',
      contribution:
        'Реализована структура проекта, форма обратной связи, API-валидация, email-логика и AI-интеграция на серверной стороне.',
      tags: ['TypeScript', 'SCSS', 'Express', 'OpenAI API']
    }
  ]
};
