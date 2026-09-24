import { AnimationType, AnimationFrame, AnimationSpeed } from './types'

const SPEED_MAP: Record<AnimationSpeed, number> = {
  slow: 1000,
  medium: 500,
  fast: 250,
  custom: 0
}

export const MAX_POS = 35 // Fill sidebar width

export function getInterval(speed: AnimationSpeed, customMs: number): number {
  return speed === 'custom' ? customMs : SPEED_MAP[speed]
}

export function generateFrame(type: AnimationType, emojis: string[], frame: number): AnimationFrame {
  switch (type) {
    case 'wave': return waveFrame(emojis, frame)
    case 'bounce': return bounceFrame(emojis, frame)
    case 'spin': return spinFrame(emojis, frame)
    case 'roll': return rollFrame(emojis, frame)
    case 'crawl': return crawlFrame(emojis, frame)
    case 'orbit': return orbitFrame(emojis, frame)
    case 'dance': return danceFrame(emojis, frame)
    case 'float': return floatFrame(emojis, frame)
    // Physics-based (positions will be overridden by physics engine)
    case 'drop': return dropFrame(emojis, frame)
    case 'collision': return collisionFrame(emojis, frame)
    // Cat sprite animations
    case 'cat': return catFrame(emojis, frame)
    case 'cat-run': return catRunFrame(emojis, frame)
    default: return waveFrame(emojis, frame)
  }
}

function waveFrame(emojis: string[], frame: number): AnimationFrame {
  // Mexican wave: each emoji goes up and down with phase offset
  // Positions represent horizontal offset (spacing between emojis)
  const positions = emojis.map((_, i) => {
    const phase = ((frame + i * 3) % 10)
    // Triangle wave: 0,1,2,3,4,5,4,3,2,1 (10-step cycle)
    const v = phase < 5 ? phase : 9 - phase
    return Math.floor(v * (MAX_POS / 5))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function bounceFrame(emojis: string[], frame: number): AnimationFrame {
  // Bounce with gravity: fast up, slow down
  const bouncePattern = [0, 5, 10, 14, 16, 14, 10, 5, 0, 0, 0, 0]
  const positions = emojis.map((_, i) => {
    const idx = (frame + i * 2) % bouncePattern.length
    return Math.floor(bouncePattern[idx] * (MAX_POS / 16))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function spinFrame(emojis: string[], frame: number): AnimationFrame {
  // Spin: emojis rotate through positions
  const positions = emojis.map((_, i) => {
    const angle = ((frame + i * 4) % 8) * (Math.PI / 4)
    const x = Math.cos(angle)
    return Math.floor((x + 1) * (MAX_POS / 4))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function rollFrame(emojis: string[], frame: number): AnimationFrame {
  // Roll: emojis roll across the screen
  const positions = emojis.map((_, i) => {
    return ((frame * 2 + i * 5) % (MAX_POS + 1))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function crawlFrame(emojis: string[], frame: number): AnimationFrame {
  // Crawl: slow forward movement with pauses
  const crawlPattern = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1]
  const positions = emojis.map((_, i) => {
    const idx = (frame + i * 3) % crawlPattern.length
    return Math.floor(crawlPattern[idx] * (MAX_POS / 4))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function orbitFrame(emojis: string[], frame: number): AnimationFrame {
  // Orbit: circular motion
  const positions = emojis.map((_, i) => {
    const angle = ((frame + i * 3) % 20) * (Math.PI / 10)
    const x = Math.sin(angle)
    return Math.floor((x + 1) * (MAX_POS / 4))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function danceFrame(emojis: string[], frame: number): AnimationFrame {
  // Dance: quick side-to-side
  const dancePattern = [0, 8, 0, 8, 4, 12, 4, 12]
  const positions = emojis.map((_, i) => {
    const idx = (frame + i) % dancePattern.length
    return Math.floor(dancePattern[idx] * (MAX_POS / 16))
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

function floatFrame(emojis: string[], frame: number): AnimationFrame {
  // Float: gentle sinusoidal motion
  const positions = emojis.map((_, i) => {
    const t = (frame + i * 2) * 0.3
    const x = Math.sin(t) * 0.5 + 0.5
    return Math.floor(x * MAX_POS)
  })
  return { emojis, positions, offsets: emojis.map(() => 0) }
}

// Placeholder frames for physics-based animations
// Actual positions come from the physics engine
function dropFrame(emojis: string[], frame: number): AnimationFrame {
  return { emojis, positions: emojis.map(() => 0), offsets: emojis.map(() => 0) }
}

function collisionFrame(emojis: string[], frame: number): AnimationFrame {
  return { emojis, positions: emojis.map(() => 0), offsets: emojis.map(() => 0) }
}

// Cat sprite animation frames
// These return single-line representations for TUI display
const CAT_WALK = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

const CAT_WALK_2 = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

const CAT_WALK_3 = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

const CAT_RUN = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

const CAT_RUN_2 = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

const CAT_RUN_3 = [
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
  '/\\_/\\ (o.o) >^<',
]

function catFrame(emojis: string[], frame: number): AnimationFrame {
  // Cat walk cycles through 3 poses
  const pose = frame % 3
  const catFrames = [CAT_WALK, CAT_WALK_2, CAT_WALK_3]
  const currentPose = catFrames[pose]
  
  // Use the cat ASCII art as the "emoji"
  return { 
    emojis: [currentPose[0]], 
    positions: [0], 
    offsets: [0] 
  }
}

function catRunFrame(emojis: string[], frame: number): AnimationFrame {
  // Cat run cycles through 3 poses
  const pose = frame % 3
  const catFrames = [CAT_RUN, CAT_RUN_2, CAT_RUN_3]
  const currentPose = catFrames[pose]
  
  return { 
    emojis: [currentPose[0]], 
    positions: [0], 
    offsets: [0] 
  }
}

export const ANIMATION_LIST: AnimationType[] = [
  'wave', 'bounce', 'spin', 'roll', 'crawl', 'orbit', 'dance', 'float',
  'drop', 'collision', 'cat', 'cat-run'
]

export function cycleAnimation(current: AnimationType): AnimationType {
  const idx = ANIMATION_LIST.indexOf(current)
  return ANIMATION_LIST[(idx + 1) % ANIMATION_LIST.length]
}
