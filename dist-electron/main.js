import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const dbPath = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "userData", "mydb.db") : path.join(process.env.APP_ROOT, "..", "userData", "mydb.db");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  console.log("RENDERER_DIST: ", RENDERER_DIST);
  console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC);
  win = new BrowserWindow({
    width: 1200,
    // 设置窗口的宽度为 1200 像素。
    height: 800,
    // 设置窗口的高度为 800 像素。
    show: false,
    // 初始时不显示窗口。
    title: "yzzob",
    icon: path.join(process.env.VITE_PUBLIC, "logo.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.on("ready-to-show", () => {
    win == null ? void 0 : win.show();
  });
}
function createDatabase() {
  try {
    const db = new Database(dbPath);
    console.log("Connected to the SQLite database using better-sqlite3.");
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
    console.log("Table created or already exists");
    db.close();
    console.log("Closed the database connection.");
  } catch (err) {
    console.error("Error interacting with the database:", err.message);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    createDatabase();
  }
});
app.whenReady().then(() => {
  createWindow();
  createDatabase();
});
ipcMain.handle("database:query", async (_, { sql, params = [] }) => {
  try {
    const db = new Database(dbPath);
    if (sql.trim().toLowerCase().startsWith("select")) {
      const rows = db.prepare(sql).all(params);
      db.close();
      return rows;
    } else {
      const statement = db.prepare(sql).run(params);
      db.close();
      return { affectedRows: statement.changes };
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return Promise.reject(error);
  }
});
ipcMain.handle("dialog:openFile", async (_, options) => {
  return await dialog.showOpenDialog(options);
});
ipcMain.handle("dialog:saveFile", async (_, options) => {
  return dialog.showSaveDialog(options);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
