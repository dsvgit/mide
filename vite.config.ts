import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_APP ? undefined : 'https://dsvgit.github.io/mide/',
  plugins: [react(), visualizer()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: 'slate-react',
        replacement: path.resolve(
          __dirname,
          'node_modules/slate-packages/packages/slate-react'
        ),
      },
    ],
  },
})
