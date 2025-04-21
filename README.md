# Electron-y

记录我electron的学习之旅


## 0421
通过修改forge.config.cjs和package.json
  "config": {
    "forge": "./forge.config.cjs"
  }

const dbPath = VITE_DEV_SERVER_URL? path.join(process.env.APP_ROOT,'userData', 'mydb.db') :path.join(process.env.APP_ROOT, '..','userData', 'mydb.db');
修复了打包错误的问题
真是要动脑子^v^