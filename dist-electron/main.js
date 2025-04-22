import { app as i, BrowserWindow as T, ipcMain as l, dialog as m, clipboard as R } from "electron";
import { fileURLToPath as w } from "node:url";
import e from "node:path";
import E from "better-sqlite3";
import * as d from "fs";
const u = e.dirname(w(import.meta.url));
process.env.APP_ROOT = e.join(u, "..");
const c = process.env.VITE_DEV_SERVER_URL, f = e.join(process.env.APP_ROOT, "dist-electron"), p = e.join(process.env.APP_ROOT, "dist"), _ = c ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = c ? e.join(process.env.APP_ROOT, "public") : p;
let r;
function h() {
  console.log("RENDERER_DIST: ", p), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), r = new T({
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
      preload: e.join(u, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0
    }
  }), r.webContents.on("did-finish-load", () => {
    r == null || r.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? r.loadURL(c) : r.loadFile(e.join(p, "index.html")), r.on("ready-to-show", () => {
    r == null || r.show();
  });
}
function P() {
  try {
    const s = "mydb.db", o = !!c, n = o ? e.join(process.env.APP_ROOT, "userData", s) : e.join(i.getPath("userData"), s), t = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    d.existsSync(n) || (d.mkdirSync(e.dirname(n), { recursive: !0 }), d.copyFileSync(t, n), console.log("Copied template DB to:", n));
    const a = new E(n);
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
  } catch (s) {
    console.error("DB Error:", s.message);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), r = null);
});
i.on("activate", () => {
  T.getAllWindows().length === 0 && (h(), P());
});
i.whenReady().then(() => {
  h(), P();
});
l.handle("database:query", async (s, { sql: o, params: n = [] }) => {
  try {
    const t = new E(_);
    if (o.trim().toLowerCase().startsWith("select")) {
      const a = t.prepare(o).all(n);
      return t.close(), a;
    } else {
      const a = t.prepare(o).run(n);
      return t.close(), { affectedRows: a.changes };
    }
  } catch (t) {
    return console.error("Database query error:", t.message), Promise.reject(t);
  }
});
l.handle("dialog:openFile", async (s, o) => await m.showOpenDialog(o));
l.handle("dialog:saveFile", async (s, o) => m.showSaveDialog(o));
l.handle("clipboard:writeText", async (s, o) => R.writeText(o));
export {
  f as MAIN_DIST,
  p as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
