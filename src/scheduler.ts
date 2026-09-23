import { ScheduleMode } from './types'

export function shouldAnimate(mode: ScheduleMode): boolean {
  switch (mode) {
    case 'always':
      return true
    case 'hourly':
      return isStartOfHour()
    case 'custom':
      return true
    default:
      return true
  }
}

function isStartOfHour(): boolean {
  const now = new Date()
  return now.getMinutes() === 0 && now.getSeconds() < 5
}

export function getTimeUntilNextHour(): number {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
  return nextHour.getTime() - now.getTime()
}
