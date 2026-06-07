/* ===================== HERO SECTION ===================== */
/* Компонент: HeroSection.jsx                              */
/* Главный экран — первое что видит пользователь           */
/* Framer Motion анимации + звук + вибрация на CTA         */

import { motion } from 'framer-motion'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'
import styles from './HeroSection.module.css'

/* Варианты анимации для Framer Motion */
/* Каждый элемент появляется снизу вверх с задержкой */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
})

function HeroSection() {
    /* Хуки звука и вибрации */
    const { playThunder } = useSound()
    const { vibrateThunder } = useVibrate()

    /* Обработчик клика на CTA — звук + вибрация */
    const handleCta = () => {
        playThunder()
        vibrateThunder()
    }

    return (
        /* Секция на весь экран с id для якорной ссылки */
        <section className={styles.hero} id="hero">
            <div className={styles.container}>

                {/* Верхний лейбл — появляется первым */}
                <motion.div {...fadeUp(0.1)} className={styles.badge}>
                    ⚡ Premium Web Development
                </motion.div>

                {/* Главный заголовок — самый крупный элемент */}
                <motion.h1 {...fadeUp(0.3)} className={styles.title}>
                    We Build
                    <br />
                    {/* Золотой акцент на ключевом слове */}
                    <span className={styles.accent}>Digital</span>
                    <br />
                    Experiences
                </motion.h1>

                {/* Подзаголовок с описанием */}
                <motion.p {...fadeUp(0.5)} className={styles.subtitle}>
                    Hochleistungs-Webanwendungen, die begeistern.
                    <br />
                    Von der Idee bis zum Launch — mit uns wird jedes Projekt zur Legende.
                </motion.p>

                {/* Кнопки действий */}
                <motion.div {...fadeUp(0.7)} className={styles.buttons}>

                    {/* Главная CTA кнопка */}

                    <a href="#contact"
                        className={styles.btnPrimary}
                        onClick={handleCta}
                    >
                        Start a Project ⚡
                    </a>

                    {/* Вторичная кнопка */}

                    <a href="#portfolio"
                        className={styles.btnSecondary}
                        onClick={handleCta}
                    >
                        View Our Work
                    </a>

                </motion.div>

                {/* Строка со статистикой */}
                <motion.div {...fadeUp(0.9)} className={styles.stats}>

                    {/* Стат 1 */}
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>50+</span>
                        <span className={styles.statLabel}>Projects Delivered</span>
                    </div>

                    {/* Разделитель */}
                    <div className={styles.statDivider} />

                    {/* Стат 2 */}
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>5★</span>
                        <span className={styles.statLabel}>Client Rating</span>
                    </div>

                    {/* Разделитель */}
                    <div className={styles.statDivider} />

                    {/* Стат 3 */}
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>3+</span>
                        <span className={styles.statLabel}>Years Experience</span>
                    </div>

                </motion.div>

                {/* Скролл индикатор */}
                <motion.div
                    {...fadeUp(1.1)}
                    className={styles.scrollIndicator}
                    /* Бесконечная анимация вверх-вниз */
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    ↓
                </motion.div>

            </div>
        </section>
    )
}

export default HeroSection