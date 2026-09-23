import { describe, test, expect } from "bun:test"
import { cycleCategory, cycleSpeed, cycleSchedule, getConfigDisplay } from "../src/config"
import { EmojiCategory, AnimationSpeed, ScheduleMode, EmojiConfig, DEFAULT_CONFIG } from "../src/types"
import { getCategoryList } from "../src/characters"

describe("Config: cycleCategory", () => {
  test("cycles through all categories", () => {
    const categories = getCategoryList()
    let current: EmojiCategory = categories[0]
    const visited: EmojiCategory[] = []

    for (let i = 0; i < categories.length; i++) {
      visited.push(current)
      current = cycleCategory(current)
    }

    expect(visited.length).toBe(categories.length)
    expect(new Set(visited).size).toBe(categories.length)
  })

  test("wraps around to first", () => {
    const categories = getCategoryList()
    let current: EmojiCategory = categories[0]
    for (let i = 0; i < categories.length; i++) {
      current = cycleCategory(current)
    }
    expect(current).toBe(categories[0])
  })
})

describe("Config: cycleSpeed", () => {
  test("cycles slow -> medium -> fast -> slow", () => {
    expect(cycleSpeed('slow')).toBe('medium')
    expect(cycleSpeed('medium')).toBe('fast')
    expect(cycleSpeed('fast')).toBe('slow')
  })

  test("unknown speed defaults to medium", () => {
    expect(cycleSpeed('custom' as AnimationSpeed)).toBe('medium')
  })
})

describe("Config: cycleSchedule", () => {
  test("cycles always -> hourly -> always", () => {
    expect(cycleSchedule('always')).toBe('hourly')
    expect(cycleSchedule('hourly')).toBe('always')
  })

  test("unknown schedule defaults to always", () => {
    expect(cycleSchedule('custom')).toBe('always')
  })
})

describe("Config: getConfigDisplay", () => {
  test("returns formatted config string", () => {
    const display = getConfigDisplay(DEFAULT_CONFIG)
    expect(display).toContain('animals')
    expect(display).toContain('wave')
    expect(display).toContain('medium')
    expect(display).toContain('always')
  })
})
