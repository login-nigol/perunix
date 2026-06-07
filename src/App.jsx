/* ===================== APP ===================== */
import { ServiceProvider } from './context/ServiceContext'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    /* Провайдер даёт доступ к выбранной услуге всем компонентам */
    <ServiceProvider>
      <LandingPage />
    </ServiceProvider>
  )
}

export default App