import { app as i, ipcMain as l, BrowserWindow as m, dialog as w, clipboard as P } from "electron";
import { fileURLToPath as R } from "node:url";
import e from "node:path";
import E from "better-sqlite3";
import * as p from "fs";
const d = e.dirname(R(import.meta.url));
process.env.APP_ROOT = e.join(d, "..");
const c = process.env.VITE_DEV_SERVER_URL, D = e.join(process.env.APP_ROOT, "dist-electron"), T = e.join(process.env.APP_ROOT, "dist"), _ = c ? e.join(process.env.APP_ROOT, "userData", "mydb.db") : e.join(i.getPath("userData"), "mydb.db");
process.env.VITE_PUBLIC = c ? e.join(process.env.APP_ROOT, "public") : T;
let n;
function h() {
  console.log("RENDERER_DIST: ", T), console.log("VITE_PUBLIC: ", process.env.VITE_PUBLIC), n = new m({
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
  }), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? n.loadURL(c) : n.loadFile(e.join(T, "index.html")), n.on("ready-to-show", () => {
    n == null || n.show();
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
l.on("open-new-window", () => {
  b();
});
function u() {
  try {
    const r = "mydb.db", o = !!c, s = o ? e.join(process.env.APP_ROOT, "userData", r) : e.join(i.getPath("userData"), r), t = o ? e.join(process.env.APP_ROOT, "resources", "template.db") : e.join(process.resourcesPath, "template.db");
    p.existsSync(s) || (p.mkdirSync(e.dirname(s), { recursive: !0 }), p.copyFileSync(t, s), console.log("Copied template DB to:", s));
    const a = new E(s);
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
  } catch (r) {
    console.error("DB Error:", r.message);
  }
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && (i.quit(), n = null);
});
i.on("activate", () => {
  m.getAllWindows().length === 0 && (h(), u());
});
i.whenReady().then(() => {
  h(), u();
});
l.handle("database:query", async (r, { sql: o, params: s = [] }) => {
  try {
    const t = new E(_);
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
l.handle("dialog:openFile", async (r, o) => await w.showOpenDialog(o));
l.handle("dialog:saveFile", async (r, o) => w.showSaveDialog(o));
l.handle("clipboard:writeText", async (r, o) => P.writeText(o));
export {
  D as MAIN_DIST,
  T as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
