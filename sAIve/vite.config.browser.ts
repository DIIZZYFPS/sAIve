// vite.config.browser.ts
// Used by `npm run browser` — pure browser dev mode, no Electron.
// Backend is started separately on a fixed port (default: 8000).
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default defineConfig({
    define: {
        '__APP_VERSION__': JSON.stringify(packageJson.version),
    },
    base: './',
    plugins: [
        react(),
        tailwindcss(),
        // NOTE: vite-plugin-electron and renderer are intentionally omitted here.
        // This config is for browser-only development.
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
