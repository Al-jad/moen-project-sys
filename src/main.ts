import axios from 'axios';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import App from './App.vue';
import './assets/css/index.css';
import router from './router/index';

// Configure axios
axios.defaults.baseURL = 'https://pmsapi.alfakharco.com/api';
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(VueApexCharts);

app.mount('#app');
