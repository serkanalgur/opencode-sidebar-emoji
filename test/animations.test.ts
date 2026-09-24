import { describe, test, expect } from "bun:test"
import { generateFrame, getInterval, cycleAnimation, ANIMATION_LIST } from "../src/animations"
import { AnimationType, AnimationSpeed } from "../src/types"

const testEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰']

describe("Animations: frame generation", () => {
  const types: AnimationType[] = ['wave', 'bounce', 'spin', 'roll', 'crawl', 'orbit', 'dance', 'float', 'drop', 'collision']

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

describe("Animations: physics-based placeholders", () => {
  test("drop returns placeholder frame with correct structure", () => {
    const frame = generateFrame('drop', testEmojis, 0)
    expect(frame.emojis).toEqual(testEmojis)
    expect(frame.positions.length).toBe(testEmojis.length)
    expect(frame.offsets.length).toBe(testEmojis.length)
    // Positions are placeholders (all zeros) - physics engine overrides them
    expect(frame.positions.every(p => p === 0)).toBe(true)
  })

  test("collision returns placeholder frame with correct structure", () => {
    const frame = generateFrame('collision', testEmojis, 0)
    expect(frame.emojis).toEqual(testEmojis)
    expect(frame.positions.length).toBe(testEmojis.length)
    expect(frame.offsets.length).toBe(testEmojis.length)
    // Positions are placeholders (all zeros) - physics engine overrides them
    expect(frame.positions.every(p => p === 0)).toBe(true)
  })
})

describe("Animations: physics engine", () => {
  test("createPhysicsEngine initializes with correct emoji count", async () => {
    const { createPhysicsEngine } = await import('../src/physics')
    const emojis = ['🐶', '🐱', '🐭']
    const state = createPhysicsEngine(emojis, 35, 8)
    expect(state.emojis.length).toBe(3)
    expect(state.width).toBe(35)
    expect(state.height).toBe(8)
  })

  test("stepPhysics advances simulation", async () => {
    const { createPhysicsEngine, stepPhysics, getPositions } = await import('../src/physics')
    const emojis = ['🐶', '🐱']
    const state = createPhysicsEngine(emojis, 35, 8)
    
    const positionsBefore = getPositions(state)
    stepPhysics(state, 16.67)
    const positionsAfter = getPositions(state)
    
    // Positions should have changed due to gravity
    expect(positionsAfter[0].y).not.toBe(positionsBefore[0].y)
  })

  test("destroyPhysics cleans up", async () => {
    const { createPhysicsEngine, destroyPhysics } = await import('../src/physics')
    const emojis = ['🐶']
    const state = createPhysicsEngine(emojis)
    // Should not throw
    destroyPhysics(state)
  })

  test("applyForceToAll modifies body positions", async () => {
    const { createPhysicsEngine, stepPhysics, getPositions, applyForceToAll } = await import('../src/physics')
    const emojis = ['🐶', '🐱']
    const state = createPhysicsEngine(emojis, 35, 8)
    
    // Let bodies settle
    for (let i = 0; i < 50; i++) {
      stepPhysics(state, 16.67)
    }
    
    const positionsBefore = getPositions(state)
    applyForceToAll(state, 0.1, 0) // Apply rightward force
    stepPhysics(state, 16.67)
    const positionsAfter = getPositions(state)
    
    expect(positionsAfter[0].x).toBeGreaterThanOrEqual(positionsBefore[0].x)
  })
})
