import { createApp } from 'vue'
import './assets/css/index.css'
import App from './App.vue'
import router from './router/index'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
app.use(router)
app.use(VueApexCharts)
app.mount('#app')
