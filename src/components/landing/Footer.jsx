/* ===================== FOOTER ===================== */
/* Компонент: Footer.jsx                             */
/* Подвал сайта — логотип, навигация, копирайт       */

import styles from './Footer.module.css'

/* Навигационные ссылки */
const NAV_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Tech', href: '#tech' },
    { label: 'Preise', href: '#pricing' },
    { label: 'Kontakt', href: '#contact' },
]

/* Социальные сети */
const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/login-nigol', icon: '🐙' },
    { label: 'LinkedIn', href: '#', icon: '💼' },
    { label: 'WhatsApp', href: 'https://wa.me/49123456789', icon: '💬' },
]

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Верхняя часть — логотип + навигация + соцсети */}
                <div className={styles.top}>

                    {/* Логотип и слоган */}
                    <div className={styles.brand}>
                        <a href="#hero" className={styles.logo}>
                            <span className={styles.accent}>PER</span>UN<span className={styles.accent}>IX</span>
                        </a>
                        <p className={styles.slogan}>
                            Mit uns wird jedes Projekt zur Legende.
                        </p>
                    </div>

                    {/* Навигация */}
                    <nav className={styles.nav}>
                        <h4 className={styles.navTitle}>Navigation</h4>
                        {NAV_LINKS.map(link => (
                            <a key={link.href} href={link.href} className={styles.navLink}>
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Контакт */}
                    <div className={styles.contactBlock}>
                        <h4 className={styles.navTitle}>Kontakt</h4>
                        <p className={styles.contactItem}>📍 Regensburg, Bayern</p>
                        <p className={styles.contactItem}>✉️ info@perunix-web.de</p>
                        <p className={styles.contactItem}>🕐 Mo–Fr: 9:00 – 18:00</p>
                    </div>

                    {/* Соцсети */}
                    <div className={styles.socialsBlock}>
                        <h4 className={styles.navTitle}>Social</h4>
                        {SOCIALS.map(social => (

                            <a key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.socialLink}
                            >
                                {social.icon} {social.label}
                            </a>
                        ))}
                    </div>

                </div>

                {/* Разделитель */}
                <div className={styles.divider} />

                {/* Нижняя часть — копирайт */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {year} PERUNIX. Alle Rechte vorbehalten.
                    </p>
                    <div className={styles.legal}>
                        <a href="#" className={styles.legalLink}>Impressum</a>
                        <a href="#" className={styles.legalLink}>Datenschutz</a>
                    </div>
                </div>

            </div>
        </footer >
    )
}

export default Footer