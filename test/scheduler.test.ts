import { describe, test, expect } from "bun:test"
import { shouldAnimate, getTimeUntilNextHour } from "../src/scheduler"
import { ScheduleMode } from "../src/types"

describe("Scheduler: shouldAnimate", () => {
  test("always mode returns true", () => {
    expect(shouldAnimate('always')).toBe(true)
  })

  test("custom mode returns true", () => {
    expect(shouldAnimate('custom')).toBe(true)
  })

  test("hourly mode depends on time", () => {
    const result = shouldAnimate('hourly')
    expect(typeof result).toBe('boolean')
  })
})

describe("Scheduler: getTimeUntilNextHour", () => {
  test("returns positive number", () => {
    const ms = getTimeUntilNextHour()
    expect(ms).toBeGreaterThan(0)
  })

  test("returns at most 3600000ms (1 hour)", () => {
    const ms = getTimeUntilNextHour()
    expect(ms).toBeLessThanOrEqual(3600000)
  })
})
