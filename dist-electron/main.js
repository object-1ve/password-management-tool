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
    width: 1200,
    // 设置窗口的宽度为 1200 像素。
    height: 800,
    // 设置窗口的高度为 800 像素。
    show: !1,
    // 初始时不显示窗口。
    title: "yzzob",
    icon: e.join(process.env.VITE_PUBLIC, "logo.ico"),
    autoHideMenuBar: !0,
    webPreferences: {
      preload: e.join(d, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0
    }
  }), r.webContents.on("did-finish-load", () => {
    r == null || r.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? r.loadURL(l) : r.loadFile(e.join(E, "index.html")), r.on("ready-to-show", () => {
    r == null || r.show();
  });
}
function I() {
  new p({
    width: 500,
    height: 400,
    webPreferences: {
      preload: e.join(d, "preload.js")
    }
  }).loadFile(e.join(d, "newPage.html"));
}
c.on("open-new-window", () => {
  I();
});
function L() {
  try {
    const n = "mydb.db", o = !!l, t = o ? e.join(process.env.APP_ROOT, "userData", n) : e.join(i.getPath("userData"), n), s = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    T.existsSync(t) || (T.mkdirSync(e.dirname(t), { recursive: !0 }), T.copyFileSync(s, t), console.log("Copied template DB to:", t));
    const a = new R(t);
    a.exec(`
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
};
