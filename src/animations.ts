import { AnimationType, AnimationFrame, AnimationSpeed } from './types'

const SPEED_MAP: Record<AnimationSpeed, number> = {
  slow: 1000,
  medium: 500,
  fast: 250,
  custom: 0
}

export function getInterval(speed: AnimationSpeed, customMs: number): number {
  return speed === 'custom' ? customMs : SPEED_MAP[speed]
}

export function generateFrame(type: AnimationType, emojis: string[], frame: number): AnimationFrame {
  switch (type) {
    case 'wave':
      return waveFrame(emojis, frame)
    case 'bounce':
      return bounceFrame(emojis, frame)
    case 'spin':
      return spinFrame(emojis, frame)
    case 'roll':
      return rollFrame(emojis, frame)
    case 'crawl':
      return crawlFrame(emojis, frame)
    case 'orbit':
      return orbitFrame(emojis, frame)
    default:
      return waveFrame(emojis, frame)
  }
}

function waveFrame(emojis: string[], frame: number): AnimationFrame {
  const positions = emojis.map((_, i) => {
    const phase = (frame + i * 2) % 8
    return phase < 4 ? phase : 6 - phase
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function bounceFrame(emojis: string[], frame: number): AnimationFrame {
  const bouncePattern = [0, 1, 2, 3, 2, 1, 0, 0]
  const positions = emojis.map((_, i) => {
    return bouncePattern[(frame + i) % bouncePattern.length]
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function spinFrame(emojis: string[], frame: number): AnimationFrame {
  const positions = emojis.map((_, i) => (frame + i) % 4)
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function rollFrame(emojis: string[], frame: number): AnimationFrame {
  const positions = emojis.map((_, i) => (frame + i * 3) % 8)
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function crawlFrame(emojis: string[], frame: number): AnimationFrame {
  const crawlPattern = [0, 0, 1, 1, 2, 2, 1, 1]
  const positions = emojis.map((_, i) => {
    return crawlPattern[(frame + i * 2) % crawlPattern.length]
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function orbitFrame(emojis: string[], frame: number): AnimationFrame {
  const orbitPattern = [0, 1, 2, 3, 4, 3, 2, 1]
  const positions = emojis.map((_, i) => {
    return orbitPattern[(frame + i * 2) % orbitPattern.length]
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

export const ANIMATION_LIST: AnimationType[] = ['wave', 'bounce', 'spin', 'roll', 'crawl', 'orbit']

export function cycleAnimation(current: AnimationType): AnimationType {
  const idx = ANIMATION_LIST.indexOf(current)
  return ANIMATION_LIST[(idx + 1) % ANIMATION_LIST.length]
}
