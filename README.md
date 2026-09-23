# @serkanalgur/opencode-sidebar-emoji

[![npm version](https://img.shields.io/npm/v/@serkanalgur/opencode-sidebar-emoji)](https://www.npmjs.com/package/@serkanalgur/opencode-sidebar-emoji)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fun emoji animation widget for OpenCode V2 sidebar.

## Features

- 🎭 10 emoji categories (animals, space, food, sports, nature, faces, objects, activities, travel, music)
- 🎬 6 animation types (wave, bounce, spin, roll, crawl, orbit)
- ⚡ 3 speed presets + custom speed option
- 🕐 Schedule modes (always, hourly)
- ⌨️ Keyboard shortcuts for quick configuration
- 💾 Persistent configuration via OpenCode storage
- 🔌 Zero dependencies (beyond peer dependencies)
- 📦 Lightweight and tree-shakable

## Installation

```bash
# Using npm
npm install @serkanalgur/opencode-sidebar-emoji

# Using bun
bun add @serkanalgur/opencode-sidebar-emoji
```

## Configuration

The plugin stores its configuration automatically. You can modify settings via keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+E` | Cycle emoji category |
| `Ctrl+Shift+S` | Cycle animation speed |
| `Ctrl+Shift+A` | Cycle animation type |
| `Ctrl+Shift+D` | Pause/Resume animations |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `category` | EmojiCategory | `'animals'` | Emoji set to display |
| `animation` | AnimationType | `'wave'` | Animation pattern |
| `speed` | AnimationSpeed | `'medium'` | Animation speed preset |
| `customSpeedMs` | number | `500` | Custom interval in ms (when speed='custom') |
| `schedule` | ScheduleMode | `'always'` | When to show animations |
| `enabled` | boolean | `true` | Enable/disable the widget |
| `maxEmojis` | number | `8` | Maximum emojis displayed |

## Animation Types

| Type | Description |
|------|-------------|
| `wave` | Emojis move in a wave pattern |
| `bounce` | Emojis bounce up and down |
| `spin` | Emojis rotate through positions |
| `roll` | Emojis roll across the screen |
| `crawl` | Emojis crawl in a step pattern |
| `orbit` | Emojis orbit around a center |

## Emoji Categories

| Category | Emojis |
|----------|--------|
| `animals` | 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 |
| `space` | 🚀 🛸 🌟 ⭐ 🌙 ☄️ 🛰️ 🪐 🌌 👽 🤖 💫 🌠 🪩 🎆 |
| `food` | 🍕 🍔 🌮 🍿 🍦 🍩 🍰 🧁 🎂 🍪 🧀 🍣 🍱 🍜 🥗 |
| `sports` | ⚽ 🏀 🏈 🏓 🎳 ⛳ 🎣 🎿 🏂 🏄 🏋️ 🤸 🥊 🚴 |
| `nature` | 🌸 🌺 🌻 🌹 🌿 🍀 🌈 ☀️ 🌊 🌋 🌲 🌵 🍃 🦋 🐝 |
| `faces` | 😀 😂 🥹 😍 🥳 😎 🤩 😊 🤗 😴 🤯 😱 🫠 😏 🥴 |
| `objects` | 💎 🔮 🎨 🎯 🎲 🎸 🎺 🥁 🎪 🎭 🎬 🏆 🪄 🔔 🧲 |
| `activities` | 🎉 🎊 🎆 🎇 🎈 🎁 🪅 🎠 🎡 🎢 🎪 🎭 🎨 🎯 🎲 |
| `travel` | ✈️ 🚗 🚂 🚁 🛸 ⛽ 🏔️ 🗼 🗽 🏖️ 🌅 🗺️ 🧭 ⛽ |
| `music` | 🎵 🎶 🎤 🎧 🎸 🎹 🎺 🎻 🥁 🪘 🪗 🪕 🎙️ 🎚️ 🎛️ |

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/serkanalgur/opencode-sidebar-emoji.git
cd opencode-sidebar-emoji

# Install dependencies
bun install

# Start development mode
bun run dev
```

### Build

```bash
bun run build
```

### Type Check

```bash
bun run typecheck
```

### Test

```bash
bun test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
