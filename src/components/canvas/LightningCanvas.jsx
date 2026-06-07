/* ===================== LIGHTNING CANVAS ===================== */
/* Компонент: LightningCanvas.jsx                              */
/* Рисует анимированный фон с молниями, кодом и линиями       */
/* Использует Canvas API (2D) — без Three.js для фона,        */
/* Three.js оставим для 3D элементов в секциях                */

import { useEffect, useRef } from 'react'
import styles from './LightningCanvas.module.css'

/* ---- Настройки анимации — меняй здесь ---- */
const CONFIG = {
    /* Количество фоновых линий */
    LINES_COUNT: 25,

    /* Количество частиц (искры) */
    PARTICLES_COUNT: 60,

    /* Количество молний одновременно */
    LIGHTNING_COUNT: 3,

    /* Скорость анимации частиц */
    PARTICLE_SPEED: 0.4,

    /* Прозрачность всего фона — чтобы не перекрывал контент */
    GLOBAL_ALPHA: 0.15,

    /* Цвета молний */
    LIGHTNING_COLORS: ['#C9A84C', '#4A90D9', '#B8BEC7'],

    /* Цвет фоновых линий */
    LINE_COLOR: 'rgba(74, 144, 217, 0.08)',

    /* Цвет частиц-искр */
    PARTICLE_COLOR: '#C9A84C',

    /* Фрагменты кода для фона */
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

/* ---- Класс одной фоновой линии ---- */
class Line {
    constructor(canvas) {
        this.reset(canvas)
    }

    /* Инициализируем случайную линию на канвасе */
    reset(canvas) {
        /* Стартовая точка — случайная по краям */
        this.x1 = Math.random() * canvas.width
        this.y1 = Math.random() * canvas.height

        /* Угол линии — случайный, включая диагонали */
        const angle = Math.random() * Math.PI * 2
        const length = 100 + Math.random() * 300

        /* Конечная точка через тригонометрию */
        this.x2 = this.x1 + Math.cos(angle) * length
        this.y2 = this.y1 + Math.sin(angle) * length

        /* Прозрачность линии */
        this.alpha = 0.03 + Math.random() * 0.07

        /* Скорость мигания */
        this.speed = 0.002 + Math.random() * 0.005

        /* Текущая фаза мигания */
        this.phase = Math.random() * Math.PI * 2
    }

    /* Рисуем линию на канвасе */
    draw(ctx, time) {
        /* Мигание через синус */
        const alpha = this.alpha * (0.5 + 0.5 * Math.sin(time * this.speed + this.phase))
        ctx.strokeStyle = `rgba(74, 144, 217, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()
    }
}

/* ---- Класс одной частицы-искры ---- */
class Particle {
    constructor(canvas) {
        this.canvas = canvas
        this.reset()
    }

    /* Сбрасываем частицу в случайную позицию */
    reset() {
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height
        this.size = 1 + Math.random() * 2
        this.alpha = 0.3 + Math.random() * 0.7

        /* Случайное направление движения */
        const angle = Math.random() * Math.PI * 2
        this.vx = Math.cos(angle) * CONFIG.PARTICLE_SPEED
        this.vy = Math.sin(angle) * CONFIG.PARTICLE_SPEED

        /* Время жизни частицы */
        this.life = 0
        this.maxLife = 100 + Math.random() * 200
    }

    /* Обновляем позицию частицы */
    update() {
        this.x += this.vx
        this.y += this.vy
        this.life += 1

        /* Затухание к концу жизни */
        this.alpha = (1 - this.life / this.maxLife) * 0.7

        /* Сбрасываем если вышла за экран или умерла */
        if (
            this.life >= this.maxLife ||
            this.x < 0 || this.x > this.canvas.width ||
            this.y < 0 || this.y > this.canvas.height
        ) {
            this.reset()
        }
    }

    /* Рисуем частицу */
    draw(ctx) {
        ctx.fillStyle = `rgba(201, 168, 76, ${this.alpha})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}

/* ---- Класс одной молнии ---- */
class Lightning {
    constructor(canvas) {
        this.canvas = canvas
        this.reset()
    }

    /* Генерируем новую молнию */
    reset() {
        /* Молния идёт от случайной точки до случайной */
        this.startX = Math.random() * this.canvas.width
        this.startY = Math.random() * this.canvas.height * 0.5
        this.endX = this.startX + (Math.random() - 0.5) * 300
        this.endY = this.startY + 100 + Math.random() * 200

        /* Цвет из палитры */
        this.color = CONFIG.LIGHTNING_COLORS[
            Math.floor(Math.random() * CONFIG.LIGHTNING_COLORS.length)
        ]

        /* Прозрачность и время жизни */
        this.alpha = 0.6 + Math.random() * 0.4
        this.life = 0
        this.maxLife = 20 + Math.random() * 30

        /* Генерируем зигзаг молнии */
        this.points = this.generatePoints()

        /* Задержка перед следующей молнией */
        this.delay = Math.random() * 200
        this.delayMax = 100 + Math.random() * 400
    }

    /* Генерируем зигзагообразные точки молнии */
    generatePoints() {
        const points = [{ x: this.startX, y: this.startY }]
        const steps = 8 + Math.floor(Math.random() * 6)

        for (let i = 1; i <= steps; i++) {
            const progress = i / steps
            /* Линейная интерполяция от старта до конца + случайное отклонение */
            points.push({
                x: this.startX + (this.endX - this.startX) * progress + (Math.random() - 0.5) * 80,
                y: this.startY + (this.endY - this.startY) * progress + (Math.random() - 0.5) * 40,
            })
        }

        points.push({ x: this.endX, y: this.endY })
        return points
    }

    /* Обновляем состояние молнии */
    update() {
        if (this.delay > 0) {
            this.delay--
            return
        }

        this.life++

        /* Сбрасываем молнию после окончания жизни */
        if (this.life >= this.maxLife) {
            this.delay = this.delayMax
            this.life = 0
            this.points = this.generatePoints()
        }
    }

    /* Рисуем молнию */
    draw(ctx) {
        if (this.delay > 0 || this.points.length < 2) return

        /* Затухание к концу жизни */
        const lifeAlpha = 1 - this.life / this.maxLife
        ctx.strokeStyle = this.color
            .replace(')', `, ${this.alpha * lifeAlpha})`)
            .replace('rgb', 'rgba')
            .replace('#C9A84C', `rgba(201, 168, 76, ${this.alpha * lifeAlpha})`)
            .replace('#4A90D9', `rgba(74, 144, 217, ${this.alpha * lifeAlpha})`)
            .replace('#B8BEC7', `rgba(184, 190, 199, ${this.alpha * lifeAlpha})`)

        ctx.lineWidth = 1 + Math.random() * 1.5
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color

        /* Рисуем зигзаг по точкам */
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.stroke()

        /* Сбрасываем shadow для производительности */
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
    }
}

/* ---- Класс фрагмента кода ---- */
class CodeSnippet {
    constructor(canvas) {
        this.canvas = canvas
        this.reset()
    }

    reset() {
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height
        this.text = CONFIG.CODE_SNIPPETS[
            Math.floor(Math.random() * CONFIG.CODE_SNIPPETS.length)
        ]
        this.alpha = 0.03 + Math.random() * 0.06
        this.size = 10 + Math.random() * 4

        /* Медленно дрейфуем вверх */
        this.vy = -0.1 - Math.random() * 0.2
        this.life = 0
        this.maxLife = 300 + Math.random() * 300
    }

    update() {
        this.y += this.vy
        this.life += 1
        if (this.life >= this.maxLife || this.y < -20) this.reset()
    }

    draw(ctx) {
        /* Плавное появление и исчезновение */
        const lifeRatio = this.life / this.maxLife
        const fadeAlpha = lifeRatio < 0.1
            ? lifeRatio * 10 * this.alpha
            : lifeRatio > 0.9
                ? (1 - lifeRatio) * 10 * this.alpha
                : this.alpha

        ctx.fillStyle = `rgba(74, 144, 217, ${fadeAlpha})`
        ctx.font = `${this.size}px monospace`
        ctx.fillText(this.text, this.x, this.y)
    }
}

/* ---- Основной компонент ---- */
function LightningCanvas() {
    /* Ссылка на DOM элемент canvas */
    const canvasRef = useRef(null)

    /* Ссылка на ID анимационного фрейма для очистки */
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        /* Подгоняем размер канваса под окно */
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        /* Создаём объекты анимации */
        const lines = Array.from({ length: CONFIG.LINES_COUNT }, () => new Line(canvas))
        const particles = Array.from({ length: CONFIG.PARTICLES_COUNT }, () => new Particle(canvas))
        const lightnings = Array.from({ length: CONFIG.LIGHTNING_COUNT }, () => new Lightning(canvas))
        const snippets = Array.from({ length: 12 }, () => new CodeSnippet(canvas))

        let time = 0

        /* Главный цикл анимации */
        const animate = () => {
            /* Очищаем канвас каждый кадр */
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            /* Рисуем фоновые линии */
            lines.forEach(line => line.draw(ctx, time))

            /* Обновляем и рисуем частицы */
            particles.forEach(p => { p.update(); p.draw(ctx) })

            /* Обновляем и рисуем молнии */
            lightnings.forEach(l => { l.update(); l.draw(ctx) })

            /* Обновляем и рисуем фрагменты кода */
            snippets.forEach(s => { s.update(); s.draw(ctx) })

            time++

            /* Запрашиваем следующий кадр */
            animRef.current = requestAnimationFrame(animate)
        }

        animate()

        /* Очистка при размонтировании компонента */
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animRef.current)
        }
    }, [])

    return (
        /* Canvas растянут на весь экран, за контентом */
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden="true"
        />
    )
}

export default LightningCanvas