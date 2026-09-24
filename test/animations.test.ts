import { describe, test, expect } from "bun:test"
import { generateFrame, getInterval, cycleAnimation, ANIMATION_LIST } from "../src/animations"
import { AnimationType, AnimationSpeed } from "../src/types"

const testEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰']

describe("Animations: frame generation", () => {
  const types: AnimationType[] = ['wave', 'bounce', 'spin', 'roll', 'crawl', 'orbit', 'dance', 'float']

  for (const type of types) {
    test(`${type} generates valid frame`, () => {
      const frame = generateFrame(type, testEmojis, 0)
      expect(frame.emojis).toEqual(testEmojis)
      expect(frame.positions.length).toBe(testEmojis.length)
      expect(frame.offsets.length).toBe(testEmojis.length)
    })

    test(`${type} positions are non-negative`, () => {
      for (let i = 0; i < 20; i++) {
        const frame = generateFrame(type, testEmojis, i)
        for (const pos of frame.positions) {
          expect(pos).toBeGreaterThanOrEqual(0)
        }
      }
    })

    test(`${type} positions are bounded`, () => {
      for (let i = 0; i < 20; i++) {
        const frame = generateFrame(type, testEmojis, i)
        for (const pos of frame.positions) {
          expect(pos).toBeLessThanOrEqual(35) // MAX_POS
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
    const frame = generateFrame('bounce', ['🐶'], 8)
    // Bounce pattern has 0 at index 8
    expect(frame.positions[0]).toBe(0)
  })
})

describe("Animations: dance specific", () => {
  test("dance produces side-to-side motion", () => {
    const frame0 = generateFrame('dance', ['🐶'], 0)
    const frame1 = generateFrame('dance', ['🐶'], 1)
    // Positions should change between frames
    expect(frame0.positions[0]).not.toBe(frame1.positions[0])
  })
})

describe("Animations: float specific", () => {
  test("float produces smooth motion", () => {
    const positions: number[] = []
    for (let i = 0; i < 10; i++) {
      const frame = generateFrame('float', ['🐶'], i)
      positions.push(frame.positions[0])
    }
    // Should have some variation
    const unique = new Set(positions)
    expect(unique.size).toBeGreaterThan(1)
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
