import { app as i, BrowserWindow as T, ipcMain as p, dialog as m } from "electron";
import { fileURLToPath as R } from "node:url";
import e from "node:path";
import E from "better-sqlite3";
import * as l from "fs";
const u = e.dirname(R(import.meta.url));
process.env.APP_ROOT = e.join(u, "..");
const c = process.env.VITE_DEV_SERVER_URL, O = e.join(process.env.APP_ROOT, "dist-electron"), d = e.join(process.env.APP_ROOT, "dist"), _ = c ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = c ? e.join(process.env.APP_ROOT, "public") : d;
let o;
function h() {
  console.log("RENDERER_DIST: ", d), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), o = new T({
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
  }), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? o.loadURL(c) : o.loadFile(e.join(d, "index.html")), o.on("ready-to-show", () => {
    o == null || o.show();
  });
}
function P() {
  try {
    const n = "mydb.db", r = !!c, t = r ? e.join(process.env.APP_ROOT, "userData", n) : e.join(i.getPath("userData"), n), s = r ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    l.existsSync(t) || (l.mkdirSync(e.dirname(t), { recursive: !0 }), l.copyFileSync(s, t), console.log("Copied template DB to:", t));
    const a = new E(t);
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
  process.platform !== "darwin" && (i.quit(), o = null);
});
i.on("activate", () => {
  T.getAllWindows().length === 0 && (h(), P());
});
i.whenReady().then(() => {
  h(), P();
});
p.handle("database:query", async (n, { sql: r, params: t = [] }) => {
  try {
    const s = new E(_);
    if (r.trim().toLowerCase().startsWith("select")) {
      const a = s.prepare(r).all(t);
      return s.close(), a;
    } else {
      const a = s.prepare(r).run(t);
      return s.close(), { affectedRows: a.changes };
    }
  } catch (s) {
    return console.error("Database query error:", s.message), Promise.reject(s);
  }
});
p.handle("dialog:openFile", async (n, r) => await m.showOpenDialog(r));
p.handle("dialog:saveFile", async (n, r) => m.showSaveDialog(r));
export {
  O as MAIN_DIST,
  d as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
