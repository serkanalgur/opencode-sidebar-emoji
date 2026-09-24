import Matter from 'matter-js'

const { Engine, World, Bodies, Body } = Matter

export interface PhysicsEmoji {
  emoji: string
  body: Matter.Body
}

export interface PhysicsState {
  engine: Matter.Engine
  emojis: PhysicsEmoji[]
  width: number
  height: number
}

// Create a physics engine for emoji animation
export function createPhysicsEngine(
  emojis: string[],
  width: number = 35,
  height: number = 10
): PhysicsState {
  const engine = Engine.create({
    gravity: { x: 0, y: 1, scale: 0.001 }
  })

  const emojiBodies: PhysicsEmoji[] = []

  // Create walls (bottom, left, right)
  const wallOptions = { isStatic: true, restitution: 0.8, friction: 0.1 }
  const bottom = Bodies.rectangle(width / 2, height + 0.5, width + 2, 1, wallOptions)
  const leftWall = Bodies.rectangle(-0.5, height / 2, 1, height + 2, wallOptions)
  const rightWall = Bodies.rectangle(width + 0.5, height / 2, 1, height + 2, wallOptions)

  World.add(engine.world, [bottom, leftWall, rightWall])

  // Create emoji bodies
  emojis.forEach((emoji, i) => {
    const x = (i + 1) * (width / (emojis.length + 1))
    const y = -1 - i * 2 // Start above the viewport
    const body = Bodies.circle(x, y, 0.5, {
      restitution: 0.7,
      friction: 0.05,
      density: 0.001,
      frictionAir: 0.01
    })
    World.add(engine.world, body)
    emojiBodies.push({ emoji, body })
  })

  return { engine, emojis: emojiBodies, width, height }
}

// Step the physics simulation
export function stepPhysics(state: PhysicsState, delta: number = 16.67): void {
  Engine.update(state.engine, delta)
}

// Get current positions of all emoji bodies
export function getPositions(state: PhysicsState): { emoji: string; x: number; y: number }[] {
  return state.emojis.map(e => ({
    emoji: e.emoji,
    x: e.body.position.x,
    y: e.body.position.y
  }))
}

// Apply a force to all bodies (for effects like wind, explosion)
export function applyForceToAll(state: PhysicsState, x: number, y: number): void {
  state.emojis.forEach(e => {
    Body.applyForce(e.body, e.body.position, { x, y })
  })
}

// Reset all bodies to random positions at top
export function resetPositions(state: PhysicsState): void {
  state.emojis.forEach((e, i) => {
    const x = (i + 1) * (state.width / (state.emojis.length + 1))
    Body.setPosition(e.body, { x, y: -1 - i * 2 })
    Body.setVelocity(e.body, { x: 0, y: 0 })
  })
}

// Destroy the physics engine
export function destroyPhysics(state: PhysicsState): void {
  World.clear(state.engine.world)
  Engine.clear(state.engine)
}
