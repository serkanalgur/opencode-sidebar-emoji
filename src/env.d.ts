// JSX runtime declarations for @opentui/solid
declare module "@opentui/solid/jsx-runtime" {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module "@opentui/solid" {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
  export function createComponent(...args: any[]): any
  export function createContext(...args: any[]): any
  export function useContext(...args: any[]): any
}

declare module "solid-js" {
  export function createSignal(...args: any[]): any
  export function createEffect(...args: any[]): any
  export function createMemo(...args: any[]): any
  export function createRoot(...args: any[]): any
  export function on(...args: any[]): any
  export function onMount(...args: any[]): any
  export function onError(...args: any[]): any
  export function createUniqueId(...args: any[]): any
  export function mergeProps(...args: any[]): any
  export function splitProps(...args: any[]): any
  export function batch(...args: any[]): any
  export function untrack(...args: any[]): any
  export function getListener(...args: any[]): any
  export function Show(...args: any[]): any
  export function Switch(...args: any[]): any
  export function Match(...args: any[]): any
  export function Suspense(...args: any[]): any
  export function Lazy(...args: any[]): any
  export function For(...args: any[]): any
  export function Index(...args: any[]): any
  export function Dynamic(...args: any[]): any
  export function Portal(...args: any[]): any
}

// OpenTUI intrinsic elements for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      box: any
      text: any
      span: any
      link: any
      input: any
      textarea: any
      select: any
      "tab-select": any
      "scroll-box": any
      code: any
      markdown: any
      "ascii-font": any
      image: any
      [elemName: string]: any
    }
  }
}
