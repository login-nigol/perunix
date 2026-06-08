/* ===================== APP ===================== */
import { ServiceProvider } from './context/ServiceContext'
import { useEffect } from 'react'

import LandingPage from './pages/LandingPage'

function App() {
  useEffect(() => {
    /* Отключаем автовосстановление скролла браузером */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    /* Провайдер даёт доступ к выбранной услуге всем компонентам */
    <ServiceProvider>
      <LandingPage />
    </ServiceProvider>
  )
}

export default App