import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "sidebar-emoji",
  async setup(ctx) {
    // Server-side plugin (minimal — all logic lives in tui.tsx)
    // This entry exists so OpenCode's server-side loader can discover the plugin.
  }
})
