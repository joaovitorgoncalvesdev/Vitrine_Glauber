import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ autoImportComponentCase: 'kebab' }),
  ],
  server: {
    host: '127.0.0.1',
    port: 4173,
  },
})
