/* ===================== USE SOUND ===================== */
/* Хук для генерации звука через Web Audio API */
/* Без файлов — звук генерируется программно */
import { useRef } from 'react'

export function useSound() {
  /* Контекст Web Audio API — создаём один раз */
  const audioCtx = useRef(null)

  /* Инициализируем контекст при первом вызове */
  const getCtx = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtx.current
  }

  /* Короткий электрический щелчок — для hover на кнопки */
  const playClick = () => {
    const ctx = getCtx()
    const oscillator = ctx.createOscillator()
    const gainNode   = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    /* Высокая частота — звук молнии */
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1)

    /* Быстро затухает */
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }

  /* Мощный удар — для клика на CTA */
  const playThunder = () => {
    const ctx = getCtx()
    const oscillator = ctx.createOscillator()
    const gainNode   = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(150, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  return { playClick, playThunder }
}