import { Plugin } from "@opencode/plugin/tui"
import { EmojiConfig, AnimationFrame, DEFAULT_CONFIG, EmojiCategory, AnimationType, AnimationSpeed, ScheduleMode } from "./types"
import { getRandomEmojis, getCategoryList } from "./characters"
import { generateFrame, getInterval, cycleAnimation, ANIMATION_LIST } from "./animations"
import { cycleCategory, cycleSpeed, cycleSchedule, getConfigDisplay } from "./config"
import { shouldAnimate } from "./scheduler"

export default Plugin.define({
  id: "sidebar-emoji.cli",
  setup(context) {
    // Persistent config
    const [config, setConfig] = context.storage.store<EmojiConfig>("sidebar-emoji-config", {
      initial: DEFAULT_CONFIG
    })

    // Ephemeral animation state
    const [animState, setAnimState] = context.storage.memory<{ frame: number }>("sidebar-emoji-frame", {
      initial: { frame: 0 }
    })

    const [pauseState, setPauseState] = context.storage.memory<{ paused: boolean }>("sidebar-emoji-paused", {
      initial: { paused: false }
    })

    let currentEmojis: string[] = getRandomEmojis(config().category, config().maxEmojis)
    let timer: ReturnType<typeof setInterval> | null = null

    function startAnimation() {
      if (timer) clearInterval(timer)
      const interval = getInterval(config().speed, config().customSpeedMs)
      timer = setInterval(() => {
        if (!pauseState().paused && shouldAnimate(config().schedule)) {
          setAnimState(s => { s.frame++ })
        }
      }, interval)
    }

    startAnimation()

    // Config dialog
    async function openConfigDialog() {
      const setting = await context.ui.dialog.select({
        title: "🎨 Emoji Settings",
        options: [
          { title: "📂 Category", value: "category", description: `Current: ${config().category}` },
          { title: "🎬 Animation", value: "animation", description: `Current: ${config().animation}` },
          { title: "⚡ Speed", value: "speed", description: `Current: ${config().speed}` },
          { title: "🕐 Schedule", value: "schedule", description: `Current: ${config().schedule}` },
          { title: "🔢 Max Emojis", value: "maxEmojis", description: `Current: ${config().maxEmojis}` },
          { title: "⏯️ Toggle", value: "toggle", description: pauseState().paused ? "Resume" : "Pause" },
        ]
      })

      if (!setting) return

      switch (setting) {
        case "category": {
          const categories = getCategoryList()
          const selected = await context.ui.dialog.select({
            title: "Select Emoji Category",
            current: config().category,
            options: categories.map(cat => ({
              title: cat.charAt(0).toUpperCase() + cat.slice(1),
              value: cat,
              description: `${config().category === cat ? '(active) ' : ''}${getRandomEmojis(cat, 3).join(' ')}`
            }))
          })
          if (selected) {
            setConfig(c => { c.category = selected })
            currentEmojis = getRandomEmojis(selected, config().maxEmojis)
            context.ui.toast.show({ title: "Emoji", message: `Category: ${selected}`, variant: "success" })
          }
          break
        }
        case "animation": {
          const selected = await context.ui.dialog.select({
            title: "Select Animation Type",
            current: config().animation,
            options: ANIMATION_LIST.map(anim => ({
              title: anim.charAt(0).toUpperCase() + anim.slice(1),
              value: anim,
              description: config().animation === anim ? '(active)' : ''
            }))
          })
          if (selected) {
            setConfig(c => { c.animation = selected })
            context.ui.toast.show({ title: "Emoji", message: `Animation: ${selected}`, variant: "success" })
          }
          break
        }
        case "speed": {
          const selected = await context.ui.dialog.select({
            title: "Select Animation Speed",
            current: config().speed,
            options: [
              { title: "🐌 Slow", value: "slow" as AnimationSpeed, description: "1000ms per frame" },
              { title: "🏃 Medium", value: "medium" as AnimationSpeed, description: "500ms per frame" },
              { title: "⚡ Fast", value: "fast" as AnimationSpeed, description: "250ms per frame" },
              { title: "🔧 Custom", value: "custom" as AnimationSpeed, description: `Current: ${config().customSpeedMs}ms` },
            ]
          })
          if (selected) {
            if (selected === "custom") {
              const msStr = await context.ui.dialog.prompt({
                title: "Custom Speed (ms)",
                placeholder: String(config().customSpeedMs),
                description: "Enter milliseconds per frame (100-5000)"
              })
              if (msStr) {
                const ms = parseInt(msStr, 10)
                if (!isNaN(ms) && ms >= 100 && ms <= 5000) {
                  setConfig(c => { c.speed = selected; c.customSpeedMs = ms })
                  context.ui.toast.show({ title: "Emoji", message: `Custom speed: ${ms}ms`, variant: "success" })
                } else {
                  context.ui.toast.show({ title: "Emoji", message: "Invalid speed value", variant: "error" })
                  return
                }
              }
            } else {
              setConfig(c => { c.speed = selected })
              context.ui.toast.show({ title: "Emoji", message: `Speed: ${selected}`, variant: "success" })
            }
            startAnimation()
          }
          break
        }
        case "schedule": {
          const selected = await context.ui.dialog.select({
            title: "Select Schedule Mode",
            current: config().schedule,
            options: [
              { title: "🔄 Always", value: "always" as ScheduleMode, description: "Animation runs continuously" },
              { title: "🕐 Hourly", value: "hourly" as ScheduleMode, description: "Animation at start of each hour" },
            ]
          })
          if (selected) {
            setConfig(c => { c.schedule = selected })
            context.ui.toast.show({ title: "Emoji", message: `Schedule: ${selected}`, variant: "success" })
          }
          break
        }
        case "maxEmojis": {
          const countStr = await context.ui.dialog.prompt({
            title: "Max Emojis (1-15)",
            placeholder: String(config().maxEmojis),
            description: "Number of emojis to display"
          })
          if (countStr) {
            const count = parseInt(countStr, 10)
            if (!isNaN(count) && count >= 1 && count <= 15) {
              setConfig(c => { c.maxEmojis = count })
              currentEmojis = getRandomEmojis(config().category, count)
              context.ui.toast.show({ title: "Emoji", message: `Max emojis: ${count}`, variant: "success" })
            } else {
              context.ui.toast.show({ title: "Emoji", message: "Invalid count (1-15)", variant: "error" })
            }
          }
          break
        }
        case "toggle": {
          setPauseState(s => { s.paused = !s.paused })
          context.ui.toast.show({
            title: "Emoji",
            message: pauseState().paused ? "Animation paused" : "Animation resumed",
            variant: "info"
          })
          break
        }
      }
    }

    // Register slash command and keymap
    context.keymap.layer(() => ({
      mode: "global",
      priority: 10,
      commands: [
        {
          id: "sidebar-emoji-config",
          title: "Emoji Settings",
          description: "Configure sidebar emoji animations",
          group: "Sidebar Emoji",
          bind: "ctrl+shift+o",
          palette: true,
          slash: { name: "emoji", aliases: ["em"] },
          run: () => { openConfigDialog() }
        }
      ]
    }))

    // Quick toggle keybinding (no dialog)
    context.keymap.layer(() => ({
      mode: "global",
      priority: 10,
      commands: [
        {
          id: "sidebar-emoji-category",
          title: "Cycle Category",
          group: "Sidebar Emoji",
          bind: "ctrl+shift+e",
          run: () => {
            setConfig(c => {
              c.category = cycleCategory(c.category)
              currentEmojis = getRandomEmojis(c.category, c.maxEmojis)
            })
            context.ui.toast.show({ title: "Emoji", message: `Category: ${config().category}`, variant: "info" })
          }
        },
        {
          id: "sidebar-emoji-speed",
          title: "Cycle Speed",
          group: "Sidebar Emoji",
          bind: "ctrl+shift+s",
          run: () => {
            setConfig(c => { c.speed = cycleSpeed(c.speed) })
            startAnimation()
            context.ui.toast.show({ title: "Emoji", message: `Speed: ${config().speed}`, variant: "info" })
          }
        },
        {
          id: "sidebar-emoji-animation",
          title: "Cycle Animation",
          group: "Sidebar Emoji",
          bind: "ctrl+shift+a",
          run: () => {
            setConfig(c => { c.animation = cycleAnimation(c.animation) })
            context.ui.toast.show({ title: "Emoji", message: `Animation: ${config().animation}`, variant: "info" })
          }
        },
        {
          id: "sidebar-emoji-toggle",
          title: "Toggle Pause",
          group: "Sidebar Emoji",
          bind: "ctrl+shift+d",
          run: () => {
            setPauseState(s => { s.paused = !s.paused })
            context.ui.toast.show({
              title: "Emoji",
              message: pauseState().paused ? "Animation paused" : "Animation resumed",
              variant: "info"
            })
          }
        }
      ]
    }))

    // Sidebar footer widget
    context.ui.slot({
      append: "sidebar.footer",
      render: (props) => {
        const currentFrame = animState().frame
        const isPaused = pauseState().paused
        
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
