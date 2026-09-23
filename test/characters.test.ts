import { describe, test, expect } from "bun:test"
import { EMOJI_CATEGORIES, getRandomEmojis, getCategoryList } from "../src/characters"
import { EmojiCategory } from "../src/types"

describe("Characters: category completeness", () => {
  const categories: EmojiCategory[] = [
    'animals', 'space', 'food', 'sports', 'nature',
    'faces', 'objects', 'activities', 'travel', 'music'
  ]

  test("all 10 categories exist", () => {
    for (const cat of categories) {
      expect(EMOJI_CATEGORIES[cat]).toBeDefined()
    }
  })

  test("each category has at least 10 emojis", () => {
    for (const cat of categories) {
      expect(EMOJI_CATEGORIES[cat].length).toBeGreaterThanOrEqual(10)
    }
  })
})

describe("Characters: getRandomEmojis", () => {
  test("returns requested count", () => {
    const emojis = getRandomEmojis('animals', 5)
    expect(emojis.length).toBe(5)
  })

  test("returns unique emojis", () => {
    const emojis = getRandomEmojis('space', 10)
    const unique = new Set(emojis)
    expect(unique.size).toBe(emojis.length)
  })

  test("returns emojis from correct category", () => {
    const pool = EMOJI_CATEGORIES['food']
    const emojis = getRandomEmojis('food', 5)
    for (const emoji of emojis) {
      expect(pool).toContain(emoji)
    }
  })

  test("handles count larger than pool gracefully", () => {
    const emojis = getRandomEmojis('animals', 100)
    expect(emojis.length).toBe(15) // pool size
  })
})

describe("Characters: getCategoryList", () => {
  test("returns all 10 categories", () => {
    const list = getCategoryList()
    expect(list.length).toBe(10)
  })

  test("returns string array of category names", () => {
    const list = getCategoryList()
    for (const item of list) {
      expect(typeof item).toBe('string')
    }
  })
})
