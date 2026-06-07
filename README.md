# PERUNIX

> Premium Web Development Agency — Solar Perun Design System

## Стек

- React 19 + Vite
- CSS Modules
- Framer Motion

## Палитра

| Токен             | Цвет      | Назначение              |
|-------------------|-----------|-------------------------|
| `--clr-bg`        | #F8F6F0 | Жемчужно-белый фон      |
| `--clr-surface`   | #EFECEA | Поверхности карточек    |
| `--clr-gold`      | #C9A84C | Золото — главный акцент |
| `--clr-gold-dark` | #A68A35 | Золото hover            |
| `--clr-blue`      | #4A90D9 | Небесный голубой        |
| `--clr-blue-dark` | #2E6FB5 | Голубой hover           |
| `--clr-silver`    | #B8BEC7 | Серебро, детали         |
| `--clr-text`      | #1A1A2E | Основной текст          |
| `--clr-muted`     | #6B7280 | Приглушённый текст      |

## Структура

perunix/
├── public/
│   └── favicon.ico
├── src/
├── components/
│   ├── landing/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.module.css
│   │   ├── HeroSection.jsx
│   │   ├── HeroSection.module.css
│   │   ├── ServicesSection.jsx
│   │   ├── ServicesSection.module.css
│   │   ├── PortfolioSection.jsx
│   │   ├── PortfolioSection.module.css
│   │   ├── TechSection.jsx
│   │   ├── TechSection.module.css
│   │   ├── PricingSection.jsx
│   │   ├── PricingSection.module.css
│   │   ├── ContactSection.jsx
│   │   ├── ContactSection.module.css
│   │   └── Footer.jsx
│   │       └── Footer.module.css
│   └── canvas/
│       └── LightningCanvas.jsx   ← анимированный 3D фон
├── hooks/
│   ├── useSound.js               ← Web Audio API
│   └── useVibrate.js             ← Vibration API
├── pages/
│   └── LandingPage.jsx
└── styles/
    └── global.css
├── index.html
├── vite.config.js
├── README.md
└── .gitignore

