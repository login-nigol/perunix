/* ===================== PRICING SECTION ===================== */
/* Компонент: PricingSection.jsx                              */
/* 3 тарифных плана — Starter, Business, Premium             */
/* Business выделен как популярный                           */
/* Клик на кнопку — скролл к контакту + выбор услуги        */

import { motion } from 'framer-motion'
import { useService } from '../../context/ServiceContext'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'
import styles from './PricingSection.module.css'

/* ===================== ДАННЫЕ ТАРИФОВ ===================== */
const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: '799',
        popular: false,
        description: 'Perfekt für Selbstständige und kleine Unternehmen',
        includes: [
            'Landingpage bis 3 Sektionen',
            'Responsives Design',
            'Kontaktformular',
            'Mobile optimiert',
            'SSL & Hosting-Setup',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        price: '1.999',
        popular: true,
        description: 'Für Unternehmen die online wachsen wollen',
        includes: [
            'Website bis 5 Seiten',
            'Individuelle Animationen',
            'SEO Grundoptimierung',
            'Galerie & Formulare',
            'Google Maps Integration',
            '3 Monate Support',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '4.999',
        popular: false,
        description: 'Vollständige Web-App mit Backend',
        includes: [
            'Individuelle Web-Anwendung',
            'Benutzeranmeldung & Rollen',
            'Datenbank & API',
            'Admin-Bereich',
            'Deployment & CI/CD',
            '6 Monate Support',
        ],
    },
]

function PricingSection() {
    const { setSelectedService } = useService()
    const { playThunder } = useSound()
    const { vibrateThunder } = useVibrate()

    /* Клик на кнопку — сохраняем план и скроллим к контакту */
    const handleSelect = (plan) => {
        playThunder()
        vibrateThunder()
        setSelectedService({ title: plan.name, answers: {} })
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className={styles.pricing} id="pricing">
            <div className={styles.container}>

                {/* Заголовок */}
                <motion.h2
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Unsere <span className={styles.accent}>Preise</span>
                </motion.h2>

                {/* Подзаголовок */}
                <motion.p
                    className={styles.sectionSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Transparente Preise ohne versteckte Kosten.
                    Alle Pakete inkl. individuellem Design.
                </motion.p>

                {/* Сетка тарифов */}
                <div className={styles.grid}>
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Бейдж популярного */}
                            {plan.popular && (
                                <div className={styles.popularBadge}>
                                    ⭐ Beliebteste Wahl
                                </div>
                            )}

                            {/* Название */}
                            <h3 className={styles.planName}>{plan.name}</h3>

                            {/* Описание */}
                            <p className={styles.planDescription}>{plan.description}</p>

                            {/* Цена */}
                            <div className={styles.priceRow}>
                                <span className={styles.priceFrom}>ab</span>
                                <span className={styles.price}>{plan.price}€</span>
                            </div>

                            {/* Разделитель */}
                            <div className={styles.divider} />

                            {/* Что входит */}
                            <ul className={styles.features}>
                                {plan.includes.map((item, i) => (
                                    <li key={i} className={styles.feature}>
                                        <span className={styles.check}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Кнопка */}
                            <button
                                className={`${styles.btn} ${plan.popular ? styles.btnPrimary : styles.btnSecondary}`}
                                onClick={() => handleSelect(plan)}
                            >
                                Jetzt anfragen ⚡
                            </button>

                        </motion.div>
                    ))}
                </div>

                {/* Сноска */}
                <motion.p
                    className={styles.note}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    * Alle Preise zzgl. MwSt. Individuelle Anfragen und Sonderprojekte
                    auf Anfrage. Kostenlose Erstberatung inklusive.
                </motion.p>

            </div>
        </section>
    )
}

export default PricingSection