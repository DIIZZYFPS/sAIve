import { createContext, useContext, useEffect, useState } from "react"

export type Mode = "dark" | "light" | "system"
export type ColorTheme = "theme-dynamic" | "theme-mint" | "theme-emerald"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
  defaultColorTheme?: ColorTheme
  storageKeyMode?: string
  storageKeyTheme?: string
}

type ThemeProviderState = {
  mode: Mode
  colorTheme: ColorTheme
  setMode: (mode: Mode) => void
  setColorTheme: (theme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  mode: "system",
  colorTheme: "theme-dynamic",
  setMode: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultColorTheme = "theme-dynamic",
  storageKeyMode = "vite-ui-mode",
  storageKeyTheme = "vite-ui-color-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(storageKeyMode) as Mode) || defaultMode
  )

  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (localStorage.getItem(storageKeyTheme) as ColorTheme) || defaultColorTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // 1. Apply Light/Dark Mode
    root.classList.remove("light", "dark")
    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(mode)
    }

    // 2. Apply Color Theme
    root.classList.remove("theme-dynamic", "theme-mint", "theme-emerald")
    root.classList.add(colorTheme)

  }, [mode, colorTheme])

  const value = {
    mode,
    colorTheme,
    setMode: (newMode: Mode) => {
      localStorage.setItem(storageKeyMode, newMode)
      setMode(newMode)
    },
    setColorTheme: (newTheme: ColorTheme) => {
      localStorage.setItem(storageKeyTheme, newTheme)
      setColorTheme(newTheme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
