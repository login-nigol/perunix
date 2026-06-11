/* ===================== PORTFOLIO MODAL ===================== */
/* Компонент: PortfolioModal.jsx                              */
/* Модалка с полным описанием проекта и ссылкой              */

import { motion } from 'framer-motion'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'

import styles from './PortfolioModal.module.css'

function PortfolioModal({ project, onClose }) {
    const { playClick, playThunder } = useSound()
    const { vibrateClick, vibrateThunder } = useVibrate()

    return (
        /* Затемнённый оверлей */
        <div
            className={styles.overlay}
            onClick={() => {
                playClick()
                vibrateClick()
                onClose()
            }}
        >
            <motion.div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3 }}
            >
                {/* Цветная полоска сверху */}
                <div
                    className={styles.accent}
                    style={{ backgroundColor: project.color }}
                />

                {/* Шапка */}
                <div className={styles.header}>
                    <span className={styles.emoji}>{project.emoji}</span>
                    <div>
                        <span className={styles.category}>{project.category}</span>
                        <h3 className={styles.title}>{project.title}</h3>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => {
                            playClick()
                            vibrateClick()
                            onClose()
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Описание */}
                <p className={styles.description}>{project.description}</p>

                {/* Технологии */}
                <div className={styles.techBlock}>
                    <h4 className={styles.techTitle}>Technologien:</h4>
                    <div className={styles.techList}>
                        {project.tech.map(t => (
                            <span key={t} className={styles.techTag}>{t}</span>
                        ))}
                    </div>
                </div>

                {/* Кнопка — ссылка на проект */}
                {project.url && (

                    <a href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.linkBtn}
                        onClick={() => {
                            playThunder()
                            vibrateThunder()
                        }}
                    >
                        Projekt ansehen
                    </a>
                )}

            </motion.div>
        </div >
    )
}

export default PortfolioModal