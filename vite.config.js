import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        team: './team.html',
        events: './events.html',
        gallery: './gallery.html',
        leadership: 'leadership.html',
        display: './display.html',
      }
    }
  }
})
