import { app as i, ipcMain as c, BrowserWindow as p, dialog as m, clipboard as u } from "electron";
import { fileURLToPath as P } from "node:url";
import e from "node:path";
import w from "better-sqlite3";
import * as T from "fs";
const l = e.dirname(P(import.meta.url));
process.env.APP_ROOT = e.join(l, "..");
const d = process.env.VITE_DEV_SERVER_URL, f = e.join(process.env.APP_ROOT, "dist-electron"), E = e.join(process.env.APP_ROOT, "dist"), _ = d ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = d ? e.join(process.env.APP_ROOT, "public") : E;
let n;
function R() {
  console.log("RENDERER_DIST: ", E), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), n = new p({
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
      preload: e.join(l, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0
    }
  }), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), d ? n.loadURL(d) : n.loadFile(e.join(E, "index.html")), n.on("ready-to-show", () => {
    n == null || n.show();
  });
}
function I() {
  new p({
    width: 500,
    height: 400,
    webPreferences: {
      preload: e.join(l, "preload.js")
    }
  }).loadFile(e.join(l, "newPage.html"));
}
c.on("open-new-window", () => {
  I();
});
function h() {
  try {
    const r = "mydb.db", o = !!d, s = o ? e.join(process.env.APP_ROOT, "userData", r) : e.join(i.getPath("userData"), r), t = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    T.existsSync(s) || (T.mkdirSync(e.dirname(s), { recursive: !0 }), T.copyFileSync(t, s), console.log("Copied template DB to:", s));
    const a = new w(s);
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
    `), a.close();
  } catch (r) {
    console.error("DB Error:", r.message);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), n = null);
});
i.on("activate", () => {
  p.getAllWindows().length === 0 && (R(), h());
});
i.whenReady().then(() => {
  R(), h();
});
c.handle("database:query", async (r, { sql: o, params: s = [] }) => {
  try {
    const t = new w(_);
    if (o.trim().toLowerCase().startsWith("select")) {
      const a = t.prepare(o).all(s);
      return t.close(), a;
    } else {
      const a = t.prepare(o).run(s);
      return t.close(), { affectedRows: a.changes };
    }
  } catch (t) {
    return console.error("Database query error:", t.message), Promise.reject(t);
  }
});
c.handle("dialog:openFile", async (r, o) => await m.showOpenDialog(o));
c.handle("dialog:saveFile", async (r, o) => m.showSaveDialog(o));
c.handle("clipboard:writeText", async (r, o) => u.writeText(o));
c.handle("clipboard:readText", async (r, o) => u.readText(o));
export {
  f as MAIN_DIST,
  E as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
