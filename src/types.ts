export type AnimationType = 'wave' | 'bounce' | 'spin' | 'roll' | 'crawl' | 'orbit' | 'dance' | 'float'
export type AnimationSpeed = 'slow' | 'medium' | 'fast' | 'custom'
export type ScheduleMode = 'always' | 'hourly' | 'custom'
export type EmojiCategory = 'animals' | 'space' | 'food' | 'sports' | 'nature' | 'faces' | 'objects' | 'activities' | 'travel' | 'music'

export interface EmojiConfig {
  category: EmojiCategory
  animation: AnimationType
  speed: AnimationSpeed
  customSpeedMs: number
  schedule: ScheduleMode
  enabled: boolean
  maxEmojis: number
}

export interface AnimationFrame {
  emojis: string[]
  positions: number[]
  offsets: number[]
}

export const DEFAULT_CONFIG: EmojiConfig = {
  category: 'animals',
  animation: 'wave',
  speed: 'medium',
  customSpeedMs: 500,
  schedule: 'always',
  enabled: true,
  maxEmojis: 8
}
