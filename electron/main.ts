import { app, BrowserWindow, ipcMain,dialog } from 'electron';
// import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Database from 'better-sqlite3';

// const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url); // Add this line
// const __dirname = path.dirname(__filename); // Modify this line to use __filename
// process.env.APP_ROOT = path.join(__dirname, '..');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
const dbPath = path.join(process.env.APP_ROOT, 'mydb.db');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200, // 设置窗口的宽度为 1200 像素。
    height: 800, // 设置窗口的高度为 800 像素。
    show: false, // 初始时不显示窗口。
    title: "yzzob",
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true
    },
  });


  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  win.on("ready-to-show", () => {
    win?.show();
  });
}

function createDatabase(): void {
  try {
    // 创建或打开数据库（如果不存在会自动创建）
    const db = new Database(dbPath);
    console.log('Connected to the SQLite database using better-sqlite3.');

    // 创建表
    db.exec(`
      CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        url TEXT,
        remark TEXT,
        updateTime TEXT NOT NULL,
        createTime TEXT NOT NULL
      )
    `);
    console.log('Table created or already exists');

    // 关闭数据库连接
    db.close();
    console.log('Closed the database connection.');
  } catch (err: any) {
    console.error('Error interacting with the database:', err.message);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    createDatabase();
  }
});

app.whenReady().then(() => {
  createWindow();
  createDatabase(); // Ensure database is created when the app is ready
});

ipcMain.handle('database:query', async (_, { sql, params = [] }: { sql: string; params?: any[] }) => {
  try {
    const db = new Database(dbPath);
    if (sql.trim().toLowerCase().startsWith('select')) {
      const rows = db.prepare(sql).all(params);
      db.close();
      return rows;
    } else {
      const statement = db.prepare(sql).run(params);
      db.close();
      return { affectedRows: statement.changes };
    }
  } catch (error: any) {
    console.error('Database query error:', error.message);
    return Promise.reject(error);
  }
});
// ipcMain.handle('writeToClipboard', (event, text) => {
//   clipboard.writeText(text);
// });
ipcMain.handle('dialog:openFile', async (_, options) => {
  return await dialog.showOpenDialog(options)
})
