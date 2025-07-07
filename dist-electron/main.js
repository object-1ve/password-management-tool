<<<<<<< HEAD
import { app as i, ipcMain as c, BrowserWindow as p, dialog as u, clipboard as w } from "electron";
import { fileURLToPath as P } from "node:url";
import e from "node:path";
import R from "better-sqlite3";
import * as T from "fs";
const d = e.dirname(P(import.meta.url));
process.env.APP_ROOT = e.join(d, "..");
const l = process.env.VITE_DEV_SERVER_URL, g = e.join(process.env.APP_ROOT, "dist-electron"), E = e.join(process.env.APP_ROOT, "dist"), _ = l ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = l ? e.join(process.env.APP_ROOT, "public") : E;
let r;
function h() {
  console.log("RENDERER_DIST: ", E), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), r = new p({
=======
import { app, ipcMain, BrowserWindow, dialog, clipboard } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
import * as fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const dbPath = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "userData", "mydb.db") : path.join(app.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  console.log("RENDERER_DIST: ", RENDERER_DIST);
  console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC);
  win = new BrowserWindow({
>>>>>>> f74665ed766f52c70fe7cc7ec854645ca6dc2b3a
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
<<<<<<< HEAD
      preload: e.join(d, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0
    }
  }), r.webContents.on("did-finish-load", () => {
    r == null || r.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? r.loadURL(l) : r.loadFile(e.join(E, "index.html")), r.on("ready-to-show", () => {
    r == null || r.show();
=======
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
>>>>>>> f74665ed766f52c70fe7cc7ec854645ca6dc2b3a
  });
}
function createNewWindow() {
  const newWin = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
<<<<<<< HEAD
      preload: e.join(d, "preload.js")
    }
  }).loadFile(e.join(d, "newPage.html"));
=======
      preload: path.join(__dirname, "preload.js")
    }
  });
  newWin.loadFile(path.join(__dirname, "newPage.html"));
>>>>>>> f74665ed766f52c70fe7cc7ec854645ca6dc2b3a
}
ipcMain.on("open-new-window", () => {
  createNewWindow();
});
<<<<<<< HEAD
function L() {
  try {
    const n = "mydb.db", o = !!l, t = o ? e.join(process.env.APP_ROOT, "userData", n) : e.join(i.getPath("userData"), n), s = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    T.existsSync(t) || (T.mkdirSync(e.dirname(t), { recursive: !0 }), T.copyFileSync(s, t), console.log("Copied template DB to:", t));
    const a = new R(t);
    a.exec(`
=======
function createDatabase() {
  try {
    const dbName = "mydb.db";
    const isDev = !!VITE_DEV_SERVER_URL;
    const targetPath = isDev ? path.join(process.env.APP_ROOT, "userData", dbName) : path.join(app.getPath("userData"), dbName);
    const sourcePath = isDev ? path.join(process.env.APP_ROOT, "resources", "template.db") : path.join(process.resourcesPath, "template.db");
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
      console.log("Copied template DB to:", targetPath);
    }
    const db = new Database(targetPath);
    db.exec(`
>>>>>>> f74665ed766f52c70fe7cc7ec854645ca6dc2b3a
      CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        url TEXT,
        remark TEXT,
        updateTime TEXT NOT NULL,
        createTime TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS instructions (
        id INTEGER NOT NULL DEFAULT NULL COLLATE RTRIM PRIMARY KEY AUTOINCREMENT,
        keys TEXT,
        functions TEXT,
        last_used_time INTEGER,
        remarks TEXT
      );
<<<<<<< HEAD
      
    `);
    try {
      a.exec(`
        ALTER TABLE passwords ADD COLUMN numberOfUses TEXT DEFAULT '0';
      `);
    } catch (m) {
      m.message.includes("duplicate column name") || console.error("添加 numberOfUses 字段失败:", m.message);
    }
    a.close();
  } catch (n) {
    console.error("DB Error:", n.message);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), r = null);
});
i.on("activate", () => {
  p.getAllWindows().length === 0 && (h(), L());
});
i.whenReady().then(() => {
  h(), L();
});
c.handle("database:query", async (n, { sql: o, params: t = [] }) => {
  try {
    const s = new R(_);
    if (o.trim().toLowerCase().startsWith("select")) {
      const a = s.prepare(o).all(t);
      return s.close(), a;
    } else {
      const a = s.prepare(o).run(t);
      return s.close(), { affectedRows: a.changes };
    }
  } catch (s) {
    return console.error("Database query error:", s.message), Promise.reject(s);
  }
});
c.handle("dialog:openFile", async (n, o) => await u.showOpenDialog(o));
c.handle("dialog:saveFile", async (n, o) => u.showSaveDialog(o));
c.handle("clipboard:writeText", async (n, o) => w.writeText(o));
c.handle("clipboard:readText", async (n, o) => w.readText(o));
export {
  g as MAIN_DIST,
  E as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
=======
    `);
    db.close();
  } catch (err) {
    console.error("DB Error:", err.message);
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
ipcMain.handle("clipboard:writeText", async (_, text) => {
  return clipboard.writeText(text);
});
ipcMain.handle("clipboard:readText", async (_, text) => {
  return clipboard.readText(text);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
>>>>>>> f74665ed766f52c70fe7cc7ec854645ca6dc2b3a
};
