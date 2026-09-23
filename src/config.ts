import { EmojiConfig, EmojiCategory, AnimationType, AnimationSpeed, ScheduleMode, DEFAULT_CONFIG } from './types'
import { getCategoryList } from './characters'
import { ANIMATION_LIST, cycleAnimation } from './animations'

export function cycleCategory(current: EmojiCategory): EmojiCategory {
  const list = getCategoryList()
  const idx = list.indexOf(current)
  return list[(idx + 1) % list.length]
}

export function cycleSpeed(current: AnimationSpeed): AnimationSpeed {
  const speeds: AnimationSpeed[] = ['slow', 'medium', 'fast']
  const idx = speeds.indexOf(current)
  if (idx === -1) return 'medium'
  return speeds[(idx + 1) % speeds.length]
}

export function cycleSchedule(current: ScheduleMode): ScheduleMode {
  const modes: ScheduleMode[] = ['always', 'hourly']
  const idx = modes.indexOf(current)
  if (idx === -1) return 'always'
  return modes[(idx + 1) % modes.length]
}

export function getConfigDisplay(config: EmojiConfig): string {
  return `${config.category} | ${config.animation} | ${config.speed} | ${config.schedule}`
}
