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

/* Контактные данные */
const CONTACT_INFO = [
    { id: 1, icon: '📍', label: 'Adresse', value: 'Regensburg, Bayern' },
    { id: 2, icon: '✉️', label: 'E-Mail', value: 'info@perunix-web.de' },
    { id: 3, icon: '🕐', label: 'Öffnungszeiten', value: 'Mo–Fr: 9:00 – 18:00 Uhr' },
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

        window.location.href = `mailto:info@perunix-web.de?subject=${subject}&body=${body}`

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
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
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
                                        {/* Индикатор что поле заполнено автоматически */}
                                        {selectedService && (
                                            <span className={styles.autoFilled}> ✓ ausgewählt</span>
                                        )}
                                    </label>
                                    <select
                                        className={styles.select}
                                        id="service" name="service"
                                        value={form.service}
                                        onChange={handleChange}
                                    >
                                        <option value="">Bitte wählen...</option>
                                        <option value="Starter">Starter — ab 799€</option>
                                        <option value="Business">Business — ab 1.999€</option>
                                        <option value="Premium">Premium — ab 4.999€</option>
                                        <option value="Werbeseiten">Werbeseiten</option>
                                        <option value="Web-Apps">Web-Apps</option>
                                        <option value="Animierte Seiten">Animierte Seiten</option>
                                        <option value="Online-Shop">Online-Shop & Marktplatz</option>
                                        <option value="Formulare">Formulare & Umfragen</option>
                                        <option value="Backend">Backend & API</option>
                                        <option value="Sonstiges">Sonstiges</option>
                                    </select>
                                </div>

                                {/* Бюджет */}
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="budget">Budget</label>
                                    <select
                                        className={styles.select}
                                        id="budget" name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                    >
                                        <option value="">Bitte wählen...</option>
                                        <option value="bis 1.000€">bis 1.000€</option>
                                        <option value="1.000–3.000€">1.000–3.000€</option>
                                        <option value="3.000–6.000€">3.000–6.000€</option>
                                        <option value="über 6.000€">über 6.000€</option>
                                        <option value="Noch offen">Noch offen</option>
                                    </select>
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
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
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