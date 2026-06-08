/* ===================== NAVBAR ===================== */
/* Компонент: Navbar.jsx                             */
/* Фиксированная навигация с якорными ссылками,     */
/* логотипом PERUNIX и кнопкой CTA                  */
/* На мобилке — бургер-меню                         */

import { useState, useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import { useVibrate } from '../../hooks/useVibrate'
import styles from './Navbar.module.css'

/* Якорные ссылки навигации */
const NAV_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Tech', href: '#tech' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
]

function Navbar() {
    /* Флаг — прокрутил ли пользователь страницу */
    const [scrolled, setScrolled] = useState(false)

    /* Флаг — открыто ли мобильное меню */
    const [menuOpen, setMenuOpen] = useState(false)

    /* Хуки звука и вибрации */
    const { playClick, playThunder } = useSound()
    const { vibrateClick, vibrateThunder } = useVibrate()

    /* Слушаем скролл — добавляем фон после 50px */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    /* Закрываем меню при клике на ссылку */
    const handleLinkClick = () => {
        playClick()
        vibrateClick()
        setMenuOpen(false)
    }

    /* Звук и вибрация на CTA кнопку */
    const handleCtaClick = () => {
        playThunder()
        vibrateThunder()
        setMenuOpen(false)
    }

    return (
        /* Фон появляется после скролла */
        <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>

                {/* Логотип */}
                <a href="#hero" className={styles.logo} onClick={handleLinkClick}>
                    {/* PER — золото, UN — тёмный, IX — золото */}
                    <span className={styles.accent}>
                        PER</span>
                    UN<span className={styles.accent}>
                        IX</span>
                </a>

                {/* Десктопное меню */}
                <nav className={styles.nav}>
                    {NAV_LINKS.map(link => (

                        <a key={link.href}
                            href={link.href}
                            className={styles.navLink}
                            onClick={handleLinkClick}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA кнопка — только десктоп */}

                <a href="#contact"
                    className={styles.cta}
                    onClick={handleCtaClick}
                >
                    Get Started
                </a>

                {/* Бургер — SVG три волнистые линии → крестик */}
                <button
                    className={styles.burger}
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                        playClick()
                        vibrateClick()
                    }}
                    aria-label="Toggle menu"
                >
                    <svg
                        viewBox="0 0 40 40"
                        className={styles.burgerSvg}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Верхняя волна → левая линия крестика */}
                        <path className={`${styles.burgerPath} ${styles.path1} ${menuOpen ? styles.open1 : ''}`}
                            d="M5,10 Q12,6 20,10 Q28,14 35,10"
                        />
                        {/* Средняя волна → исчезает */}
                        <path className={`${styles.burgerPath} ${styles.path2} ${menuOpen ? styles.open2 : ''}`}
                            d="M5,20 Q12,16 20,20 Q28,24 35,20"
                        />
                        {/* Нижняя волна → правая линия крестика */}
                        <path className={`${styles.burgerPath} ${styles.path3} ${menuOpen ? styles.open3 : ''}`}
                            d="M5,30 Q12,26 20,30 Q28,34 35,30"
                        />
                    </svg>
                </button>

            </div >

            {/* Мобильное меню — показывается при menuOpen */}
            {
                menuOpen && (
                    <div className={styles.mobileMenu}>
                        {NAV_LINKS.map(link => (

                            <a key={link.href}
                                href={link.href}
                                className={styles.mobileLink}
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </a>
                        ))
                        }

                        {/* CTA в мобильном меню */}

                        <a href="#contact"
                            className={styles.mobileCta}
                            onClick={handleCtaClick}
                        >
                            Get Started ⚡
                        </a >
                    </div >
                )
            }
        </header >
    )
}

export default Navbar