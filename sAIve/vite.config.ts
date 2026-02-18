import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__APP_VERSION__': JSON.stringify(packageJson.version),
  },
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron.js',
      },
      {
        entry: path.join(__dirname, 'public/preload.js'),
        onstart(options) {
          // Now we can use Esbuild Build API to build the preload script
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
