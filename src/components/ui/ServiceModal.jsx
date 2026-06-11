/* ===================== SERVICE MODAL ===================== */
/* Компонент: ServiceModal.jsx                              */
/* Модалка с описанием услуги, списком и вопросами          */
/* Открывается из ServicesSection по клику на карточку      */

import { useState } from 'react'
import { motion } from 'framer-motion'
/* Импорты хуков */
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'

import styles from './ServiceModal.module.css'
/* Импорт кастомного селекта */
import CustomSelect from '../ui/CustomSelect'

function ServiceModal({ service, onClose, onRequest }) {

    const { playThunder } = useSound()
    const { vibrateThunder } = useVibrate()

    /* Ответы на уточняющие вопросы */
    const [answers, setAnswers] = useState({})

    /* Сохраняем ответ на вопрос */
    const handleAnswer = (id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }))
    }

    /* Передаём услугу и ответы → скроллим к форме */
    const handleRequest = () => {
        onRequest(service, answers)
        onClose()
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        /* Затемнённый оверлей — клик закрывает модалку */
        <div className={styles.overlay}
            onClick={onClose}
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
        >

            {/* Модалка — останавливаем всплытие клика */}
            <motion.div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
                onWheel={e => e.stopPropagation()}
                onTouchMove={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3 }}
            >
                {/* Шапка — иконка, название, кнопка закрытия */}
                <div className={styles.modalHeader}>
                    <span className={styles.modalIcon}>{service.icon}</span>
                    <div>
                        <h3 className={styles.modalTitle}>{service.title}</h3>
                        <p className={styles.modalShort}>{service.short}</p>
                    </div>
                    {/* Кнопка закрытия */}
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Полное описание услуги */}
                <p className={styles.modalDescription}>{service.description}</p>

                {/* Что входит в услугу */}
                <div className={styles.includesBlock}>
                    <h4 className={styles.includesTitle}>Was ist enthalten:</h4>
                    <ul className={styles.includesList}>
                        {service.includes.map((item, i) => (
                            <li key={i} className={styles.includesItem}>
                                <span className={styles.check}>✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Уточняющие вопросы */}
                <div className={styles.questionsBlock}>
                    <h4 className={styles.questionsTitle}>Ein paar Fragen:</h4>
                    {service.questions.map(q => (
                        <div key={q.id} className={styles.questionField}>
                            {/* Лейбл вопроса */}
                            <label className={styles.questionLabel}>{q.label}</label>
                            {/* Кастомный дропдаун вместо стандартного select */}
                            <CustomSelect
                                options={q.options}
                                value={answers[q.id] || ''}
                                onChange={(value) => handleAnswer(q.id, value)}
                                placeholder="Bitte wählen..."
                            />
                        </div>
                    ))}
                </div>

                {/* Кнопка запроса */}
                <button className={styles.requestBtn}
                    onClick={() => {
                        playThunder()
                        vibrateThunder()
                        handleRequest()
                    }}
                >
                    Jetzt anfragen ⚡
                </button>

            </motion.div>
        </div>
    )
}

export default ServiceModal