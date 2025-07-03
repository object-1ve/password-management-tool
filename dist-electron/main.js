import { app as i, ipcMain as c, BrowserWindow as m, dialog as w, clipboard as h } from "electron";
import { fileURLToPath as R } from "node:url";
import e from "node:path";
import u from "better-sqlite3";
import * as p from "fs";
const d = e.dirname(R(import.meta.url));
process.env.APP_ROOT = e.join(d, "..");
const l = process.env.VITE_DEV_SERVER_URL, D = e.join(process.env.APP_ROOT, "dist-electron"), T = e.join(process.env.APP_ROOT, "dist"), _ = l ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = l ? e.join(process.env.APP_ROOT, "public") : T;
let r;
function E() {
  console.log("RENDERER_DIST: ", T), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), r = new m({
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
  }), l ? r.loadURL(l) : r.loadFile(e.join(T, "index.html")), r.on("ready-to-show", () => {
    r == null || r.show();
  });
}
function b() {
  new m({
    width: 500,
    height: 400,
    webPreferences: {
      preload: e.join(d, "preload.js")
    }
  }).loadFile(e.join(d, "newPage.html"));
}
c.on("open-new-window", () => {
  b();
});
function P() {
  try {
    const n = "mydb.db", o = !!l, s = o ? e.join(process.env.APP_ROOT, "userData", n) : e.join(i.getPath("userData"), n), t = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    p.existsSync(s) || (p.mkdirSync(e.dirname(s), { recursive: !0 }), p.copyFileSync(t, s), console.log("Copied template DB to:", s));
    const a = new u(s);
    a.exec(`
      CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        url TEXT,
        remark TEXT,
        updateTime TEXT NOT NULL,
        createTime TEXT NOT NULL
      )
    `), a.close();
  } catch (n) {
    console.error("DB Error:", n.message);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), r = null);
});
i.on("activate", () => {
  m.getAllWindows().length === 0 && (E(), P());
});
i.whenReady().then(() => {
  E(), P();
});
c.handle("database:query", async (n, { sql: o, params: s = [] }) => {
  try {
    const t = new u(_);
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
c.handle("dialog:openFile", async (n, o) => await w.showOpenDialog(o));
c.handle("dialog:saveFile", async (n, o) => w.showSaveDialog(o));
c.handle("clipboard:writeText", async (n, o) => h.writeText(o));
c.handle("clipboard:readText", async (n, o) => h.readText(o));
export {
  D as MAIN_DIST,
  T as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
