import { Plugin } from "@opencode/plugin/tui"
import { EmojiConfig, AnimationFrame, DEFAULT_CONFIG } from "./types"
import { getRandomEmojis } from "./characters"
import { generateFrame, getInterval, cycleAnimation } from "./animations"
import { cycleCategory, cycleSpeed } from "./config"
import { shouldAnimate } from "./scheduler"

export default Plugin.define({
  id: "sidebar-emoji",
  setup(context) {
    const [config, setConfig] = context.storage.store<EmojiConfig>("sidebar-emoji-config", {
      initial: DEFAULT_CONFIG
    })

    const [frame, setFrame] = context.storage.memory("sidebar-emoji-frame", {
      initial: 0
    })

    const [paused, setPaused] = context.storage.memory("sidebar-emoji-paused", {
      initial: false
    })

    let currentEmojis: string[] = getRandomEmojis(config().category, config().maxEmojis)
    let timer: ReturnType<typeof setInterval> | null = null

    function startAnimation() {
      if (timer) clearInterval(timer)
      const interval = getInterval(config().speed, config().customSpeedMs)
      timer = setInterval(() => {
        if (!paused() && shouldAnimate(config().schedule)) {
          setFrame(f => f + 1)
        }
      }, interval)
    }

    startAnimation()

    context.keymap.layer({
      "ctrl+shift+e": () => {
        setConfig(c => {
          c.category = cycleCategory(c.category)
          currentEmojis = getRandomEmojis(c.category, c.maxEmojis)
        })
      },
      "ctrl+shift+s": () => {
        setConfig(c => { c.speed = cycleSpeed(c.speed) })
        startAnimation()
      },
      "ctrl+shift+a": () => {
        setConfig(c => { c.animation = cycleAnimation(c.animation) })
      },
      "ctrl+shift+d": () => {
        setPaused(p => !p)
      }
    })

    context.ui.slot({
      append: "sidebar.footer",
      render: (props) => {
        const currentFrame = frame()
        const isPaused = paused()
        
        if (!config().enabled || isPaused) {
          return (
            <box padding={1} marginTop={1}>
              <text fg="#666">⏸️ Emoji animations paused</text>
            </box>
          )
        }

        const animationFrame: AnimationFrame = generateFrame(
          config().animation,
          currentEmojis,
          currentFrame
        )

        const maxOffset = Math.max(...animationFrame.positions, 0)
        const rows: string[][] = []
        
        for (let y = 0; y <= maxOffset; y++) {
          const row: string[] = []
          animationFrame.emojis.forEach((emoji, i) => {
            row.push(animationFrame.positions[i] === y ? emoji : ' ')
          })
          rows.push(row)
        }

        let displayText = ''
        for (let y = maxOffset; y >= 0; y--) {
          displayText += (rows[y]?.join(' ') || '') + '\n'
        }

        const status = `${config().category} • ${config().animation} • ${config().speed}`

        return (
          <box padding={1} marginTop={1}>
            <text fg="#a78bfa" bold>{displayText}</text>
            <text fg="#666" dim>{status}</text>
          </box>
        )
      }
    })

    return () => {
      if (timer) clearInterval(timer)
    }
  }
})
