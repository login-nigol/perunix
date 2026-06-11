/* ===================== PORTFOLIO SECTION ===================== */
/* Компонент: PortfolioSection.jsx                              */
/* Бесконечная карусель на CSS transform + свайп               */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'

import styles from './PortfolioSection.module.css'
import PortfolioModal from '../ui/PortfolioModal'

/* ===================== ДАННЫЕ ПРОЕКТОВ ===================== */
const PROJECTS = [
    {
        id: 'autoglanz', title: 'AutoGlanz', category: 'Landing Page',
        description: 'Premium Detailing Landingpage für ein Autoaufbereitungsunternehmen in Regensburg. Dunkles Design mit Goldakzenten, animierte Sektionen und Kontaktformular.',
        tech: ['React', 'Vite', 'CSS Modules', 'Framer Motion'],
        url: 'https://car-detailing-gules.vercel.app', color: '#C9A84C', emoji: '🚗', available: true,
    },
    {
        id: 'pixora', title: 'Pixora Studio', category: 'Web Application',
        description: 'Grafischer Online-Editor mit Canvas — Zeichnen, Formen, Farben, Export. Vollständig im Browser ohne Installation.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
        url: 'https://login-nigol.github.io/HOMEWORK/pixora-a-studio/src/', color: '#4A90D9', emoji: '🎨', available: true,
    },
    {
        id: 'lifeqr', title: 'LifeQR', category: 'SaaS Platform',
        description: 'Digitales Familienalbum — QR-Code führt zu einer persönlichen Gedenkseite mit Fotos, Biografie und Familienchat.',
        tech: ['React', 'Spring Boot', 'PostgreSQL', 'Docker'],
        url: 'https://lifeqr.kz', color: '#7C3AED', emoji: '📖', available: true,
    },
    {
        id: 'rodnik', title: 'Rodnik', category: 'Marketplace',
        description: 'Landwirtschaftlicher Marktplatz — Bauern verkaufen direkt an Kunden. Produktkatalog, Bestellsystem und Nutzerverwaltung.',
        tech: ['React', 'Spring Boot', 'PostgreSQL', 'Nginx'],
        url: 'http://45.131.109.248', color: '#16A34A', emoji: '🌾', available: true,
    },
    {
        id: 'webapp', title: 'Web-App', category: 'In Entwicklung',
        description: 'Vollständige Webanwendung mit Benutzeranmeldung, persönlichem Bereich und Datenverwaltung. Demnächst verfügbar.',
        tech: ['React', 'Node.js', 'PostgreSQL'],
        url: null, color: '#B8BEC7', emoji: '⚡', available: false,
    },
    {
        id: 'landing', title: 'Premium Landing', category: 'In Entwicklung',
        description: 'Animierte Landingpage mit 3D-Effekten, interaktiven Elementen und beeindruckenden Übergängen. Demnächst verfügbar.',
        tech: ['React', 'Three.js', 'Framer Motion'],
        url: null, color: '#B8BEC7', emoji: '🎯', available: false,
    },
]

/* Клонируем по 3 с каждой стороны — хватит для любого экрана */
const INFINITE = [
    ...PROJECTS.slice(-3).map((p, i) => ({ ...p, id: `clone-start-${i}` })),
    ...PROJECTS,
    ...PROJECTS.slice(0, 3).map((p, i) => ({ ...p, id: `clone-end-${i}` })),
]

const CLONE_COUNT = 3

function PortfolioSection() {
    const [activeProject, setActiveProject] = useState(null)

    /* Индекс активной карточки для подсветки и точек */
    const [displayIdx, setDisplayIdx] = useState(CLONE_COUNT)

    const currentIdx = useRef(CLONE_COUNT)

    const isTransitioning = useRef(false)
    const isPaused = useRef(false)
    const trackRef = useRef(null)
    const wrapperRef = useRef(null)
    const autoTimer = useRef(null)
    const touchStartX = useRef(0)

    const { playClick } = useSound()
    const { vibrateClick } = useVibrate()

    /* ---- Двигаем трек к индексу ---- */
    const moveTo = useCallback((index, animate = true) => {
        const track = trackRef.current
        const wrapper = wrapperRef.current
        if (!track || !wrapper) return

        const card = track.querySelector('[data-card]')
        const cardW = card ? card.offsetWidth + 24 : 312
        const offset = (wrapper.offsetWidth / 2) - (card ? card.offsetWidth / 2 : 144)

        if (!animate) {
            /* Сначала убираем transition */
            track.style.transition = 'none'
            /* Принудительный reflow — браузер применяет стили до transform */
            track.getBoundingClientRect()
        } else {
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }

        track.style.transform = `translateX(${offset - index * cardW}px)`
        setDisplayIdx(index)
    }, [])

    /* ---- Следующая карточка ---- */
    const goNext = useCallback(() => {
        /* Блокируем если уже идёт анимация */
        if (isTransitioning.current) return
        isTransitioning.current = true

        /* Двигаем на следующий индекс */
        currentIdx.current += 1
        moveTo(currentIdx.current)

        setTimeout(() => {
            /* Дошли до клонов в конце — телепортируемся на реальное начало */
            if (currentIdx.current >= PROJECTS.length + CLONE_COUNT) {
                const track = trackRef.current
                /* Убираем анимацию для незаметного прыжка */
                track.style.transition = 'none'
                /* Устанавливаем реальный первый индекс */
                currentIdx.current = CLONE_COUNT
                /* Принудительный reflow — браузер применяет transition:none ДО transform */
                void track.offsetHeight
                /* Телепортируемся на реальную первую карточку */
                const wrapper = wrapperRef.current
                const card = track.querySelector('[data-card]')
                const cardW = card ? card.offsetWidth + 24 : 312
                const offset = (wrapper.offsetWidth / 2) - (card ? card.offsetWidth / 2 : 144)
                track.style.transform = `translateX(${offset - CLONE_COUNT * cardW}px)`
                setDisplayIdx(CLONE_COUNT)
            }
            /* Снимаем блокировку */
            isTransitioning.current = false
        }, 850)
    }, [moveTo])

    /* ---- Предыдущая карточка ---- */
    const goPrev = useCallback(() => {
        /* Блокируем если уже идёт анимация */
        if (isTransitioning.current) return
        isTransitioning.current = true

        /* Двигаем на предыдущий индекс */
        currentIdx.current -= 1
        moveTo(currentIdx.current)

        setTimeout(() => {
            /* Дошли до клонов в начале — телепортируемся на реальный конец */
            if (currentIdx.current <= CLONE_COUNT - 1) {
                const track = trackRef.current
                /* Убираем анимацию для незаметного прыжка */
                track.style.transition = 'none'
                /* Устанавливаем реальный последний индекс */
                currentIdx.current = PROJECTS.length + CLONE_COUNT - 1
                /* Принудительный reflow */
                void track.offsetHeight
                /* Телепортируемся на реальную последнюю карточку */
                const wrapper = wrapperRef.current
                const card = track.querySelector('[data-card]')
                const cardW = card ? card.offsetWidth + 24 : 312
                const offset = (wrapper.offsetWidth / 2) - (card ? card.offsetWidth / 2 : 144)
                track.style.transform = `translateX(${offset - (PROJECTS.length + CLONE_COUNT - 1) * cardW}px)`
                setDisplayIdx(PROJECTS.length + CLONE_COUNT - 1)
            }
            /* Снимаем блокировку */
            isTransitioning.current = false
        }, 850)
    }, [moveTo])

    /* ---- Запуск карусели ---- */
    useEffect(() => {
        const init = setTimeout(() => moveTo(1, false), 100)

        // autoTimer.current = setInterval(() => {
        //     if (!isPaused.current) goNext()
        // }, 2500)

        return () => {
            clearInterval(autoTimer.current)
            clearTimeout(init)
        }
    }, [goNext, moveTo])

    /* ---- Пересчёт при ресайзе ---- */
    useEffect(() => {
        const onResize = () => moveTo(currentIdx.current, false)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [moveTo])

    /* ---- Возобновляем при вертикальном скролле ---- */
    useEffect(() => {
        let lastY = window.scrollY
        let scrollTimer = null

        const onScroll = () => {
            /* При скролле — пауза */
            isPaused.current = true
            clearTimeout(scrollTimer)
            /* Через 1 сек после остановки скролла — возобновляем */
            scrollTimer = setTimeout(() => {
                isPaused.current = false
            }, 3000)
            lastY = window.scrollY
        }

        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            clearTimeout(scrollTimer)
        }
    }, [])

    /* ---- Блокируем скролл страницы при открытой модалке ---- */
    useEffect(() => {
        if (activeProject) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [activeProject])

    /* ---- Реальный индекс для точек ---- */
    const realIndex = ((displayIdx - CLONE_COUNT) % PROJECTS.length + PROJECTS.length) % PROJECTS.length

    return (
        <section className={styles.portfolio} id="portfolio">
            <div className={styles.container}>

                <motion.h2
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Unsere <span className={styles.accent}>Projekte</span>
                </motion.h2>

                <motion.p
                    className={styles.sectionSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Echte Projekte — echte Ergebnisse.
                </motion.p>

                {/* Обёртка карусели */}
                <div
                    ref={wrapperRef}
                    className={styles.carouselWrapper}
                    /* Пауза при наведении/касании */
                    onMouseEnter={() => { isPaused.current = true }}
                    onMouseLeave={() => { isPaused.current = false }}
                    /* Свайп на мобилке */
                    onTouchStart={(e) => {
                        isPaused.current = true
                        touchStartX.current = e.touches[0].clientX
                    }}
                    onTouchEnd={(e) => {
                        const diff = touchStartX.current - e.changedTouches[0].clientX
                        /* Свайп влево — следующая */
                        if (diff > 50) goNext()
                        /* Свайп вправо — предыдущая */
                        else if (diff < -50) goPrev()
                        isPaused.current = false
                    }}
                >
                    {/* Трек */}
                    <div ref={trackRef} className={styles.track}>
                        {INFINITE.map((project, index) => (
                            <div
                                key={`${project.id}-${index}`}
                                data-card
                                className={`
                  ${styles.card}
                  ${!project.available ? styles.cardUnavailable : ''}
                  ${index === displayIdx ? styles.cardActive : ''}
                `}
                                onClick={() => {
                                    if (!project.available) return
                                    playClick()
                                    vibrateClick()
                                    setActiveProject(project)
                                }}
                            >
                                {/* Цветная полоска */}
                                <div className={styles.cardAccent} style={{ backgroundColor: project.color }} />

                                {/* Иконка */}
                                <div className={styles.cardEmoji}>{project.emoji}</div>

                                {/* Категория */}
                                <span className={styles.cardCategory}>{project.category}</span>

                                {/* Название */}
                                <h3 className={styles.cardTitle}>{project.title}</h3>

                                {/* Описание */}
                                <p className={styles.cardDescription}>
                                    {project.description.slice(0, 80)}...
                                </p>

                                {/* Кнопка */}
                                <div className={styles.cardBtn}>
                                    {project.available ? 'Mehr erfahren →' : 'Demnächst'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Контролы */}
                <div className={styles.controls}>
                    {/* Стрелка назад */}
                    <button
                        className={styles.arrow}
                        onClick={() => {
                            goPrev()
                            isPaused.current = true
                            setTimeout(() => { isPaused.current = false }, 5000)
                        }}
                    >←</button>

                    {/* Точки */}
                    <div className={styles.dots}>
                        {PROJECTS.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === realIndex ? styles.dotActive : ''}`}
                                onClick={() => {
                                    const target = index + 1
                                    currentIdx.current = target
                                    moveTo(target)
                                    isPaused.current = true
                                    setTimeout(() => { isPaused.current = false }, 5000)
                                }}
                            />
                        ))}
                    </div>

                    {/* Стрелка вперёд */}
                    <button
                        className={styles.arrow}
                        onClick={() => {
                            goNext()
                            isPaused.current = true
                            setTimeout(() => { isPaused.current = false }, 5000)
                        }}
                    >→</button>
                </div>

            </div>

            {/* Модалка */}
            {activeProject && (
                <PortfolioModal
                    project={activeProject}
                    onClose={() => setActiveProject(null)}
                />
            )}

        </section>
    )
}

export default PortfolioSection