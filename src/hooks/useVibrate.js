/* ===================== USE VIBRATE ===================== */
/* Хук для вибрации на мобильных устройствах */
/* Vibration API — работает на Android, не работает на iOS */
export function useVibrate() {
  /* Проверяем поддержку API */
  const isSupported = 'vibrate' in navigator

  /* Короткая вибрация — hover */
  const vibrateClick = () => {
    if (isSupported) navigator.vibrate(30)
  }

  /* Двойная вибрация — клик на CTA */
  const vibrateThunder = () => {
    if (isSupported) navigator.vibrate([50, 30, 100])
  }

  return { vibrateClick, vibrateThunder }
}