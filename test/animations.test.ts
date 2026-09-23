import { describe, test, expect } from "bun:test"
import { generateFrame, getInterval, cycleAnimation, ANIMATION_LIST } from "../src/animations"
import { AnimationType, AnimationSpeed } from "../src/types"

const testEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰']

describe("Animations: frame generation", () => {
  const types: AnimationType[] = ['wave', 'bounce', 'spin', 'roll', 'crawl', 'orbit']

  for (const type of types) {
    test(`${type} generates valid frame`, () => {
      const frame = generateFrame(type, testEmojis, 0)
      expect(frame.emojis).toEqual(testEmojis)
      expect(frame.positions.length).toBe(testEmojis.length)
      expect(frame.offsets.length).toBe(testEmojis.length)
    })

    test(`${type} positions are within valid range`, () => {
      for (let i = 0; i < 20; i++) {
        const frame = generateFrame(type, testEmojis, i)
        for (const pos of frame.positions) {
          // wave can produce -1 at phase=7, all others are non-negative
          if (type === 'wave') {
            expect(pos).toBeGreaterThanOrEqual(-1)
          } else {
            expect(pos).toBeGreaterThanOrEqual(0)
          }
        }
      }
    })

    test(`${type} positions are bounded`, () => {
      for (let i = 0; i < 20; i++) {
        const frame = generateFrame(type, testEmojis, i)
        for (const pos of frame.positions) {
          expect(pos).toBeLessThanOrEqual(10) // reasonable max
        }
      }
    })
  }
})

describe("Animations: wave specific", () => {
  test("wave creates phase offset between emojis", () => {
    const frame = generateFrame('wave', ['🐶', '🐱', '🐭'], 0)
    // At frame 0, positions should differ due to phase offset
    const uniquePositions = new Set(frame.positions)
    expect(uniquePositions.size).toBeGreaterThan(1)
  })
})

describe("Animations: bounce specific", () => {
  test("bounce returns to ground", () => {
    const frame = generateFrame('bounce', ['🐶'], 7)
    expect(frame.positions[0]).toBe(0) // back to ground at frame 7
  })
})

describe("Animations: cycleAnimation", () => {
  test("cycles through all animation types", () => {
    let current: AnimationType = 'wave'
    const visited: AnimationType[] = []

    for (let i = 0; i < ANIMATION_LIST.length; i++) {
      visited.push(current)
      current = cycleAnimation(current)
    }

    expect(visited.length).toBe(ANIMATION_LIST.length)
    expect(new Set(visited).size).toBe(ANIMATION_LIST.length)
  })

  test("wraps around to first after last", () => {
    let current: AnimationType = 'wave'
    for (let i = 0; i < ANIMATION_LIST.length; i++) {
      current = cycleAnimation(current)
    }
    expect(current).toBe('wave')
  })
})

describe("Animations: speed intervals", () => {
  test("slow speed is 1000ms", () => {
    expect(getInterval('slow', 500)).toBe(1000)
  })

  test("medium speed is 500ms", () => {
    expect(getInterval('medium', 500)).toBe(500)
  })

  test("fast speed is 250ms", () => {
    expect(getInterval('fast', 500)).toBe(250)
  })

  test("custom speed uses custom value", () => {
    expect(getInterval('custom', 750)).toBe(750)
  })
})
