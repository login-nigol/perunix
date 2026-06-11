/* ===================== CUSTOM SELECT ===================== */
/* Компонент: CustomSelect.jsx                              */
/* Кастомный дропдаун вместо стандартного <select>         */
/* Анимация через Framer Motion                             */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CustomSelect.module.css'

function CustomSelect({ options, value, onChange, placeholder }) {
    /* Флаг — открыт ли дропдаун */
    const [isOpen, setIsOpen] = useState(false)

    /* Ссылка на контейнер — для закрытия по клику вне */
    const ref = useRef(null)

    /* Закрываем дропдаун при клике вне компонента */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    /* Выбираем опцию */
    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        /* Обёртка — relative для позиционирования списка */
        <div className={styles.wrapper} ref={ref}>

            {/* Кнопка — показывает выбранное значение */}
            <button
                className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {/* Текст — placeholder или выбранное значение */}
                <span className={value ? styles.selected : styles.placeholder}>
                    {value || placeholder}
                </span>

                {/* Стрелка — поворачивается при открытии */}
                <motion.span
                    className={styles.arrow}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    ▾
                </motion.span>
            </button>

            {/* Список опций — появляется с анимацией */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className={styles.list}
                        initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{ transformOrigin: 'top' }}
                    >
                        {options.map(option => (
                            <li
                                key={option}
                                className={`${styles.option} ${value === option ? styles.optionActive : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {/* Галочка у выбранной опции */}
                                {value === option && (
                                    <span className={styles.check}>✓</span>
                                )}
                                {option}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>

        </div>
    )
}

export default CustomSelect