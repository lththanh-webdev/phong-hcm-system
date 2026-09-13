import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY
import 'pannellum/build/pannellum.css';
const app = createApp(App)

app.use(router) // <-- BẮT BUỘC PHẢI DÙNG ROUTER Ở ĐÂY

app.mount('#app')