import { EmojiCategory } from './types'

export const EMOJI_CATEGORIES: Record<EmojiCategory, string[]> = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
  space: ['🚀', '🛸', '🌟', '⭐', '🌙', '☄️', '🛰️', '🪐', '🌌', '👽', '🤖', '💫', '🌠', '🪩', '🎆'],
  food: ['🍕', '🍔', '🌮', '🍿', '🍦', '🍩', '🍰', '🧁', '🎂', '🍪', '🧀', '🍣', '🍱', '🍜', '🥗'],
  sports: ['⚽', '🏀', '🏈', '🎾', '🏓', '🎳', '⛳', '🎣', '🎿', '🏂', '🏄', '🏋️', '🤸', '🥊', '🚴'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌿', '🍀', '🌈', '☀️', '🌊', '🌋', '🌲', '🌵', '🍃', '🦋', '🐝'],
  faces: ['😀', '😂', '🥹', '😍', '🥳', '😎', '🤩', '😊', '🤗', '😴', '🤯', '😱', '🫠', '😏', '🥴'],
  objects: ['💎', '🔮', '🎨', '🎯', '🎲', '🎸', '🎺', '🥁', '🎪', '🎭', '🎬', '🏆', '🪄', '🔔', '🧲'],
  activities: ['🎉', '🎊', '🎆', '🎇', '🎈', '🎁', '🪅', '🎠', '🎡', '🎢', '🎪', '🎭', '🎨', '🎯', '🎲'],
  travel: ['✈️', '🚗', '🚂', '🚁', '🛸', '⛵', '🏔️', '🗼', '🏰', '🗽', '🏖️', '🌅', '🗺️', '🧭', '⛽'],
  music: ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '🪗', '🪕', '🎙️', '🎚️', '🎛️']
}

export function getRandomEmojis(category: EmojiCategory, count: number): string[] {
  const pool = EMOJI_CATEGORIES[category]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getCategoryList(): EmojiCategory[] {
  return Object.keys(EMOJI_CATEGORIES) as EmojiCategory[]
}
