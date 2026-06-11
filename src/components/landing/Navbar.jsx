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

    /* Измеряем высоту navbar и передаём в CSS переменную */
    // const navRef = useRef(null)

    /* Хуки звука и вибрации */
    const { playClick, playThunder } = useSound()
    const { vibrateClick, vibrateThunder } = useVibrate()

    /* Слушаем скролл — добавляем фон после 50px */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // useEffect(() => {
    //     const updateHeight = () => {
    //         if (navRef.current) {
    //             const height = navRef.current.offsetHeight
    //             document.documentElement.style.setProperty('--navbar-height', `${height}px`)
    //         }
    //     }
    //     updateHeight()
    //     window.addEventListener('resize', updateHeight)
    //     return () => window.removeEventListener('resize', updateHeight)
    // }, [])

    /* Поделиться приложением через Web Share API */
    const handleShare = async () => {
        playClick()
        vibrateClick()
        if (navigator.share) {
            await navigator.share({
                title: 'PERUNIX — Premium Web Development',
                text: 'Профессиональная веб-разработка в Регенсбурге',
                url: 'https://perunix-web.de',
            })
        }
    }

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
            {/* Затемнение фона при открытом меню */}
            {menuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <div className={styles.container}>

                {/* Логотип — SVG иконка + текст */}

                <a href="/"
                    className={styles.logo}
                    onClick={(e) => {
                        e.preventDefault()
                        playClick()
                        vibrateClick()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                >
                    {/* SVG иконка шестигранник */}
                    <img
                        src="/logo-icon.svg"
                        alt="PERUNIX"
                        className={styles.logoIcon}
                    />
                    {/* Текст */}
                    <span>
                        <span className={styles.accent}>PER</span>UN<span className={styles.accent}>IX</span>
                    </span>
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

                        {/* Кнопка поделиться */}
                        <button className={styles.shareBtn} onClick={handleShare}>
                            <svg viewBox="0 0 32 32" className={styles.shareIcon}>
                                <path d="M27 22c-1.411 0-2.685 0.586-3.594 1.526l-13.469-6.734c0.041-0.258 0.063-0.522 0.063-0.791s-0.022-0.534-0.063-0.791l13.469-6.734c0.909 0.94 2.183 1.526 3.594 1.526 2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5c0 0.269 0.022 0.534 0.063 0.791l-13.469 6.734c-0.909-0.94-2.183-1.526-3.594-1.526-2.761 0-5 2.239-5 5s2.239 5 5 5c1.411 0 2.685-0.586 3.594-1.526l13.469 6.734c-0.041 0.258-0.063 0.522-0.063 0.791 0 2.761 2.239 5 5 5s5-2.239 5-5c0-2.761-2.239-5-5-5z" />
                            </svg>
                            Seite teilen
                        </button>

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