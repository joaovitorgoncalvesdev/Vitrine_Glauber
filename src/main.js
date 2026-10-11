import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dialog, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './styles/app.css'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(Quasar, {
    plugins: { Dialog, Notify },
    config: { brand: { primary: '#2455C7', secondary: '#182643', accent: '#FFD449', positive: '#258C6A', dark: '#111A30' } },
  })
  .mount('#app')
