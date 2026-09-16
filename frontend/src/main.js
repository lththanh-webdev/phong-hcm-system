import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // hoặc đường dẫn chính xác đến file css của bạn
// Import CSS của thư viện Pannellum dùng cho không gian 360 độ
import 'pannellum/build/pannellum.css';

const app = createApp(App)

app.use(router)

app.mount('#app')