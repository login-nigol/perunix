/* ===================== BUG ===================== */
/* Компонент: Bug.jsx                             */
/* Жук-пасхалка который ползает по экрану,        */
/* убегает от курсора/пальца, иногда прогрызает   */
/* дырку и исчезает, при тапе — умирает           */

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Bug.module.css'

/* ===================== КОНСТАНТЫ ===================== */
/* Скорость передвижения жука в пикселях за кадр */
const SPEED = 1.5

/* Расстояние от курсора при котором жук убегает */
const FLEE_RADIUS = 120

/* Интервал между сменой направления (мс) */
const DIRECTION_CHANGE = 3000

/* Интервал между автопрогрызанием дырки (мс) */
const AUTO_BITE_MIN = 8000
const AUTO_BITE_MAX = 15000

/* Время затягивания дырки (мс) */
const HOLE_CLOSE_TIME = 3000

/* Время возрождения после смерти (мс) */
const RESPAWN_TIME = 2000

function Bug() {
    /* Позиция жука на экране */
    const [pos, setPos] = useState({ x: 200, y: 200 })

    /* Угол поворота жука в градусах */
    const [angle, setAngle] = useState(0)

    /* Состояние жука: alive | biting | dead | hidden */
    const [state, setState] = useState('alive')

    /* Позиция дырки */
    const [hole, setHole] = useState(null)

    /* Позиция курсора/пальца */
    const mousePos = useRef({ x: -999, y: -999 })

    /* Целевое направление движения */
    const targetAngle = useRef(Math.random() * 360)

    /* ID анимационного фрейма */
    const animRef = useRef(null)

    /* Таймер смены направления */
    const dirTimer = useRef(null)

    /* Таймер автопрогрызания */
    const biteTimer = useRef(null)

    /* Текущая позиция — ref для анимационного цикла */
    const posRef = useRef({ x: 200, y: 200 })

    /* Флаг — жив ли жук */
    const aliveRef = useRef(true)

    /* ---- Прогрызаем дырку ---- */
    const bite = useCallback(() => {
        /* Нельзя грызть если уже мёртв или грызёт */
        if (!aliveRef.current) return

        aliveRef.current = false
        setState('biting')

        /* Запоминаем где дырка */
        setHole({ x: posRef.current.x, y: posRef.current.y })

        /* Через 1 секунду жук исчезает */
        setTimeout(() => {
            setState('hidden')

            /* Через HOLE_CLOSE_TIME дырка затягивается */
            setTimeout(() => {
                setHole(null)

                /* Возрождаемся в случайном месте */
                const newX = 100 + Math.random() * (window.innerWidth - 200)
                const newY = 100 + Math.random() * (window.innerHeight - 200)
                posRef.current = { x: newX, y: newY }
                setPos({ x: newX, y: newY })
                aliveRef.current = true
                setState('alive')

                /* Планируем следующее автопрогрызание */
                scheduleBite()
            }, HOLE_CLOSE_TIME)
        }, 1000)
    }, [])

    /* ---- Планируем автопрогрызание ---- */
    const scheduleBite = useCallback(() => {
        clearTimeout(biteTimer.current)
        const delay = AUTO_BITE_MIN + Math.random() * (AUTO_BITE_MAX - AUTO_BITE_MIN)
        biteTimer.current = setTimeout(bite, delay)
    }, [bite])

    /* ---- Давим жука тапом/кликом ---- */
    const handleKill = useCallback(() => {
        if (!aliveRef.current) return

        aliveRef.current = false
        clearTimeout(biteTimer.current)
        setState('dead')

        /* Через RESPAWN_TIME появляется новый жук */
        setTimeout(() => {
            const newX = 100 + Math.random() * (window.innerWidth - 200)
            const newY = 100 + Math.random() * (window.innerHeight - 200)
            posRef.current = { x: newX, y: newY }
            setPos({ x: newX, y: newY })
            aliveRef.current = true
            setState('alive')
            scheduleBite()
        }, RESPAWN_TIME)
    }, [scheduleBite])

    /* ---- Главный анимационный цикл ---- */
    useEffect(() => {
        /* Случайное начальное положение */
        const startX = 100 + Math.random() * (window.innerWidth - 200)
        const startY = 100 + Math.random() * (window.innerHeight - 200)
        posRef.current = { x: startX, y: startY }
        setPos({ x: startX, y: startY })

        /* Планируем первое автопрогрызание */
        scheduleBite()

        /* Меняем целевое направление по таймеру */
        dirTimer.current = setInterval(() => {
            targetAngle.current = Math.random() * 360
        }, DIRECTION_CHANGE)

        /* Анимационный цикл */
        const animate = () => {
            if (!aliveRef.current) {
                animRef.current = requestAnimationFrame(animate)
                return
            }

            const { x, y } = posRef.current
            const mouse = mousePos.current

            /* Расстояние от жука до курсора */
            const dx = mouse.x - x
            const dy = mouse.y - y
            const dist = Math.sqrt(dx * dx + dy * dy)

            let moveAngle

            if (dist < FLEE_RADIUS) {
                /* Убегаем от курсора — угол противоположный */
                moveAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 180
            } else {
                /* Плавно поворачиваемся к целевому углу */
                moveAngle = targetAngle.current
            }

            /* Конвертируем угол в вектор движения */
            const rad = moveAngle * (Math.PI / 180)
            let newX = x + Math.cos(rad) * SPEED
            let newY = y + Math.sin(rad) * SPEED

            /* Отражаемся от краёв экрана */
            if (newX < 20) { newX = 20; targetAngle.current = 0 }
            if (newX > window.innerWidth - 20) { newX = window.innerWidth - 20; targetAngle.current = 180 }
            if (newY < 20) { newY = 20; targetAngle.current = 90 }
            if (newY > window.innerHeight - 20) { newY = window.innerHeight - 20; targetAngle.current = 270 }

            posRef.current = { x: newX, y: newY }

            /* Обновляем позицию и угол поворота */
            setPos({ x: newX, y: newY })
            setAngle(moveAngle + 90)

            animRef.current = requestAnimationFrame(animate)
        }

        animate()

        /* Очистка */
        return () => {
            cancelAnimationFrame(animRef.current)
            clearInterval(dirTimer.current)
            clearTimeout(biteTimer.current)
        }
    }, [scheduleBite])

    /* ---- Слушаем курсор мыши ---- */
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }

        /* Слушаем тач на мобилке */
        const handleTouch = (e) => {
            const touch = e.touches[0]
            if (touch) mousePos.current = { x: touch.clientX, y: touch.clientY }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('touchmove', handleTouch, { passive: true })

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouch)
        }
    }, [])

    return (
        <>
            {/* ---- Дырка от прогрызания ---- */}
            {hole && (
                <div
                    className={`${styles.hole} ${state === 'hidden' || state === 'alive' ? styles.holeClosing : ''}`}
                    style={{ left: hole.x, top: hole.y }}
                />
            )}

            {/* ---- Жук ---- */}
            <div
                className={`
          ${styles.bug}
          ${state === 'dead' ? styles.dead : ''}
          ${state === 'biting' ? styles.biting : ''}
          ${state === 'hidden' ? styles.hidden : ''}
        `}
                style={{
                    /* Позиционируем жука */
                    left: pos.x,
                    top: pos.y,
                    /* Поворачиваем в сторону движения */
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
                /* Клик/тап по жуку — давим */
                onClick={handleKill}
                onTouchStart={(e) => { e.preventDefault(); handleKill() }}
            >
                {/* SVG жук */}
                <svg
                    viewBox="0 0 40 40"
                    className={styles.bugSvg}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Передние ноги — анимируются вместе */}
                    <g className={styles.legsFront}>
                        <line x1="14" y1="14" x2="4" y2="10" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="26" y1="14" x2="36" y2="10" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Средние ноги */}
                    <g className={styles.legsMid}>
                        <line x1="14" y1="20" x2="3" y2="20" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="26" y1="20" x2="37" y2="20" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Задние ноги */}
                    <g className={styles.legsBack}>
                        <line x1="14" y1="26" x2="4" y2="30" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="26" y1="26" x2="36" y2="30" stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Тело — золотое овальное */}
                    <ellipse cx="20" cy="22" rx="8" ry="11" fill="#C9A84C" />

                    {/* Узор на теле — тёмные полоски */}
                    <line x1="20" y1="12" x2="20" y2="33" stroke="#A68A35" strokeWidth="1" opacity="0.6" />
                    <line x1="13" y1="18" x2="27" y2="18" stroke="#A68A35" strokeWidth="1" opacity="0.4" />
                    <line x1="13" y1="24" x2="27" y2="24" stroke="#A68A35" strokeWidth="1" opacity="0.4" />

                    {/* Голова — тёмно-коричневая */}
                    <ellipse cx="20" cy="10" rx="5" ry="4" fill="#3D1F00" />

                    {/* Глаза — маленькие золотые точки */}
                    <circle cx="18" cy="9" r="1" fill="#C9A84C" />
                    <circle cx="22" cy="9" r="1" fill="#C9A84C" />

                    {/* Усики — тёмно-коричневые */}
                    <line x1="18" y1="7" x2="14" y2="3" stroke="#3D1F00" strokeWidth="1" strokeLinecap="round" />
                    <line x1="22" y1="7" x2="26" y2="3" stroke="#3D1F00" strokeWidth="1" strokeLinecap="round" />
                </svg>
            </div>
        </>
    )
}

export default Bug