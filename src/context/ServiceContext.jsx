/* ===================== SERVICE CONTEXT ===================== */
/* Глобальный стейт — выбранная услуга                       */
/* Передаёт данные из ServicesSection в ContactSection        */
/* без prop drilling через все компоненты                     */

import { createContext, useContext, useState } from 'react'

/* Создаём контекст */
const ServiceContext = createContext(null)

/* Провайдер — оборачивает всё приложение */
export function ServiceProvider({ children }) {
    /* Выбранная услуга — null если не выбрана */
    const [selectedService, setSelectedService] = useState(null)

    return (
        <ServiceContext.Provider value={{ selectedService, setSelectedService }}>
            {children}
        </ServiceContext.Provider>
    )
}

/* Хук для удобного доступа к контексту */
export function useService() {
    return useContext(ServiceContext)
}