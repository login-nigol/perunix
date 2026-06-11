/* ===================== CONTACT SECTION ===================== */
/* Компонент: ContactSection.jsx                              */
/* Форма контактов с интеграцией ServiceContext              */
/* Если клиент выбрал услугу — поле заполняется автоматически */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useService } from '../../context/ServiceContext'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'

import styles from './ContactSection.module.css'
import CustomSelect from '../ui/CustomSelect'

/* Контактные данные */
const CONTACT_INFO = [
    // { id: 1, icon: '📍', label: 'Adresse', value: 'Regensburg, Bayern' },
    { id: 2, icon: '✉️', label: 'E-Mail', value: 'hello@perunix-web.de' },
    { id: 3, icon: '🕐', label: 'Öffnungszeiten', value: '24/7 verfügbar' },
    { id: 4, icon: '⚡', label: 'Antwortzeit', value: 'Innerhalb von 24 Stunden' },
]

function ContactSection() {
    const { selectedService, setSelectedService } = useService()
    const { playThunder } = useSound()
    const { vibrateThunder } = useVibrate()

    /* Состояние формы */
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        budget: '',
        message: '',
    })

    /* Флаг успешной отправки */
    const [sent, setSent] = useState(false)

    /* Если клиент выбрал услугу — заполняем поле автоматически */
    useEffect(() => {
        if (selectedService) {
            setForm(prev => ({ ...prev, service: selectedService.title }))
        }
    }, [selectedService])

    /* Обновляем поле формы */
    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    /* Отправка через mailto */
    const handleSubmit = (e) => {
        e.preventDefault()
        playThunder()
        vibrateThunder()

        /* Формируем тело письма */
        const subject = encodeURIComponent(`Anfrage von ${form.name} — ${form.service}`)
        const body = encodeURIComponent(
            `Name: ${form.name}\n` +
            `E-Mail: ${form.email}\n` +
            `Telefon: ${form.phone}\n` +
            `Leistung: ${form.service}\n` +
            `Budget: ${form.budget}\n` +
            `Nachricht: ${form.message}`
        )

        window.location.href = `mailto:hello@perunix-web.de?subject=${subject}&body=${body}`

        /* Показываем сообщение об успехе */
        setSent(true)
        setSelectedService(null)

        /* Сбрасываем форму */
        setTimeout(() => {
            setForm({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
            setSent(false)
        }, 5000)
    }

    return (
        <section className={styles.contact} id="contact">
            <div className={styles.container}>

                {/* Заголовок */}
                <motion.h2
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Kontakt <span className={styles.accent}>aufnehmen</span>
                </motion.h2>

                {/* Подзаголовок */}
                <motion.p
                    className={styles.sectionSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Kostenlose Erstberatung — wir melden uns innerhalb von 24 Stunden.
                </motion.p>

                {/* Двухколоночный layout */}
                <div className={styles.grid}>

                    {/* Левая колонка — форма */}
                    <motion.div
                        className={styles.formWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Успешная отправка */}
                        {sent ? (
                            <div className={styles.successMsg}>
                                <span className={styles.successIcon}>✅</span>
                                <h3>Vielen Dank!</h3>
                                <p>Ihre Anfrage wurde gesendet. Wir melden uns bald!</p>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>

                                {/* Имя */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="name">Ihr Name *</label>
                                    <input
                                        className={styles.input}
                                        id="name" name="name" type="text"
                                        placeholder="Max Mustermann"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="email">E-Mail *</label>
                                    <input
                                        className={styles.input}
                                        id="email" name="email" type="email"
                                        placeholder="max@beispiel.de"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Телефон */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="phone">Telefon</label>
                                    <input
                                        className={styles.input}
                                        id="phone" name="phone" type="tel"
                                        placeholder="+49 123 456 789"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Услуга — заполняется автоматически из контекста */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="service">
                                        Gewünschte Leistung
                                        {selectedService && (
                                            <span className={styles.autoFilled}> ✓ ausgewählt</span>
                                        )}
                                    </label>
                                    <CustomSelect
                                        options={[
                                            'Starter — ab 399€',
                                            'Business — ab 899€',
                                            'Premium — ab 2.499€',
                                            'Werbeseiten',
                                            'Web-Apps',
                                            'Animierte Seiten',
                                            'Online-Shop & Marktplatz',
                                            'Formulare & Umfragen',
                                            'Backend & API',
                                            'Sonstiges',
                                        ]}
                                        value={form.service}
                                        onChange={(value) => setForm(prev => ({ ...prev, service: value }))}
                                        placeholder="Bitte wählen..."
                                    />
                                </div>

                                {/* Бюджет */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="budget">Budget</label>
                                    <CustomSelect
                                        options={[
                                            'bis 500€',
                                            '500–1.000€',
                                            '1.000–3.000€',
                                            'über 3.000€',
                                            'Noch offen',
                                        ]}
                                        value={form.budget}
                                        onChange={(value) => setForm(prev => ({ ...prev, budget: value }))}
                                        placeholder="Bitte wählen..."
                                    />
                                </div>

                                {/* Сообщение */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="message">Nachricht</label>
                                    <textarea
                                        className={styles.textarea}
                                        id="message" name="message"
                                        placeholder="Beschreiben Sie Ihr Projekt..."
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>

                                {/* Кнопка отправки */}
                                <button className={styles.submitBtn} type="submit">
                                    Anfrage senden ⚡
                                </button>

                            </form>
                        )}
                    </motion.div>

                    {/* Правая колонка — контакты */}
                    <motion.div
                        className={styles.infoWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Контактные карточки */}
                        {CONTACT_INFO.map(item => (
                            <div key={item.id} className={styles.infoCard}>
                                <span className={styles.infoIcon}>{item.icon}</span>
                                <div className={styles.infoText}>
                                    <span className={styles.infoLabel}>{item.label}</span>
                                    <span className={styles.infoValue}>{item.value}</span>
                                </div>
                            </div>
                        ))}

                        {/* WhatsApp */}
                        <div className={styles.whatsapp}>
                            <p className={styles.whatsappText}>
                                Lieber direkt schreiben?
                            </p>

                            <a href="https://wa.me/49123456789"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.whatsappBtn}
                            >
                                💬 WhatsApp
                            </a>
                        </div>

                    </motion.div>
                </div>

            </div>
        </section>
    )
}

export default ContactSection