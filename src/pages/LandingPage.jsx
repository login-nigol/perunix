/* ===================== LANDING PAGE ===================== */
/* Корневая страница — собирает все секции воедино           */
/* LightningCanvas рендерится позади всего контента          */

import LightningCanvas from '../components/canvas/LightningCanvas'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import ServicesSection from '../components/landing/ServicesSection'
import PortfolioSection from '../components/landing/PortfolioSection'
import TechSection from '../components/landing/TechSection'
import PricingSection from '../components/landing/PricingSection'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

import styles from './LandingPage.module.css'
import Bug from '../components/ui/Bug'

function LandingPage() {
    return (
        /* Обёртка всей страницы — позиция relative чтобы canvas был за контентом */
        <div className={styles.page}>

            {/* Анимированный фон — молнии, частицы, код */}
            <LightningCanvas />

            <Bug />

            {/* Навигация поверх всего */}
            <Navbar />

            {/* Основной контент поверх канваса */}
            <main className={styles.main}>
                <HeroSection />
                <ServicesSection />
                <PortfolioSection />
                <TechSection />
                <PricingSection />
                {/* <ContactSection /> */}
            </main>

            {/* Подвал */}
            {/* <Footer /> */}

        </div>
    )
}

export default LandingPage