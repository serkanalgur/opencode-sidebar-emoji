import { Plugin } from "@opencode/plugin/tui"
import { EmojiConfig, AnimationFrame, DEFAULT_CONFIG, EmojiCategory, AnimationType, AnimationSpeed, ScheduleMode } from "./types"
import { getRandomEmojis, getCategoryList } from "./characters"
import { generateFrame, getInterval, cycleAnimation, ANIMATION_LIST, MAX_POS } from "./animations"
import { cycleCategory, cycleSpeed, cycleSchedule, getConfigDisplay } from "./config"
import { shouldAnimate } from "./scheduler"
import { createPhysicsEngine, stepPhysics, getPositions, destroyPhysics, applyForceToAll, resetPositions, type PhysicsState } from "./physics"

const CONFIG_PATH = `${process.env.HOME}/.config/opencode/sidebar-emoji.json`

async function loadConfig(): Promise<EmojiConfig> {
  try {
    const file = Bun.file(CONFIG_PATH)
    if (await file.exists()) {
      return JSON.parse(await file.text()) as EmojiConfig
    }
  } catch {}
  return DEFAULT_CONFIG
}

async function saveConfig(config: EmojiConfig): Promise<void> {
  try {
    const dir = `${process.env.HOME}/.config/opencode`
    await Bun.write(`${dir}/.gitkeep`, '') // ensure dir exists
    await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2))
  } catch {}
}

export default Plugin.define({
  id: "sidebar-emoji.cli",
  async setup(context) {
    // Load config from file on startup
    const loadedConfig = await loadConfig()

    // Persistent config (in-memory, backed by file)
    const [config, setConfig] = context.storage.store<EmojiConfig>("sidebar-emoji-config", {
      initial: loadedConfig
    })

    // Ephemeral animation state
    const [animState, setAnimState] = context.storage.memory<{ frame: number }>("sidebar-emoji-frame", {
      initial: { frame: 0 }
    })

    const [pauseState, setPauseState] = context.storage.memory<{ paused: boolean }>("sidebar-emoji-paused", {
      initial: { paused: false }
    })

    let currentEmojis: string[] = getRandomEmojis(config.category, config.maxEmojis)
    let timer: ReturnType<typeof setInterval> | null = null
    let physicsState: PhysicsState | null = null

    function initPhysics() {
      if (physicsState) destroyPhysics(physicsState)
      physicsState = createPhysicsEngine(currentEmojis, MAX_POS, 8)
    }

    function isPhysicsAnimation(type: string): boolean {
      return type === 'drop' || type === 'collision'
    }

    // Helper: save config to file after every change
    function updateConfig(mutator: (c: EmojiConfig) => void) {
      setConfig(c => {
        mutator(c)
        saveConfig(c)
      })
    }

    function startAnimation() {
      if (timer) clearInterval(timer)
      
      const animType = String(config.animation)
      
      // Initialize physics if needed
      if (isPhysicsAnimation(animType)) {
        initPhysics()
      }
      
      const interval = getInterval(config.speed, config.customSpeedMs)
      timer = setInterval(() => {
        if (!pauseState.paused && shouldAnimate(config.schedule)) {
          // Step physics for physics-based animations
          if (isPhysicsAnimation(animType) && physicsState) {
            stepPhysics(physicsState, interval)
            
            // Add random forces for collision animation
            if (animType === 'collision' && animState.frame % 10 === 0) {
              applyForceToAll(physicsState, (Math.random() - 0.5) * 0.01, -0.005)
            }
          }
          
          setAnimState(s => { s.frame++ })
        }
      }, interval)
    }

    startAnimation()

    // Custom config dialog panel
    async function openConfigDialog() {
      context.ui.dialog.set({ size: "large", centered: true })

      const showMainPanel = () => {
        context.ui.dialog.show(
          () => (
            <box padding={1}>
              <text fg="#a78bfa" bold>🎨 Emoji Settings</text>
              <text fg="#666">─────────────────────────────────</text>
              <text fg="white">📂 Category: <text fg="#4ade80">{String(config.category)}</text></text>
              <text fg="white">🎬 Animation: <text fg="#4ade80">{String(config.animation)}</text></text>
              <text fg="white">⚡ Speed: <text fg="#4ade80">{String(config.speed)}</text></text>
              <text fg="white">🕐 Schedule: <text fg="#4ade80">{String(config.schedule)}</text></text>
              <text fg="white">🔢 Max Emojis: <text fg="#4ade80">{String(config.maxEmojis)}</text></text>
              <text fg="white">⏯️ Status: <text fg={pauseState.paused ? "#ef4444" : "#4ade80"}>
                {String(pauseState.paused ? "Paused" : "Running")}
              </text></text>
              <text fg="#666">─────────────────────────────────</text>
              <text fg="#666">Press Escape to close</text>
            </box>
          ),
          () => {} // onClose callback
        )
      }

      showMainPanel()
    }

    // Individual setting sub-dialogs
    async function openCategoryDialog() {
      const categories = getCategoryList()
      const currentCat = String(config.category)
      const selected = await context.ui.dialog.select({
        title: "📂 Select Emoji Category",
        current: currentCat,
        options: categories.map(cat => ({
          title: cat.charAt(0).toUpperCase() + cat.slice(1),
          value: cat,
          description: `${currentCat === cat ? '(active) ' : ''}${getRandomEmojis(cat, 3).join(' ')}`
        }))
      })
      if (selected) {
        updateConfig(c => { c.category = selected })
        currentEmojis = getRandomEmojis(selected, config.maxEmojis)
        context.ui.toast.show({ title: "Emoji", message: `Category: ${selected}`, variant: "success" })
      }
      openConfigDialog()
    }

    async function openAnimationDialog() {
      const currentAnim = String(config.animation)
      const selected = await context.ui.dialog.select({
        title: "🎬 Select Animation Type",
        current: currentAnim,
        options: ANIMATION_LIST.map(anim => ({
          title: anim.charAt(0).toUpperCase() + anim.slice(1),
          value: anim,
          description: currentAnim === anim ? '(active)' : ''
        }))
      })
      if (selected) {
        updateConfig(c => { c.animation = selected })
        if (isPhysicsAnimation(selected)) {
          initPhysics()
        }
        context.ui.toast.show({ title: "Emoji", message: `Animation: ${selected}`, variant: "success" })
      }
      openConfigDialog()
    }

    async function openSpeedDialog() {
      const currentSpeed = String(config.speed)
      const selected = await context.ui.dialog.select({
        title: "⚡ Select Animation Speed",
        current: currentSpeed,
        options: [
          { title: "🐌 Slow", value: "slow" as AnimationSpeed, description: "1000ms per frame" },
          { title: "🏃 Medium", value: "medium" as AnimationSpeed, description: "500ms per frame" },
          { title: "⚡ Fast", value: "fast" as AnimationSpeed, description: "250ms per frame" },
          { title: "🔧 Custom", value: "custom" as AnimationSpeed, description: `Current: ${String(config.customSpeedMs)}ms` },
        ]
      })
      if (selected) {
        if (selected === "custom") {
          const msStr = await context.ui.dialog.prompt({
            title: "Custom Speed (ms)",
            placeholder: String(config.customSpeedMs),
            description: "Enter milliseconds per frame (100-5000)"
          })
          if (msStr) {
            const ms = parseInt(msStr, 10)
            if (!isNaN(ms) && ms >= 100 && ms <= 5000) {
              updateConfig(c => { c.speed = selected; c.customSpeedMs = ms })
              context.ui.toast.show({ title: "Emoji", message: `Custom speed: ${ms}ms`, variant: "success" })
            } else {
              context.ui.toast.show({ title: "Emoji", message: "Invalid speed value", variant: "error" })
            }
          }
        } else {
          updateConfig(c => { c.speed = selected })
          context.ui.toast.show({ title: "Emoji", message: `Speed: ${selected}`, variant: "success" })
        }
        startAnimation()
      }
      openConfigDialog()
    }

    async function openScheduleDialog() {
      const currentSchedule = String(config.schedule)
      const selected = await context.ui.dialog.select({
        title: "🕐 Select Schedule Mode",
        current: currentSchedule,
        options: [
          { title: "🔄 Always", value: "always" as ScheduleMode, description: "Animation runs continuously" },
          { title: "🕐 Hourly", value: "hourly" as ScheduleMode, description: "Animation at start of each hour" },
        ]
      })
      if (selected) {
        updateConfig(c => { c.schedule = selected })
        context.ui.toast.show({ title: "Emoji", message: `Schedule: ${selected}`, variant: "success" })
      }
      openConfigDialog()
    }

    async function openMaxEmojisDialog() {
      const countStr = await context.ui.dialog.prompt({
        title: "🔢 Max Emojis (1-15)",
        placeholder: String(config.maxEmojis),
        description: "Number of emojis to display"
      })
      if (countStr) {
        const count = parseInt(countStr, 10)
        if (!isNaN(count) && count >= 1 && count <= 15) {
          updateConfig(c => { c.maxEmojis = count })
          currentEmojis = getRandomEmojis(config.category, count)
          context.ui.toast.show({ title: "Emoji", message: `Max emojis: ${count}`, variant: "success" })
        } else {
          context.ui.toast.show({ title: "Emoji", message: "Invalid count (1-15)", variant: "error" })
        }
      }
      openConfigDialog()
    }

    // Register all commands in a single keymap layer via app slot
    context.ui.slot({
      append: "app",
      render: () => {
        context.keymap.layer(() => ({
          mode: "global",
          priority: 10,
          commands: [
            // Main config dialog
            {
              id: "sidebar-emoji-config",
              title: "Emoji Settings",
              description: "Configure sidebar emoji animations",
              group: "Sidebar Emoji",
              palette: true,
              slash: { name: "emoji", aliases: ["em"] },
              run: () => { openConfigDialog() }
            },
            // Individual setting sub-commands (slash only)
            {
              id: "sidebar-emoji-set-category",
              title: "Set Category",
              group: "Sidebar Emoji",
              slash: { name: "emoji-cat" },
              run: () => { openCategoryDialog() }
            },
            {
              id: "sidebar-emoji-set-animation",
              title: "Set Animation",
              group: "Sidebar Emoji",
              slash: { name: "emoji-anim" },
              run: () => { openAnimationDialog() }
            },
            {
              id: "sidebar-emoji-set-speed",
              title: "Set Speed",
              group: "Sidebar Emoji",
              slash: { name: "emoji-speed" },
              run: () => { openSpeedDialog() }
            },
            {
              id: "sidebar-emoji-set-schedule",
              title: "Set Schedule",
              group: "Sidebar Emoji",
              slash: { name: "emoji-schedule" },
              run: () => { openScheduleDialog() }
            },
            {
              id: "sidebar-emoji-set-max",
              title: "Set Max Emojis",
              group: "Sidebar Emoji",
              slash: { name: "emoji-max" },
              run: () => { openMaxEmojisDialog() }
            },
            {
              id: "sidebar-emoji-toggle",
              title: "Toggle Pause",
              group: "Sidebar Emoji",
              slash: { name: "emoji-pause" },
              run: () => {
                setPauseState(s => { s.paused = !s.paused })
                context.ui.toast.show({
                  title: "Emoji",
                  message: pauseState.paused ? "Animation paused" : "Animation resumed",
                  variant: "info"
                })
              }
            }
          ]
        }))
        return null
      }
    })

    // Sidebar footer widget
    context.ui.slot({
      append: "sidebar.footer",
      render: (props) => {
        try {
          const currentFrame = animState.frame
          const isPaused = pauseState.paused
          
          if (!Boolean(config.enabled) || isPaused) {
            return (
              <box padding={1} marginTop={1}>
                <text fg="#666">⏸️ Emoji animations paused</text>
              </box>
            )
          }

          const animationFrame: AnimationFrame = generateFrame(
            config.animation,
            currentEmojis,
            currentFrame
          )

          let displayText = ''
          
          try {
            // Use physics positions for physics-based animations
            if (isPhysicsAnimation(config.animation) && physicsState) {
              const physPositions = getPositions(physicsState)
              const lines: string[] = []
              physPositions
                .filter(p => p.y >= 0 && p.y <= 8 && p.emoji)
                .forEach(p => {
                  const x = Math.max(0, Math.min(MAX_POS, Math.floor(p.x || 0)))
                  const spaces = ' '.repeat(x)
                  lines.push(spaces + String(p.emoji))
                })
              displayText = lines.join('\n') || ' '
            } else {
              // Horizontal rendering: emojis side by side with spacing based on position
              const parts: string[] = []
              animationFrame.emojis.forEach((emoji, i) => {
                const pos = animationFrame.positions[i] || 0
                const safePos = Math.max(0, Math.min(MAX_POS, Math.floor(pos)))
                const spaces = ' '.repeat(safePos)
                parts.push(spaces + String(emoji || ''))
              })
              displayText = parts.join(' ') || ' '
            }
          } catch (err) {
            displayText = ' '
          }

          const status = `${String(config.category)} • ${String(config.animation)} • ${String(config.speed)}`

          return (
            <box padding={1} marginTop={1}>
              <text fg="#a78bfa">{displayText}</text>
              <text fg="#666" dim>{status}</text>
            </box>
          )
        } catch (err) {
          return (
            <box padding={1} marginTop={1}>
              <text fg="#666">⏸️ Emoji error</text>
            </box>
          )
        }
      }
    })

    return () => {
      if (timer) clearInterval(timer)
      if (physicsState) destroyPhysics(physicsState)
    }
  }
})
