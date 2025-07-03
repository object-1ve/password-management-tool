
// 
import { createApp } from 'vue'
import './style.css'
// import 'naive-ui/dist/index.css'
// import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
// import naive from 'naive-ui'
// import ElementPlus from 'element-plus'
// require('update-electron-app')()

const app = createApp(App)
app.use(router)
app.mount('#app')

// app.use(naive)
// app.use(ElementPlus)
// app.use(ElementPlus, { size: 'small', zIndex: 3000 })
