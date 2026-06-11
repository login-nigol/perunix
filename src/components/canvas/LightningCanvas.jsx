/* ===================== LIGHTNING CANVAS ===================== */
/* Компонент: LightningCanvas.jsx                              */
/* Рисует анимированный фон с молниями, кодом и линиями       */
/* Использует Canvas 2D API — лёгкий, не грузит устройство    */

import { useEffect, useRef } from 'react'
import styles from './LightningCanvas.module.css'

/* ===================== КОНФИГ ===================== */
/* Все настройки анимации в одном месте — меняй здесь */
const CONFIG = {
    /* Количество диагональных фоновых линий */
    LINES_COUNT: 0,

    /* Количество летающих частиц-искр */
    PARTICLES_COUNT: 0,

    /* Количество молний одновременно на экране */
    LIGHTNING_COUNT: 6,

    /* Скорость движения частиц */
    PARTICLE_SPEED: 0.4,

    /* Цвета молний — золото, голубой, серебро */
    LIGHTNING_COLORS: ['#C9A84C', '#4A90D9', '#B8BEC7'],

    /* Фрагменты кода плывущие по фону */
    CODE_SNIPPETS: [
        'const perunix = () => {}',
        'npm run dev',
        'git push origin master',
        '<Perunix />',
        'flex: 1',
        'transform: scale(1.1)',
        'await fetch("/api")',
        'useState(null)',
        'border-radius: 0.8em',
        'export default App',
        'z-index: 100',
        '{ data } = props',
        'onClick={handleClick}',
        '.map((item) => <>)',
    ],
}

/* ===================== КЛАСС LINE ===================== */
/* Диагональные фоновые линии — мигают через синус      */
class Line {
    constructor(canvas) {
        /* Сохраняем ссылку на canvas для доступа к размерам */
        this.canvas = canvas
        this.reset()
    }

    /* Инициализируем случайную линию */
    reset() {
        /* Стартовая точка — случайная на экране */
        this.x1 = Math.random() * this.canvas.width
        this.y1 = Math.random() * this.canvas.height

        /* Угол линии — полностью случайный, включая диагонали */
        const angle = Math.random() * Math.PI * 2
        const length = 100 + Math.random() * 300

        /* Конечная точка через тригонометрию угла */
        this.x2 = this.x1 + Math.cos(angle) * length
        this.y2 = this.y1 + Math.sin(angle) * length

        /* Базовая прозрачность линии — очень тихая */
        this.alpha = 0.03 + Math.random() * 0.07

        /* Скорость мигания */
        this.speed = 0.002 + Math.random() * 0.005

        /* Начальная фаза мигания — у каждой линии своя */
        this.phase = Math.random() * Math.PI * 2
    }

    /* Рисуем линию с мигающей прозрачностью */
    draw(ctx, time) {
        /* Прозрачность пульсирует через синус — создаёт мигание */
        const alpha = this.alpha * (0.5 + 0.5 * Math.sin(time * this.speed + this.phase))
        ctx.strokeStyle = `rgba(74, 144, 217, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()
    }
}

/* ===================== КЛАСС PARTICLE ===================== */
/* Летающие частицы-искры золотого цвета                    */
class Particle {
    constructor(canvas) {
        /* Сохраняем ссылку на canvas */
        this.canvas = canvas
        this.reset()
    }

    /* Сбрасываем частицу в случайную позицию */
    reset() {
        /* Случайная позиция на экране */
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height

        /* Случайный размер искры */
        this.size = 1 + Math.random() * 2

        /* Начальная прозрачность */
        this.alpha = 0.3 + Math.random() * 0.7

        /* Случайное направление движения через угол */
        const angle = Math.random() * Math.PI * 2
        this.vx = Math.cos(angle) * CONFIG.PARTICLE_SPEED
        this.vy = Math.sin(angle) * CONFIG.PARTICLE_SPEED

        /* Время жизни частицы в кадрах */
        this.life = 0
        this.maxLife = 100 + Math.random() * 200
    }

    /* Обновляем позицию и прозрачность каждый кадр */
    update() {
        /* Двигаем частицу */
        this.x += this.vx
        this.y += this.vy
        this.life += 1

        /* Плавно затухаем к концу жизни */
        this.alpha = (1 - this.life / this.maxLife) * 0.7

        /* Сбрасываем если умерла или вышла за экран */
        if (
            this.life >= this.maxLife ||
            this.x < 0 || this.x > this.canvas.width ||
            this.y < 0 || this.y > this.canvas.height
        ) {
            this.reset()
        }
    }

    /* Рисуем искру как маленький круг */
    draw(ctx) {
        ctx.fillStyle = `rgba(201, 168, 76, ${this.alpha})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}

/* ===================== КЛАСС LIGHTNING ===================== */
/* Зигзагообразные молнии по всему экрану                    */
class Lightning {
    constructor(canvas) {
        /* Сохраняем ссылку на canvas */
        this.canvas = canvas
        this.reset()
    }

    /* Генерируем новую молнию в случайном месте экрана */
    reset() {
        /* Стартовая точка — ЛЮБОЕ место на экране */
        this.startX = Math.random() * this.canvas.width
        this.startY = Math.random() * this.canvas.height

        /* Конечная точка — случайное смещение от старта */
        this.endX = this.startX + (Math.random() - 0.5) * 500
        this.endY = this.startY + (Math.random() - 0.5) * 400

        /* Случайный цвет из палитры */
        this.color = CONFIG.LIGHTNING_COLORS[
            Math.floor(Math.random() * CONFIG.LIGHTNING_COLORS.length)
        ]

        /* Прозрачность вспышки */
        this.alpha = 0.6 + Math.random() * 0.4

        /* Время жизни одной вспышки в кадрах */
        this.life = 0
        this.maxLife = 30 + Math.random() * 40

        /* Генерируем зигзаг точек молнии */
        this.points = this.generatePoints()

        /* Случайная задержка перед появлением */
        this.delay = Math.random() * 50
        /* Задержка перед следующей вспышкой */
        this.delayMax = 80 + Math.random() * 200
    }

    /* Генерируем зигзагообразные точки молнии */
    generatePoints() {
        /* Начинаем со стартовой точки */
        const points = [{ x: this.startX, y: this.startY }]

        /* Количество зигзагов */
        const steps = 8 + Math.floor(Math.random() * 6)

        for (let i = 1; i <= steps; i++) {
            const progress = i / steps

            /* Линейная интерполяция от старта до конца */
            /* + случайное отклонение для зигзага        */
            points.push({
                x: this.startX + (this.endX - this.startX) * progress + (Math.random() - 0.5) * 80,
                y: this.startY + (this.endY - this.startY) * progress + (Math.random() - 0.5) * 40,
            })
        }

        /* Добавляем конечную точку */
        points.push({ x: this.endX, y: this.endY })
        return points
    }

    /* Обновляем состояние молнии каждый кадр */
    update() {
        /* Ждём задержку перед появлением */
        if (this.delay > 0) {
            this.delay--
            return
        }

        this.life++

        /* После окончания жизни — ждём и генерируем новую */
        if (this.life >= this.maxLife) {
            this.delay = this.delayMax
            this.life = 0
            /* Новые случайные точки для следующей вспышки */
            this.startX = Math.random() * this.canvas.width
            this.startY = Math.random() * this.canvas.height
            this.endX = this.startX + (Math.random() - 0.5) * 500
            this.endY = this.startY + (Math.random() - 0.5) * 400
            this.points = this.generatePoints()
        }
    }

    /* Рисуем молнию по зигзаг-точкам */
    draw(ctx) {
        /* Не рисуем во время задержки */
        if (this.delay > 0 || this.points.length < 2) return

        /* Затухание прозрачности к концу жизни */
        const lifeAlpha = 1 - this.life / this.maxLife

        /* Применяем цвет с прозрачностью в зависимости от цвета */
        if (this.color === '#C9A84C') {
            ctx.strokeStyle = `rgba(201, 168, 76, ${this.alpha * lifeAlpha})`
        } else if (this.color === '#4A90D9') {
            ctx.strokeStyle = `rgba(74, 144, 217, ${this.alpha * lifeAlpha})`
        } else {
            ctx.strokeStyle = `rgba(184, 190, 199, ${this.alpha * lifeAlpha})`
        }

        /* Случайная толщина — молния дрожит */
        ctx.lineWidth = 1 + Math.random() * 1.5

        /* Свечение вокруг молнии */
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color

        /* Рисуем зигзаг соединяя все точки */
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.stroke()

        /* Сбрасываем shadow — иначе всё будет светиться */
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
    }
}

/* ===================== КЛАСС CODE SNIPPET ===================== */
/* Фрагменты кода медленно плывут вверх по экрану             */
class CodeSnippet {
    constructor(canvas) {
        /* Сохраняем ссылку на canvas */
        this.canvas = canvas
        this.reset()
    }

    /* Инициализируем случайный фрагмент кода */
    reset() {
        /* Случайная позиция на экране */
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height

        /* Случайный фрагмент кода из конфига */
        this.text = CONFIG.CODE_SNIPPETS[
            Math.floor(Math.random() * CONFIG.CODE_SNIPPETS.length)
        ]

        /* Очень тихая прозрачность — фон не должен давить */
        this.alpha = 0.08 + Math.random() * 0.12

        /* Случайный размер шрифта */
        this.size = 10 + Math.random() * 4

        /* Скорость дрейфа вверх */
        this.vy = -0.1 - Math.random() * 0.2

        /* Время жизни в кадрах */
        this.life = 0
        this.maxLife = 300 + Math.random() * 300
    }

    /* Обновляем позицию каждый кадр */
    update() {
        /* Двигаем вверх */
        this.y += this.vy
        this.life += 1

        /* Сбрасываем если вышел за верх экрана или умер */
        if (this.life >= this.maxLife || this.y < -20) this.reset()
    }

    /* Рисуем фрагмент кода с плавным появлением */
    draw(ctx) {
        const lifeRatio = this.life / this.maxLife

        /* Плавное появление в начале и исчезновение в конце */
        const fadeAlpha = lifeRatio < 0.1
            ? lifeRatio * 10 * this.alpha          /* появление */
            : lifeRatio > 0.9
                ? (1 - lifeRatio) * 10 * this.alpha  /* исчезновение */
                : this.alpha                          /* середина жизни */

        ctx.fillStyle = `rgba(74, 144, 217, ${fadeAlpha})`
        ctx.font = `${this.size}px monospace`
        ctx.fillText(this.text, this.x, this.y)
    }
}

/* ===================== КОМПОНЕНТ ===================== */
/* Основной React компонент — монтирует canvas и        */
/* запускает анимационный цикл                          */
function LightningCanvas() {
    /* Ссылка на DOM элемент <canvas> */
    const canvasRef = useRef(null)

    /* Ссылка на ID requestAnimationFrame для отмены при размонтировании */
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        /* Подгоняем размер канваса под размер окна */
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        /* Сразу устанавливаем размер */
        resize()

        /* Слушаем изменение размера окна */
        window.addEventListener('resize', resize)

        /* Создаём все объекты анимации ПОСЛЕ resize */
        /* Важно — иначе canvas.width/height будет 0  */
        const lines = Array.from({ length: CONFIG.LINES_COUNT }, () => new Line(canvas))
        const particles = Array.from({ length: CONFIG.PARTICLES_COUNT }, () => new Particle(canvas))
        const lightnings = Array.from({ length: CONFIG.LIGHTNING_COUNT }, () => new Lightning(canvas))
        const snippets = Array.from({ length: 12 }, () => new CodeSnippet(canvas))

        /* Счётчик кадров для синусоидальных анимаций */
        let time = 0

        /* Главный анимационный цикл — вызывается каждый кадр */
        const animate = () => {
            /* Очищаем весь канвас перед новым кадром */
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            /* 1. Рисуем диагональные фоновые линии */
            lines.forEach(line => line.draw(ctx, time))

            /* 2. Обновляем и рисуем частицы-искры */
            particles.forEach(p => {
                p.update()
                p.draw(ctx)
            })

            /* 3. Обновляем и рисуем молнии */
            lightnings.forEach(l => {
                l.update()
                l.draw(ctx)
            })

            /* 4. Обновляем и рисуем фрагменты кода */
            snippets.forEach(s => {
                s.update()
                s.draw(ctx)
            })

            /* Увеличиваем счётчик времени */
            time++

            /* Запрашиваем следующий кадр у браузера */
            animRef.current = requestAnimationFrame(animate)
        }

        /* Запускаем анимацию */
        animate()

        /* Очистка при размонтировании компонента */
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animRef.current)
        }
    }, [])

    return (
        /* Canvas фиксирован на весь экран позади контента */
        /* aria-hidden — скринридеры не читают canvas      */
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden="true"
        />
    )
}

export default LightningCanvas