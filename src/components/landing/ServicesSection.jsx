/* ===================== SERVICES SECTION ===================== */
/* Компонент: ServicesSection.jsx                              */
/* 6 карточек услуг — кликабельны, открывают модалку          */
/* При выборе услуги — сохраняем в глобальный контекст        */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useService } from '../../context/ServiceContext'
/* Импорты хуков */
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'

import styles from './ServicesSection.module.css'
/* Импорт модалки */
import ServiceModal from '../ui/ServiceModal'

/* ===================== ДАННЫЕ УСЛУГ ===================== */
/* Все тексты на немецком — понятны обычному клиенту        */
const SERVICES = [
    {
        id: 'landing',
        icon: '🌐',
        title: 'Werbeseiten',
        short: 'Eine moderne Seite die Ihre Kunden überzeugt',
        description: 'Wir erstellen professionelle Werbeseiten für Ihr Unternehmen. Ansprechendes Design, schnelle Ladezeiten und klare Botschaften — damit Ihre Kunden sofort verstehen was Sie anbieten und Sie kontaktieren.',
        includes: [
            'Individuelles Design nach Ihren Wünschen',
            'Mobilfreundlich für alle Geräte',
            'Schnelle Ladezeiten',
            'Kontaktformular',
            'Google Maps Integration',
        ],
        questions: [
            { id: 'pages', label: 'Wie viele Seiten benötigen Sie?', type: 'select', options: ['1 Seite', '2-3 Seiten', '4-5 Seiten', 'Mehr als 5'] },
            { id: 'deadline', label: 'Wann soll die Seite fertig sein?', type: 'select', options: ['So schnell wie möglich', 'In 1 Monat', 'In 2-3 Monaten', 'Kein festes Datum'] },
            { id: 'content', label: 'Haben Sie bereits Texte und Fotos?', type: 'select', options: ['Ja, alles vorhanden', 'Teilweise', 'Nein, brauche Hilfe'] },
        ],
    },
    {
        id: 'webapp',
        icon: '⚡',
        title: 'Web-Apps',
        short: 'Ihr eigenes Online-System mit Nutzerverwaltung',
        description: 'Wir entwickeln maßgeschneiderte Webanwendungen — mit Anmeldung, persönlichem Bereich und Datenverwaltung. Ideal für Firmen die ihre Prozesse digitalisieren möchten.',
        includes: [
            'Benutzeranmeldung und Registrierung',
            'Persönlicher Benutzerbereich',
            'Datenverwaltung und Speicherung',
            'Rollen und Zugriffsrechte',
            'Sicherheit und Datenschutz',
        ],
        questions: [
            { id: 'users', label: 'Wie viele Nutzer erwarten Sie?', type: 'select', options: ['Bis 100', '100-1000', 'Mehr als 1000', 'Weiß nicht'] },
            { id: 'roles', label: 'Brauchen Sie verschiedene Rollen?', type: 'select', options: ['Ja (z.B. Admin/Nutzer)', 'Nein', 'Bin nicht sicher'] },
            { id: 'mobile', label: 'Soll es auch als App funktionieren?', type: 'select', options: ['Ja', 'Nein', 'Vielleicht später'] },
        ],
    },
    {
        id: 'animation',
        icon: '✨',
        title: 'Animierte Seiten',
        short: 'Seiten die begeistern und im Gedächtnis bleiben',
        description: 'Wir gestalten Webseiten mit beeindruckenden Animationen und interaktiven Elementen. Ihre Besucher werden staunen — perfekt für Agenturen, Künstler und Premium-Marken.',
        includes: [
            'Flüssige Animationen und Übergänge',
            'Interaktive Elemente',
            'Canvas und 3D Effekte',
            'Scroll-Animationen',
            'Optimiert für alle Geräte',
        ],
        questions: [
            { id: 'style', label: 'Welcher Stil gefällt Ihnen?', type: 'select', options: ['Minimalistisch', 'Dynamisch/Aggressiv', 'Verspielt', 'Elegant/Premium'] },
            { id: 'ref', label: 'Haben Sie Referenzseiten?', type: 'select', options: ['Ja, ich schicke Links', 'Nein, vertraue eurem Geschmack'] },
            { id: 'lang', label: 'In welcher Sprache?', type: 'select', options: ['Deutsch', 'Englisch', 'Mehrsprachig'] },
        ],
    },
    {
        id: 'marketplace',
        icon: '🛒',
        title: 'Online-Shop & Marktplatz',
        short: 'Verkaufen Sie online — einfach und professionell',
        description: 'Wir bauen Ihren Online-Shop oder Marktplatz mit Produktkatalog, Warenkorb und Bestellverwaltung. Ihre Kunden kaufen bequem — Sie behalten den Überblick.',
        includes: [
            'Produktkatalog mit Kategorien',
            'Warenkorb und Bestellprozess',
            'Zahlungsintegration',
            'Bestellverwaltung',
            'Benachrichtigungen per E-Mail',
        ],
        questions: [
            { id: 'products', label: 'Wie viele Produkte haben Sie?', type: 'select', options: ['Bis 50', '50-200', 'Mehr als 200', 'Weiß nicht'] },
            { id: 'payment', label: 'Welche Zahlung soll möglich sein?', type: 'select', options: ['Überweisung', 'PayPal', 'Kreditkarte', 'Alles'] },
            { id: 'delivery', label: 'Liefern Sie selbst oder per Post?', type: 'select', options: ['Selbst', 'Per Post', 'Beides', 'Digitale Produkte'] },
        ],
    },
    {
        id: 'forms',
        icon: '📋',
        title: 'Formulare & Umfragen',
        short: 'Intelligente Formulare die sich selbst prüfen',
        description: 'Wir erstellen smarte Formulare und Umfragen — mit automatischer Überprüfung, dynamischen Feldern und direkter Datenverarbeitung. Keine falschen Eingaben mehr.',
        includes: [
            'Automatische Eingabeprüfung',
            'Dynamische Felder',
            'Datenversand per E-Mail',
            'Datenspeicherung',
            'Exportfunktion',
        ],
        questions: [
            { id: 'fields', label: 'Wie viele Felder brauchen Sie?', type: 'select', options: ['Bis 10', '10-20', 'Mehr als 20', 'Weiß nicht'] },
            { id: 'save', label: 'Sollen Daten gespeichert werden?', type: 'select', options: ['Ja, in Datenbank', 'Nur per E-Mail', 'Beides'] },
            { id: 'notify', label: 'Sollen Sie benachrichtigt werden?', type: 'select', options: ['Ja per E-Mail', 'Ja per SMS', 'Nein'] },
        ],
    },
    {
        id: 'fullstack',
        icon: '⚙️',
        title: 'Backend & API',
        short: 'Der Motor hinter Ihrer Anwendung',
        description: 'Wir entwickeln den Server, die Datenbank und die Schnittstellen für Ihre Anwendung. Sicher, schnell und skalierbar — damit Ihr System auch bei vielen Nutzern stabil läuft.',
        includes: [
            'REST API Entwicklung',
            'Datenbankdesign',
            'Benutzerauthentifizierung',
            'Server-Deployment',
            'Dokumentation',
        ],
        questions: [
            { id: 'existing', label: 'Haben Sie bereits ein Frontend?', type: 'select', options: ['Ja', 'Nein, brauche beides', 'Noch nicht'] },
            { id: 'scale', label: 'Wie viele Anfragen erwarten Sie?', type: 'select', options: ['Wenige (bis 100/Tag)', 'Mittel (bis 1000/Tag)', 'Viele (1000+/Tag)'] },
            { id: 'cloud', label: 'Wo soll der Server laufen?', type: 'select', options: ['Egal', 'AWS', 'Hetzner', 'Eigener Server'] },
        ],
    },
]

/* ===================== ОСНОВНОЙ КОМПОНЕНТ ===================== */
function ServicesSection() {
    /* Контекст — сохраняем выбранную услугу */
    const { setSelectedService } = useService()

    const { playClick } = useSound()
    const { vibrateClick } = useVibrate()

    /* Открытая модалка — null или объект услуги */
    const [activeService, setActiveService] = useState(null)

    /* Открываем модалку */
    const handleCardClick = (service) => {
        setActiveService(service)
    }

    /* Передаём услугу и ответы в контекст */
    const handleRequest = (service, answers) => {
        setSelectedService({ ...service, answers })
    }

    return (
        <section className={styles.services} id="services">
            <div className={styles.container}>

                {/* Заголовок секции */}
                <motion.h2
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Unsere <span className={styles.accent}>Leistungen</span>
                </motion.h2>

                {/* Подзаголовок */}
                <motion.p
                    className={styles.sectionSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Was auch immer Sie brauchen — wir haben die passende Lösung.
                </motion.p>

                {/* Сетка карточек */}
                <div className={styles.grid}>
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={service.id}
                            className={styles.card}
                            /* Появление карточек по очереди */
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            /* Hover анимация */
                            whileHover={{ y: -6 }}
                            onClick={() => {
                                playClick()
                                vibrateClick()
                                handleCardClick(service)
                            }}
                        >
                            {/* Иконка */}
                            <div className={styles.cardIcon}>{service.icon}</div>

                            {/* Название */}
                            <h3 className={styles.cardTitle}>{service.title}</h3>

                            {/* Короткое описание */}
                            <p className={styles.cardShort}>{service.short}</p>

                            {/* Кнопка на карточке */}
                            <button className={styles.cardBtn}>
                                Mehr erfahren →
                            </button>

                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Модалка — показываем если выбрана услуга */}
            {activeService && (
                <ServiceModal
                    service={activeService}
                    onClose={() => setActiveService(null)}
                    onRequest={handleRequest}
                />
            )}

        </section>
    )
}

export default ServicesSection