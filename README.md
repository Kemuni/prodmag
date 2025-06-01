This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ПродМаг - Система управления продовольственным магазином

Веб-приложение для директора продовольственного магазина, разработанное с использованием Material UI, Next.js и TypeScript.

## Функциональность

- **Авторизация и регистрация** - локальная аутентификация без использования сервера
- **Панель управления** с переключением между разделами:
  - **Товары** - управление ассортиментом магазина
  - **Продажи** - учет и просмотр продаж
  - **Поставки** - управление поставками товаров
  - **Аналитика** - визуализация данных о продажах и товарах

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Material UI 7
- **Управление состоянием**: Zustand
- **Визуализация данных**: MUI X Charts
- **Таблицы данных**: MUI X Data Grid
- **Работа с датами**: MUI X Date Pickers, Dayjs

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone <url-репозитория>
cd prodmag
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение в режиме разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Учетные данные для входа

Для входа в систему используйте следующие учетные данные:

- **Имя пользователя**: director
- **Пароль**: password123

Также вы можете зарегистрировать нового пользователя через форму регистрации.

## Сборка для продакшн

```bash
npm run build
npm start
```

## Особенности реализации

- **Локальное хранение данных**: Все данные хранятся в localStorage браузера
- **Адаптивный дизайн**: Приложение корректно отображается на устройствах с разными размерами экрана
- **Тематизация**: Поддержка светлой и темной темы
- **Локализация**: Интерфейс на русском языке
