/* ===================== TECH SECTION ===================== */
/* Компонент: TechSection.jsx                              */
/* Бесконечная бегущая строка технологий                  */
/* Верхняя строка — влево, нижняя — вправо                */
/* При hover — пауза                                       */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './TechSection.module.css'

/* ===================== ДАННЫЕ ТЕХНОЛОГИЙ ===================== */
const ROW_1 = [
    { name: 'React', icon: '⚛️' },
    { name: 'Vite', icon: '⚡' },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'CSS Modules', icon: '🎨' },
    { name: 'Framer Motion', icon: '🎭' },
    { name: 'HTML5', icon: '🌐' },
    { name: 'Canvas API', icon: '🖼️' },
    { name: 'Three.js', icon: '🔮' },
]

const ROW_2 = [
    { name: 'Java', icon: '☕' },
    { name: 'Spring Boot', icon: '🍃' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Liquibase', icon: '💧' },
    { name: 'Docker', icon: '🐳' },
    { name: 'GitHub Actions', icon: '🔄' },
    { name: 'Nginx', icon: '🟩' },
    { name: 'REST API', icon: '🔌' },
]

/* Дублируем для бесконечности */
const TRACK_1 = [...ROW_1, ...ROW_1]
const TRACK_2 = [...ROW_2, ...ROW_2]

/* Компонент одной бегущей строки */
function TechRow({ items, direction = 'left' }) {
    const rowRef = useRef(null)

    /* При hover — ставим на паузу через CSS */
    const handleEnter = () => {
        if (rowRef.current) rowRef.current.style.animationPlayState = 'paused'
    }
    const handleLeave = () => {
        if (rowRef.current) rowRef.current.style.animationPlayState = 'running'
    }

    return (
        /* Обёртка скрывает выезжающие элементы */
        <div
            className={styles.rowWrapper}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {/* Трек с анимацией */}
            <div
                ref={rowRef}
                className={`${styles.track} ${direction === 'left' ? styles.trackLeft : styles.trackRight}`}
            >
                {items.map((tech, index) => (
                    <div key={`${tech.name}-${index}`} className={styles.techCard}>
                        {/* Иконка */}
                        <span className={styles.techIcon}>{tech.icon}</span>
                        {/* Название */}
                        <span className={styles.techName}>{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function TechSection() {
    return (
        <section className={styles.tech} id="tech">
            <div className={styles.container}>

                {/* Заголовок */}
                <motion.h2
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Unser <span className={styles.accent}>Tech Stack</span>
                </motion.h2>

                {/* Подзаголовок */}
                <motion.p
                    className={styles.sectionSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Moderne Technologien für performante und skalierbare Lösungen.
                </motion.p>

            </div>

            {/* Строки на всю ширину — без container */}
            {/* Верхняя строка — едет влево */}
            <TechRow items={TRACK_1} direction="left" />

            {/* Нижняя строка — едет вправо */}
            <TechRow items={TRACK_2} direction="right" />

        </section>
    )
}

export default TechSection